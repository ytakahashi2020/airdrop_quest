// 音楽の初期化
export const initializeAudio = () => {
  const normalMusic = new Audio("/music/normalMusic.mp3");
  const battleMusic = new Audio("/music/battleMusic.mp3");
  const swordSound = new Audio("/sounds/sword.mp3");
  const herbSound = new Audio("/sounds/herbSound.mp3");
  const victorySound = new Audio("/sounds/victorySound.mp3");
  const enemyAttackSound = new Audio("/sounds/enemyAttack.mp3");

  return {
    normalMusic,
    battleMusic,
    swordSound,
    herbSound,
    victorySound,
    enemyAttackSound,
  };
};

// 通常音楽の再生
export const playNormalMusic = (normalMusic: HTMLAudioElement | null) => {
  if (normalMusic) {
    normalMusic.loop = true;
    normalMusic.volume = 0.4;
    normalMusic
      .play()
      .catch((err) => console.error("Error playing normal music:", err));
  }
};

// 通常音楽の停止
export const stopNormalMusic = (normalMusic: HTMLAudioElement | null) => {
  if (normalMusic) {
    normalMusic.pause();
  }
};

// 戦闘音楽の再生
export const playBattleMusic = (battleMusic: HTMLAudioElement | null) => {
  if (battleMusic) {
    battleMusic.loop = true;
    battleMusic.volume = 0.3;
    battleMusic
      .play()
      .catch((err) => console.error("Error playing battle music:", err));
  }
};

// 戦闘音楽の停止
export const stopBattleMusic = (battleMusic: HTMLAudioElement | null) => {
  if (battleMusic) {
    battleMusic.pause();
  }
};

// 敵の攻撃音の再生
export const playEnemyAttackSound = (
  enemyAttackSound: HTMLAudioElement | null
) => {
  if (enemyAttackSound) {
    enemyAttackSound.volume = 1.0; // 音量調整
    enemyAttackSound
      .play()
      .catch((err) => console.error("Error playing enemy attack sound:", err));
  }
};
