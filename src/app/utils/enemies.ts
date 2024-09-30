import { Enemy } from "./types"; // 必要であれば、Enemyの型を定義したファイルからインポート

export const enemies: Enemy[] = [
  {
    name: "Pallot Wyvern",
    image: "/images/enemy1.png",
    hp: 7,
    attackRange: [3, 5],
    experience: 30,
  },
  {
    name: "Space Alien",
    image: "/images/enemy2.png",
    hp: 18,
    attackRange: [4, 7],
    experience: 40,
  },
  {
    name: "Shadow Behemoth",
    image: "/images/enemy3.png",
    hp: 24,
    attackRange: [7, 12],
    experience: 50,
  },
];
