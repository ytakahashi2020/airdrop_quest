import Image from "next/image";

type TileProps = {
  src: string; // 画像のパス
  alt: string; // 画像の説明（altテキスト）
  isVisible: boolean; // 画像を表示するかどうか
  size?: number; // タイルのサイズを指定 (デフォルト: 100)
};

const Tile: React.FC<TileProps> = ({ src, alt, isVisible, size = 100 }) => {
  return isVisible ? (
    <Image
      src={src}
      width={size}
      height={size}
      alt={alt}
      style={{ width: "100%", height: "100%" }}
    />
  ) : null;
};

export default Tile;
