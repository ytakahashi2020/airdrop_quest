import { Enemy } from "./types"; // 必要であれば、Enemyの型を定義したファイルからインポート

export const enemies: Enemy[] = [
  {
    name: "まどうし",
    image: "/images/enemy1.png",
    hp: 5,
    attackRange: [1, 3],
    experience: 30,
  },
  {
    name: "かべ男",
    image: "/images/enemy2.png",
    hp: 6,
    attackRange: [4, 6],
    experience: 40,
  },
  {
    name: "ブルードラゴン",
    image: "/images/enemy3.png",
    hp: 12,
    attackRange: [7, 9],
    experience: 50,
  },
];
