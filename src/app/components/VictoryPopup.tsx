import React from "react";

import { VictoryPopupProps } from "../utils/types";

const VictoryPopup: React.FC<VictoryPopupProps> = ({
  herbMessage,
  gainedExpMessage,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        border: "2px solid black",
        zIndex: 1000,
      }}
    >
      <h2>敵を倒しました！</h2>
      {herbMessage && <p>{herbMessage}</p>}
      {gainedExpMessage && <p>{gainedExpMessage}</p>}{" "}
      {/* 取得した経験値メッセージを表示 */}
    </div>
  );
};

export default VictoryPopup;
