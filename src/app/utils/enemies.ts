import { Enemy } from "./types"; // 必要であれば、Enemyの型を定義したファイルからインポート

export const enemies: Enemy[] = [
  {
    name: "Magician",
    image: "/images/enemy1.png",
    hp: 6,
    attackRange: [1, 3],
    experience: 30,
  },
  {
    name: "Wall Man",
    image: "/images/enemy2.png",
    hp: 18,
    attackRange: [4, 6],
    experience: 40,
  },
  {
    name: "Blue Dragon",
    image: "/images/enemy3.png",
    hp: 36,
    attackRange: [7, 9],
    experience: 50,
  },
];
