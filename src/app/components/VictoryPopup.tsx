import React from "react";

import { VictoryPopupProps } from "../utils/types";

const VictoryPopup: React.FC<VictoryPopupProps> = ({
  herbMessage,
  gainedExpMessage,
  levelUpMessage,
  statIncreaseMessage,
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
        color: "black",
        zIndex: 1000,
      }}
    >
      <h2>You defeated the enemy!</h2>
      {herbMessage && <p>{herbMessage}</p>}
      {gainedExpMessage && <p>{gainedExpMessage}</p>}{" "}
      {/* 取得した経験値メッセージを表示 */}
      {levelUpMessage && (
        <div>
          <h3>{levelUpMessage}</h3>
          <p>{statIncreaseMessage}</p>
        </div>
      )}
    </div>
  );
};

export default VictoryPopup;
