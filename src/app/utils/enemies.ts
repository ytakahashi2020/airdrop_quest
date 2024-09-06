import { Enemy } from "./types"; // 必要であれば、Enemyの型を定義したファイルからインポート

export const enemies: Enemy[] = [
  {
    name: "enemy1",
    image: "/images/enemy1.png",
    hp: 10,
    attackRange: [1, 3],
  },
  {
    name: "enemy2",
    image: "/images/enemy2.png",
    hp: 15,
    attackRange: [4, 6],
  },
  {
    name: "enemy3",
    image: "/images/enemy3.png",
    hp: 20,
    attackRange: [7, 9],
  },
];
