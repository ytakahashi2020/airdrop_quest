"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import BattlePopup from "../components/BattlePopup";
import VictoryPopup from "../components/VictoryPopup";
import {
  attemptHerbDrop,
  enemyAttack,
  handleKeyPress,
  handleUseHerb,
  startRandomBattleSteps,
} from "../utils/gameFunctions";

import {
  playBattleMusic,
  playNormalMusic,
  stopBattleMusic,
  stopNormalMusic
} from "../utils/audioManager"; // 音声管理ファイルをインポート

import { enemies } from "../utils/enemies";
import { playerImages } from "../utils/playerImages"; // playerImagesをインポート

import { Enemy, QuizData } from "../utils/types"; // 型定義をインポート

import { gainExperience, levelUp } from "../utils/levelUp";

import Tile from "../utils/tile";

import {
  ATTACK_EFFECT_TIME,
  ENEMY_ATTACK_DELAY,
  ENEMY_DEFEAT_DELAY,
  LEVEL_UP_POPUP_DISPLAY_TIME,
  MAGIC_EFFECT_TIME,
  PLAYER_ATTACK_DAMAGE,
  PLAYER_MAGIC_DAMAGE,
  VICTORY_POPUP_DISPLAY_TIME,
} from "../utils/constants";

import styles from "../field.module.css"; // CSSモジュールのインポート

import { UtilContext } from "@/context/UtilProvider";
import Loading from "../components/Loading";
import { generateQuizData } from "../utils/ai";
import {generateMonsterData} from "../utils/ai";
import { set } from "@metaplex-foundation/umi/serializers";

