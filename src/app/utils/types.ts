export type Enemy = {
  name: string;
  image: string;
  hp: number;
  attackRange: [number, number];
  experience: number;
};

export type VictoryPopupProps = {
  herbMessage: string;
  gainedExpMessage: string;
  levelUpMessage: string;
  statIncreaseMessage: string;
};

export type BattlePopupProps = {
  enemy: Enemy;
  isPlayerTurn: boolean;
  onAttack: () => void;
  enemyAttackMessage: string;
  herbCount: number; // やくそうの数
  onUseHerb: () => void; // やくそうを使う処理
  playerHp: number; // プレイヤーのHP
  playerMp: number; // プレイヤーのMP
  playerLevel: number; // プレイヤーのレベル
};

export type TileProps = {
  src: string; // 画像のパス
  alt: string; // 画像の説明（altテキスト）
  isVisible: boolean; // 画像を表示するかどうか
  size?: number; // タイルのサイズを指定 (デフォルト: 100)
};
