import { useState, useEffect } from "react";
import { GiPentacle } from "react-icons/gi";

/**
 * Loading Component with Fullscreen Cut-in Image Effect
 */
const Loading = () => {
  const [showCutIn, setShowCutIn] = useState(true);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-[9999]">
      {/* Pentacleのスピン */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999]">
        <GiPentacle className="animate-spin text-white" size={100} />
      </div>
    </div>
  );
};

export default Loading;

