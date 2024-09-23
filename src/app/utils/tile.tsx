import Image from "next/image";
import React from "react";

interface TileProps {
  x: number; // タイルのX座標
  y: number; // タイルのY座標
  isPlayer: boolean; // プレイヤーがこのタイルにいるかどうか
  playerImageSrc: string; // プレイヤーの画像のソース
  size?: number; // タイルのサイズ、デフォルトは32px
}

const Tile: React.FC<TileProps> = ({
  x,
  y,
  isPlayer,
  playerImageSrc,
  size = 32,
}) => {
  const backgroundPosition = `-${x * size}px -${y * size}px`;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: "relative",
        backgroundImage: 'url("/images/map.png")', // 1280x960の全体画像
        backgroundPosition: backgroundPosition,
        backgroundSize: "1280px 960px",
      }}
    >
      {isPlayer && (
        <Image
          src={playerImageSrc}
          width={size}
          height={size}
          alt="Player"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </div>
  );
};

export default Tile;