const Game = () => {
  const [playerPosition, setPlayerPosition] = useState({ x: 10, y: 10 });
  const [playerHp, setPlayerHp] = useState(40); // HP
  const [playerMp, setPlayerMp] = useState(30); // MP
  const [playerLevel, setPlayerLevel] = useState(1); // レベル
  const [playerExp, setPlayerExp] = useState(0); // 累積経験値
  const [gainedExpMessage, setGainedExpMessage] = useState(""); // 経験値を取得したメッセージ
  const [levelUpMessage, setLevelUpMessage] = useState(""); // レベルアップメッセージ
  const [statIncreaseMessage, setStatIncreaseMessage] = useState("");

  const [playerAttack, setPlayerAttack] = useState(10); // 攻撃力
  const [playerDefense, setPlayerDefense] = useState(5); // 防御力

  const [herbCount, setHerbCount] = useState(0); // やくそうの所持数
  const [isBattlePopupVisible, setIsBattlePopupVisible] = useState(false);
  const [nextBattleSteps, setNextBattleSteps] = useState<number>(10);
  const [steps, setSteps] = useState<number>(0);

  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [isVictoryPopupVisible, setIsVictoryPopupVisible] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [enemyAttackMessage, setEnemyAttackMessage] = useState("");
  const [herbMessage, setHerbMessage] = useState(""); // やくそうを入手したメッセージ
  const [leveledUp, setLeveledUp] = useState(false); // レベルアップ状態を管理
  // 音楽ファイルのAudioオブジェクトをクライアントサイドで初期化
  const [normalMusic, setNormalMusic] = useState<HTMLAudioElement | null>(null);
  const [battleMusic, setBattleMusic] = useState<HTMLAudioElement | null>(null);
  const [swordSound, setSwordSound] = useState<HTMLAudioElement | null>(null);
  const [herbSound, setHerbSound] = useState<HTMLAudioElement | null>(null); // やくそう使用時の音
  const [victorySound, setVictorySound] = useState<HTMLAudioElement | null>(
    null
  ); // 勝利時の音
  const [enemyAttackSound, setEnemyAttackSound] =
    useState<HTMLAudioElement | null>(null); // 敵の攻撃音

  const [direction, setDirection] = useState<"up" | "down" | "left" | "right">(
    "down"
  ); // プレイヤーの向き
  const [animationFrame, setAnimationFrame] = useState(0); // 画像を切り替えるためのフレーム
  const [showAttackEffect, setShowAttackEffect] = useState(false); // 攻撃エフェクトの表示状態
  const [showMagicEffect, setShowMagicEffect] = useState(false); // 魔法エフェクトの表示状態
  const [enemyOpacity, setEnemyOpacity] = useState(1); // 透明度の状態管理
  const [isMagicConfirmVisible, setIsMagicConfirmVisible] = useState(false); // 魔法の確認ポップアップの表示状態
  const [showEnemyAttackEffect, setShowEnemyAttackEffectEffect] =
    useState(false); // 敵からの攻撃エフェクトの表示状態
  const [isQuizActive, setIsQuizActive] = useState(false); // クイズがアクティブかどうか
  const [quizText, setQuizText] = useState(""); // クイズの選択肢
  const [quizOptions, setQuizOptions] = useState<string[]>([]); // クイズの選択肢

  const [quizAnswer, setQuizAnswer] = useState(""); // ユーザーのクイズ回答
  const [quizResultMessage, setQuizResultMessage] = useState(""); // クイズ結果メッセージの状態
  const [correctAnswer, setCorrectAnswer] = useState(""); // クイズの正解を管理する状態

  // スクロール用の ref を作成
  const gameContainerRef = useRef<HTMLDivElement | null>(null);
  // UtilContext コンテキストを作成
  const utilContext = useContext(UtilContext);

  // プレイヤーの位置に基づいてスクロールする処理
  useEffect(() => {
    if (gameContainerRef.current) {
      const container = gameContainerRef.current;
      const tileWidth = 32; // タイルの幅
      const tileHeight = 32; // タイルの高さ

      // プレイヤーの位置に基づいてスクロール位置を計算
      let scrollX = playerPosition.x * tileWidth - container.clientWidth / 2;
      let scrollY = playerPosition.y * tileHeight - container.clientHeight / 2;

      // スクロール可能な範囲の最大値を計算
      const maxScrollX = container.scrollWidth - container.clientWidth;
      const maxScrollY = container.scrollHeight - container.clientHeight;

      //// スクロール位置が範囲外に行かないように制限
      scrollX = Math.max(0, Math.min(scrollX, maxScrollX));
      scrollY = Math.max(0, Math.min(scrollY, maxScrollY));

      // スクロールの実行
      container.scrollTo({
        left: scrollX,
        top: scrollY,
        behavior: "smooth", // スムーズスクロール
      });
    }
  }, [playerPosition]);


  // クイズのオプションを作成する関数（例として簡単なクイズを設定）
  const generateQuiz = async() => {
    utilContext.setLoading(true);
    console.log("loading", utilContext.loading);
    // APIを呼び出してクイズを自動生成する。
    const quizData: QuizData = await generateQuizData();
    setQuizText(quizData?.question!);
    setCorrectAnswer(quizData?.correct_answer!);
    utilContext.setLoading(false);
    return [quizData?.answers.A, quizData?.answers.B, quizData?.answers.C, quizData.answers.D];
  };


  // ①音源の初期化
  useEffect(() => {
    if (typeof window !== "undefined") {
      // クライアントサイドでのみAudioを初期化
      setNormalMusic(new Audio("/music/normalMusic.mp3"));
      setBattleMusic(new Audio("/music/battleMusic.mp3"));
      setSwordSound(new Audio("/sounds/sword.mp3"));
      setHerbSound(new Audio("/sounds/herbSound.mp3")); // やくそう使用時の音を初期化
      setVictorySound(new Audio("/sounds/victorySound.mp3")); // 勝利時の音を初期化
      setEnemyAttackSound(new Audio("/sounds/enemyAttack.mp3"));
    }
  }, []);

  // ②アニメーションフレームの切り替え
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame((prevFrame) => (prevFrame === 0 ? 1 : 0)); // フレームを切り替える
    }, 600); // 1秒ごとに切り替え

    return () => clearInterval(interval); // クリーンアップ
  }, []);

  // ③通常音楽の再生を開始
  useEffect(() => {
    playNormalMusic(normalMusic);
    return () => {
      stopNormalMusic(normalMusic); // クリーンアップ
    };
  }, [normalMusic]);

  // ④戦闘が始まるときの音楽を切り替え
  useEffect(() => {
    if (isBattlePopupVisible) {
      stopNormalMusic(normalMusic); // 通常の音楽を停止
      playBattleMusic(battleMusic); // 戦闘音楽を再生
    } else {
      stopBattleMusic(battleMusic); // 戦闘音楽を停止

      // 2秒の遅延を追加して通常の音楽を再開
      setTimeout(() => {
        playNormalMusic(normalMusic); // 通常音楽を再生
      }, 2000);
    }

    return () => {
      stopBattleMusic(battleMusic); // コンポーネント終了時に戦闘音楽を停止
      stopNormalMusic(normalMusic); // 通常音楽も停止
    };
  }, [isBattlePopupVisible, normalMusic, battleMusic]);

  // ⑤ランダムステップの設定
  useEffect(() => {
    startRandomBattleSteps(setNextBattleSteps, setSteps); // setNextBattleSteps, setStepsが渡されているか確認
  }, [setNextBattleSteps, setSteps]);

  // ⑥敵からの攻撃
  const handleEnemyAttack = () => {
    enemyAttack(
      currentEnemy,
      setPlayerHp,
      setEnemyAttackMessage,
      setIsPlayerTurn,
      enemyAttackSound,
      setShowEnemyAttackEffectEffect
    );

  };

  useEffect(() => {
    // player HPが0以下になったら
    if (playerHp <= 0) {
      handleGameOver();
    }
  })

  const handleGameOver = () => {
  setPlayerHp(50); // HPのリセット
  setPlayerMp(30); // MPのリセット
  setPlayerPosition({ x: 10, y: 10 }); // プレイヤー位置のリセット
  setIsBattlePopupVisible(false); // バトル画面を閉じる
  setIsVictoryPopupVisible(false); // 勝利画面を閉じる
  setSteps(0); // 歩数のリセット
  }

  // ⑦敵への攻撃
  const handleAttack = () => {
    if (currentEnemy && isPlayerTurn && !isQuizActive) {
      if (swordSound)
        swordSound
          .play()
          .catch((err) => console.error("Error playing sword sound:", err)); // エラーキャッチ

      const newHp = currentEnemy.hp - PLAYER_ATTACK_DAMAGE;
      setEnemyOpacity(0.5); // 敵がヒットした時の透明度
      setShowAttackEffect(true); // 攻撃エフェクトを表示
      setTimeout(() => {
        setEnemyOpacity(1);
        setShowAttackEffect(false);
      }, ATTACK_EFFECT_TIME);

      setEnemyAttackMessage(`Dealt ${PLAYER_ATTACK_DAMAGE} damage`); // Display damage

      // 敵のHPが0以下になったら
      if (newHp <= 0) {
        setCurrentEnemy({ ...currentEnemy, hp: 0 });
        setTimeout(() => {
          attemptHerbDrop(currentEnemy, setHerbCount, setHerbMessage);
          // 経験値を獲得
          const gainedExp = currentEnemy.experience;
          // setPlayerExp((prevExp) => prevExp + gainedExp); // 経験値を追加
          handleGainExperience(gainedExp);
          setGainedExpMessage(`Gained ${gainedExp} experience points`); // Set message

          console.log("leveledUp", leveledUp);
          if (victorySound) victorySound.play();
          setIsBattlePopupVisible(false);
          setIsVictoryPopupVisible(true);

          // レベルアップ時は長めに表示する
          const popupDisplayTime = leveledUp
            ? LEVEL_UP_POPUP_DISPLAY_TIME
            : VICTORY_POPUP_DISPLAY_TIME;
          console.log("popupDisplayTime", popupDisplayTime);
          setTimeout(() => {
            setIsVictoryPopupVisible(false);
            setHerbMessage(""); // 勝利ポップアップが消える時にメッセージもリセット
            // setGainedExpMessage("");
            setLevelUpMessage(""); // レベルアップメッセージをリセット
            setStatIncreaseMessage("");
            startRandomBattleSteps(setNextBattleSteps, setSteps);
          }, popupDisplayTime);
        }, ENEMY_DEFEAT_DELAY);
      }
      // 敵のHPが残っていたら
      else {
        setCurrentEnemy({ ...currentEnemy, hp: newHp });
        setIsPlayerTurn(false);
        setTimeout(() => {
          handleEnemyAttack();
        }, ENEMY_ATTACK_DELAY);
      }
    }
  };

  const [isMagicProcessing, setIsMagicProcessing] = useState(false); // 魔法処理の進行中かどうか

