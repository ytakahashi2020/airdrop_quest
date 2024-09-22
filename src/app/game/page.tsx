"use client";

import { useCallback, useEffect, useState } from "react";
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

import { playerImages } from "../utils/playerImages"; // playerImagesをインポート
import {
  isTreePosition,
  isWaterPosition,
  treePositions,
  waterPositions
} from "../utils/positions";
import { Enemy, MonsterNFTData, QuizData } from "../utils/types"; // 型定義をインポート

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

import { generateMonsterData, generateQuizData } from "../utils/ai";

const Game = () => {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [playerHp, setPlayerHp] = useState(50); // HP
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
  const [nextBattleSteps, setNextBattleSteps] = useState<number>(0);
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


  // クイズのオプションを作成する関数（例として簡単なクイズを設定）
  const generateQuiz = async() => {
    // APIを呼び出してクイズを自動生成する。
    const quizData: QuizData = await generateQuizData();
    setQuizText(quizData?.question!);
    setCorrectAnswer(quizData?.correct_answer!);
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

  // ⑦敵への攻撃
  const handleAttack = () => {
    if (currentEnemy && isPlayerTurn) {
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

      // 敵のHPが0以下になったら
      if (newHp <= 0) {
        setCurrentEnemy({ ...currentEnemy, hp: 0 });
        setTimeout(() => {
          attemptHerbDrop(currentEnemy, setHerbCount, setHerbMessage);
          // 経験値を獲得
          const gainedExp = currentEnemy.experience;
          // setPlayerExp((prevExp) => prevExp + gainedExp); // 経験値を追加
          handleGainExperience(gainedExp);
          setGainedExpMessage(`${gainedExp}の経験値を取得しました`); // メッセージを設定
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
  const handleMagic = async() => {
    if (currentEnemy && isPlayerTurn && !isQuizActive && !isMagicProcessing) {
      setQuizOptions(await generateQuiz()); // クイズの選択肢を生成
      setIsQuizActive(true); // クイズをアクティブにする
      setIsMagicProcessing(true); // 魔法処理開始を示す
    }
  };

  // クイズの回答処理
  const handleQuizAnswer = (answer: string) => {
    if (!currentEnemy) return; // Add null check for currentEnemy
  
    setQuizAnswer(answer);
    setIsQuizActive(false); // クイズを非アクティブにする
  
    const resetMagicEffect = () => {
      setEnemyOpacity(1);
      setShowMagicEffect(false);
      setQuizResultMessage("");
    };
  
    const handleMagicSuccess = () => {
      setQuizResultMessage(`正解！魔法が成功しました！`);
      setEnemyOpacity(0.5); // 敵がヒットした時の透明度
      setShowMagicEffect(true); // 魔法エフェクトを表示
    
      const newHp = currentEnemy.hp - PLAYER_MAGIC_DAMAGE;
      setCurrentEnemy({ ...currentEnemy, hp: newHp });
    
      if (newHp <= 0) {
        handleVictory();
      } else {
        setIsPlayerTurn(false);
        setTimeout(() => {
          handleEnemyAttack();
        }, ENEMY_ATTACK_DELAY);
      }
    
      setTimeout(resetMagicEffect, MAGIC_EFFECT_TIME);
    };
  
    const handleMagicFailure = () => {
      setQuizResultMessage(`不正解...魔法が失敗しました。`);
      setIsPlayerTurn(false);
      
      setTimeout(() => {
        handleEnemyAttack();
      }, ENEMY_ATTACK_DELAY);
    
      setTimeout(resetMagicEffect, MAGIC_EFFECT_TIME);
    };
  
    if (answer === correctAnswer) {
      handleMagicSuccess();
    } else {
      handleMagicFailure();
    }
  
    setIsMagicProcessing(false);
  };

  // 敵が倒されたときの処理
  const handleVictory = () => {
    if (!currentEnemy) return; // Add null check for currentEnemy

    setCurrentEnemy({ ...currentEnemy, hp: 0 });
    
    // エフェクトを表示する
    setEnemyOpacity(0.5); // 敵がヒットした時の透明度を変更
    setShowAttackEffect(true); // 攻撃エフェクトを表示
    setShowMagicEffect(true); // 魔法エフェクトを表示（必要に応じて）
  
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
      setGainedExpMessage(`${gainedExp}の経験値を取得しました`);
    
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
        treePositions,
        waterPositions,
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
    const generateEnemy = async() => {
      if (steps >= nextBattleSteps) {
        //const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)]
        // AIで敵モンスターのステータスを生成させる。
        const monsterData: MonsterNFTData = await generateMonsterData();
        const randomEnemy: Enemy = {
          name: monsterData.name,
          hp: Number(monsterData.health),
          image: monsterData.imageUrl,
          attackRange: [Number(monsterData.attack) - 10, Number(monsterData.attack)],
          experience: Number(monsterData.health)
        }
        setCurrentEnemy(randomEnemy);
        setIsBattlePopupVisible(true);
        setIsPlayerTurn(true);
        setEnemyAttackMessage("");
      }
    }
    generateEnemy();
  }, [steps, nextBattleSteps]);

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
    <div style={{ textAlign: "center" }}>
      <h1>簡単なフィールドでの移動</h1>
      <div style={{ marginBottom: "20px" }}>
        {/* <h2>主人公のHP: {playerHp}</h2>
        <h2>主人公のMP: {playerMp}</h2>
        <h2>レベル: {playerLevel}</h2>
        <h2>経験値: {playerExp}</h2>
        <h2>攻撃力: {playerAttack}</h2>
        <h2>防御力: {playerDefense}</h2>
        <h2>やくそう: {herbCount}個</h2> */}
      </div>

      <div className={styles.gridContainer}>
        {Array.from({ length: 20 * 20 }).map((_, index) => {
          const x = index % 20;
          const y = Math.floor(index / 20);
          const isPlayer = playerPosition.x === x && playerPosition.y === y;
          const isTree = isTreePosition(x, y);
          const isWater = isWaterPosition(x, y);

          return (
            <div key={index} className={styles.gridField}>
              <Tile
                src={playerImages[direction][animationFrame]}
                alt="Player"
                isVisible={isPlayer}
              />

              <Tile
                src="/images/map/water_frame_4.png"
                alt="Water"
                isVisible={isWater}
              />

              <Tile
                src="/images/map/grass_frame_4.png"
                alt="Tree"
                isVisible={isTree}
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
    </div>
  );
};

export default Game;
