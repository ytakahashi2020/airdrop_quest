import { RANDOM_STEP_MULTIPLIER, RANDOM_STEP_OFFSET } from "./constants";

import { Enemy } from "./types"; // 型定義をインポート
import { playEnemyAttackSound } from "./audioManager"; // 音声管理ファイルをインポート
import { isPassablePosition } from "./positions";
let moveCooldown = false; // Add a cooldown flag

export const handleKeyPress = (
  e: KeyboardEvent,
  playerPosition: { x: number; y: number },
  setPlayerPosition: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >,
  setDirection: React.Dispatch<
    React.SetStateAction<"up" | "down" | "left" | "right">
  >,
  setSteps: React.Dispatch<React.SetStateAction<number>>,
  isBattlePopupVisible: boolean
) => {
  if (isBattlePopupVisible || moveCooldown) return; // Prevent movement if cooldown is active

  moveCooldown = true; // Activate cooldown
  setTimeout(() => {
    moveCooldown = false; // Reset cooldown after 200ms (adjust as necessary)
  }, 50);

  setPlayerPosition((prev) => {
    let newPos = { ...prev };

    switch (e.key) {
      case "ArrowUp":
        if (prev.y > 0 && isPassablePosition(prev.x, prev.y - 1)) {
          newPos.y -= 1;
          setDirection("up");
        }
        break;
      case "ArrowDown":
        if (prev.y < 59 && isPassablePosition(prev.x, prev.y + 1)) {
          newPos.y += 1;
          setDirection("down");
        }
        break;
      case "ArrowLeft":
        if (prev.x > 0 && isPassablePosition(prev.x - 1, prev.y)) {
          newPos.x -= 1;
          setDirection("left");
        }
        break;
      case "ArrowRight":
        if (prev.x < 79 && isPassablePosition(prev.x + 1, prev.y)) {
          newPos.x += 1;
          setDirection("right");
        }
        break;
      default:
        break;
    }
    return newPos;
  });

  setSteps((prevSteps) => prevSteps + 1);
};


// 敵の攻撃
export const enemyAttack = (
  currentEnemy: Enemy | null,
  setPlayerHp: React.Dispatch<React.SetStateAction<number>>,
  setEnemyAttackMessage: React.Dispatch<React.SetStateAction<string>>,
  setIsPlayerTurn: React.Dispatch<React.SetStateAction<boolean>>,
  enemyAttackSound: HTMLAudioElement | null,
  setShowEnemyAttackEffectEffect: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (currentEnemy) {
    const [minAttack, maxAttack] = currentEnemy.attackRange;
    if (enemyAttackSound) {
      playEnemyAttackSound(enemyAttackSound); // 敵の攻撃音を再生
    }

    setShowEnemyAttackEffectEffect(true); // 攻撃エフェクトを表示
    setTimeout(() => {
      setShowEnemyAttackEffectEffect(false);
    }, 500);

    const damage =
      Math.floor(Math.random() * (maxAttack - minAttack + 1)) + minAttack;
    setPlayerHp((prevHp) => Math.max(prevHp - damage, 0));
    setEnemyAttackMessage(`${currentEnemy.name} Attacked: ${damage} damage`);
    setIsPlayerTurn(true);
  }
};

// やくそうを使う処理
export const handleUseHerb = (
  herbCount: number,
  playerHp: number,
  setPlayerHp: (hp: number | ((prevHp: number) => number)) => void, // 型を明示
  setHerbCount: (count: number | ((prevCount: number) => number)) => void, // 同様に型を明示
  setEnemyAttackMessage: (message: string) => void,
  herbSound: HTMLAudioElement | null // 効果音のAudioオブジェクトを引数に追加
) => {
  if (herbCount > 0 && playerHp < 50) {
    const healAmount = Math.floor(Math.random() * 11) + 20; // 20~30回復
    setPlayerHp((prevHp) => {
      return Math.min(prevHp + healAmount, 50); // HPが50を超えないようにする
    });
    setHerbCount((prev) => prev - 1); // やくそうの数を減らす
    setEnemyAttackMessage(`Used an herb and restored ${healAmount} HP!`);

    if (herbSound)
      herbSound
        .play()
        .catch((err) => console.error("Error playing herb sound:", err));
  }
};

// やくそう入手の処理
export const attemptHerbDrop = (
  currentEnemy: { name: string } | null,
  setHerbCount: (count: number | ((prev: number) => number)) => void,
  setHerbMessage: (message: string) => void
) => {
  const herbDrop = Math.random() < 0.9; // 50%の確率でやくそうをドロップ
  if (herbDrop) {
    setHerbCount((prev) => prev + 1); // やくそうの数を増やす
    setHerbMessage(`${currentEnemy?.name} dropped an herb`);
  } else {
    setHerbMessage(""); // やくそうを入手しなかった場合はリセット
  }
};

// ランダムで戦闘ステップを設定
export const startRandomBattleSteps = (
  setNextBattleSteps: React.Dispatch<React.SetStateAction<number>>,
  setSteps: React.Dispatch<React.SetStateAction<number>>
) => {
  const randomSteps =
    Math.floor(Math.random() * RANDOM_STEP_MULTIPLIER) + RANDOM_STEP_OFFSET + 100;
  setNextBattleSteps(randomSteps);
  setSteps(0);
};