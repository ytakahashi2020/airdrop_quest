import React from "react";

type VictoryPopupProps = {
  herbMessage: string;
};

const VictoryPopup: React.FC<VictoryPopupProps> = ({ herbMessage }) => {
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
    </div>
  );
};

export default VictoryPopup;