// ⑦敵への攻撃(魔法)
const handleMagic = async () => {
  if (currentEnemy && isPlayerTurn && !isQuizActive && !isMagicProcessing) {
    // Trigger quiz mode
    setIsQuizActive(true); // Keep the circle visible by setting quiz to active
    setIsMagicProcessing(true); // Start magic processing
    setQuizText(""); // Reset the quiz text
    setQuizOptions(await generateQuiz());
  }
};


// クイズの回答処理
const handleQuizAnswer = (answer: string) => {
  if (!currentEnemy) return; // currentEnemyが存在しない場合は終了

  setQuizAnswer(answer);
  setIsQuizActive(false); // クイズを非アクティブにする

  const resetMagicEffect = () => {
    setEnemyOpacity(1);
    setShowMagicEffect(false);
    setQuizResultMessage("");
  };

  const handleMagicSuccess = async () => {
    setQuizResultMessage(`Correct! The spell was successful!`);

    setEnemyOpacity(0.5); // 敵がヒットした時の透明度
    setShowMagicEffect(true); // 魔法エフェクトを表示

    const newHp = currentEnemy.hp - PLAYER_MAGIC_DAMAGE;
    setCurrentEnemy({ ...currentEnemy, hp: newHp });

    if (newHp <= 0) {
      handleVictory(); // 敵が倒れた場合の処理
    } else {
      setIsPlayerTurn(false); // プレイヤーのターンを終了
      setTimeout(() => {
        handleEnemyAttack(); // 敵の攻撃を実行
      }, ENEMY_ATTACK_DELAY);
    }

    setTimeout(resetMagicEffect, MAGIC_EFFECT_TIME);

    // 正解後、クイズをリセットして次回のターンで新しいクイズが出題される
    setQuizText(""); // 正解後はクイズをリセット
    setQuizOptions([]); // 正解後はクイズをリセット
    setIsMagicProcessing(false); // 魔法処理終了
  };

  const handleMagicFailure = () => {
    setQuizResultMessage(`Incorrect... The spell failed.`);

    setIsPlayerTurn(false); // プレイヤーのターンを終了

    setTimeout(() => {
      handleEnemyAttack(); // 敵の攻撃を実行
    }, ENEMY_ATTACK_DELAY);

    setTimeout(resetMagicEffect, MAGIC_EFFECT_TIME);

    // 不正解の場合、クイズはリセットしないため次回も同じクイズが出題される
    setIsMagicProcessing(false); // 魔法処理終了
  };

  if (answer === correctAnswer) {
    handleMagicSuccess(); // 正解した場合の処理
  } else {
    handleMagicFailure(); // 不正解の場合の処理
  }
};


  // 敵が倒されたときの処理
  const handleVictory = () => {
    if (!currentEnemy) return; // Add null check for currentEnemy
    setSteps(0);

    setCurrentEnemy({ ...currentEnemy, hp: 0 });
    
    // エフェクトを表示する
    setEnemyOpacity(0.5); // 敵がヒットした時の透明度を変更
  
    // エフェクト表示時間を確保
    setTimeout(() => {
      setEnemyOpacity(1); // 透明度を戻す
      setShowAttackEffect(false); // 攻撃エフェクトを非表示
      setShowMagicEffect(false); // 魔法エフェクトを非表示
    
      // やくそうドロップ処理
      attemptHerbDrop(currentEnemy, setHerbCount, setHerbMessage);
    
      // 経験値を獲得
      const gainedExp = currentEnemy.experience;
      handleGainExperience(gainedExp);
      setGainedExpMessage(`Gained ${gainedExp} experience points`);
    
      if (victorySound) victorySound.play();
      
      // 勝利ポップアップを表示
      setIsBattlePopupVisible(false);
      setIsVictoryPopupVisible(true);
    
      // 勝利ポップアップの表示時間
      const popupDisplayTime = leveledUp ? LEVEL_UP_POPUP_DISPLAY_TIME : VICTORY_POPUP_DISPLAY_TIME;
    
      setTimeout(() => {
        setIsVictoryPopupVisible(false);
        setHerbMessage(""); // 勝利ポップアップが消える時にメッセージもリセット
        setLevelUpMessage(""); // レベルアップメッセージをリセット
        setStatIncreaseMessage("");
        startRandomBattleSteps(setNextBattleSteps, setSteps); // 次のバトルステップを設定
      }, popupDisplayTime);
    }, ATTACK_EFFECT_TIME); // エフェクトの表示時間分遅延させる
  };

  // useCallbackの中で関数を呼び出す
  const handleKeyPressCallback = useCallback(
    (e: KeyboardEvent) => {
      handleKeyPress(
        e,
        playerPosition,
        setPlayerPosition,
        setDirection,
        setSteps,
        isBattlePopupVisible
      );
    },
    [playerPosition, isBattlePopupVisible]
  );

  useEffect(() => {
    if (!isBattlePopupVisible) {
      window.addEventListener("keydown", handleKeyPressCallback);
    } else {
      window.removeEventListener("keydown", handleKeyPressCallback);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyPressCallback);
    };
  }, [isBattlePopupVisible, handleKeyPressCallback]);

  useEffect(() => {
    startRandomBattleSteps(setNextBattleSteps, setSteps);
  }, [setNextBattleSteps, setSteps]);

  useEffect(() => {
    if (steps >= nextBattleSteps) {
      setIsBattlePopupVisible(true);
      setSteps(0);
      utilContext.setLoading(true);

      // Fetch monster data using generateMonsterData
      //const fetchMonsterData = async () => {
       // const generatedMonster = await generateMonsterData();
       // if (generatedMonster != null) {
       //   const enemyData = {
       //     name: generatedMonster.name,
       //     image: generatedMonster.imageUrl,
       //     hp: generatedMonster.health,
       //     experience: generatedMonster.rarity * 10,  // You can adjust experience calculation
       //   };
       //   // Enemy型をつくる
       //   const enemy: Enemy = {
       //     name: enemyData.name,
       //     image: enemyData.image,
       //     hp: enemyData.hp,
       //     attackRange: [generatedMonster.attack - 5, generatedMonster.attack + 5],
       //     experience: enemyData.experience,
       //     //description: generatedMonster.description,
       //     //defense: generatedMonster.defense,
       //   }
       //   setCurrentEnemy(enemy);
       // } 

        // Fallback in case monster generation fails, use a random static enemy
        const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
        setCurrentEnemy(randomEnemy);
        utilContext.setLoading(false);
        setIsPlayerTurn(true);
        setEnemyAttackMessage("");
        //fetchMonsterData();  // Call the monster generation function
    }
  }, [steps, nextBattleSteps]);;

  // ⑧レベルアップを処理する
  const handleLevelUp = () => {
    levelUp(
      playerLevel,
      setPlayerLevel,
      setPlayerHp,
      setPlayerMp,
      setPlayerAttack,
      setPlayerDefense,
      setLevelUpMessage,
      setStatIncreaseMessage
    );
  };

  // ⑨経験値を獲得
  const handleGainExperience = (expGained: number) => {
    gainExperience(
      expGained,
      playerLevel,
      setPlayerExp,
      handleLevelUp,
      setLeveledUp
    );
  };


