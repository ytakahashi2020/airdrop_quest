// 木の位置
export const treePositions = [
  { x: 3, y: 2 },
  { x: 8, y: 8 },
];

// 水の位置を範囲で指定
export const waterPositions: { x: number; y: number }[] = [];
for (let x = 0; x <= 20; x++) {
  for (let y = 13; y <= 14; y++) {
    waterPositions.push({ x, y });
  }
}

// 草の位置
export const grassPositions: { x: number; y: number }[] = [];
for (let x = 0; x <= 20; x++) {
  for (let y = 15; y <= 19; y++) {
    grassPositions.push({ x, y });
  }
}

// 木や水があるかどうかをチェックする関数
export const isTreePosition = (x: number, y: number) => {
  return treePositions.some((pos) => pos.x === x && pos.y === y);
};

export const isWaterPosition = (x: number, y: number) => {
  return waterPositions.some((pos) => pos.x === x && pos.y === y);
};

// 通れるかどうかをチェックする関数
export const isPassablePosition = (x: number, y: number) => {
  if (isTreePosition(x, y) || isWaterPosition(x, y)) {
    return false; // 通れない場合
  }
  return true; // 通れる場合
};
