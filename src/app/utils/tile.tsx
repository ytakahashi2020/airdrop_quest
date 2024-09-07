import Image from "next/image";

import { TileProps } from "./types";

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
