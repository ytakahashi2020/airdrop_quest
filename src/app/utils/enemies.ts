import { Enemy } from "./types"; // 必要であれば、Enemyの型を定義したファイルからインポート

export const enemies: Enemy[] = [
  {
    name: "まどうし",
    image: "/images/enemy1.png",
    hp: 1,
    attackRange: [1, 3],
    experience: 100,
  },
  {
    name: "かべ男",
    image: "/images/enemy2.png",
    hp: 1,
    attackRange: [4, 6],
    experience: 120,
  },
  {
    name: "ブルードラゴン",
    image: "/images/enemy3.png",
    hp: 1,
    attackRange: [7, 9],
    experience: 150,
  },
];