return (
  <>
    {/* ゲームのコンテンツを常に表示 */}
    <div
      ref={gameContainerRef}  // スクロール用の ref を追加
      className={styles.gameContainer}  // ここで後述の CSS を適用
      style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative", }}
    >
      <div className={styles.gridContainer}>
        {Array.from({ length: (2560 / 32) * (1920 / 32) }).map((_, index) => {
          const x = index % (2560 / 32);
          const y = Math.floor(index / (2560 / 32));

          const isPlayer = playerPosition.x === x && playerPosition.y === y;

          return (
            <div key={index} className={styles.gridField}>
              <Tile
                x={x}
                y={y}
                isPlayer={isPlayer}
                playerImageSrc={playerImages[direction][animationFrame]}
              />
            </div>
          );
        })}
      </div>

      {/* 戦闘ポップアップ */}
      {isBattlePopupVisible && currentEnemy && (
        <BattlePopup
          enemy={currentEnemy}
          isPlayerTurn={isPlayerTurn}
          onAttack={handleAttack}
          onMagic={handleMagic}
          enemyAttackMessage={enemyAttackMessage}
          herbCount={herbCount}
          onUseHerb={() =>
            handleUseHerb(
              herbCount,
              playerHp,
              setPlayerHp,
              setHerbCount,
              setEnemyAttackMessage,
              herbSound
            )
          } // useHerbは通常の関数として使用
          playerHp={playerHp}
          playerMp={playerMp}
          playerLevel={playerLevel}
          enemyOpacity={enemyOpacity}
          showAttackEffect={showAttackEffect}
          showMagicEffect={showMagicEffect}
          showEnemyAttackEffect={showEnemyAttackEffect}
          isMagicConfirmVisible={isMagicConfirmVisible}
          isQuizActive={isQuizActive} // クイズがアクティブかどうか
          quizText={quizText} // クイズのテキスト
          quizOptions={quizOptions} // クイズの選択肢
          onQuizAnswer={handleQuizAnswer} // クイズ回答ハンドラ
          quizResultMessage={quizResultMessage} // クイズ結果メッセージ
          isMagicProcessing={isMagicProcessing} // 魔法処理中かどうか
        />
      )}

      {/* 勝利ポップアップ */}
      {isVictoryPopupVisible && (
        <VictoryPopup
          herbMessage={herbMessage}
          gainedExpMessage={gainedExpMessage}
          levelUpMessage={levelUpMessage}
          statIncreaseMessage={statIncreaseMessage}
        />
      )}
    {/* ローディング画面の表示 */}
    </div>
    {utilContext.loading && <Loading />} 

  </>
 );
};

export default Game;
