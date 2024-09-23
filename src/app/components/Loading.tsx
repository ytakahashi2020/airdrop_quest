import { useState, useEffect } from "react";
import { GiPentacle } from "react-icons/gi";

/**
 * Loading Component with Fullscreen Cut-in Image Effect
 */
const Loading = () => {
  const [showCutIn, setShowCutIn] = useState(true);

  // Optionally, auto-hide the cut-in after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCutIn(false);
    }, 3000); // Hide after 3 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-[9999]">
      {/* カットインの表示 */}
      {showCutIn && (
        <div
          className="absolute top-1/2 left-1/2 h-1/3 transform -translate-x-1/2 -translate-y-1/2 w-full"
          style={{ backgroundColor: "white", width: "100vw" }} // 画面横幅いっぱい & 白背景
        >
          <img
            src="/images/cutin.jpeg"
            alt="Cut-in Image"
            className="w-full h-full object-contain animate-fade-in"
            onClick={() => setShowCutIn(false)} // Hide on click
          />
        </div>
      )}

      {/* Pentacleのスピン */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999]">
        <GiPentacle className="animate-spin text-white" size={100} />
      </div>
    </div>
  );
};

export default Loading;

