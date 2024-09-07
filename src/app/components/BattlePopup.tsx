import React, { useState } from "react";

import { BattlePopupProps } from "../utils/types";

const BattlePopup: React.FC<BattlePopupProps> = ({
  enemy,
  isPlayerTurn,
  onAttack,
  enemyAttackMessage,
  herbCount,
  onUseHerb,
  playerHp,
}) => {
  const [enemyOpacity, setEnemyOpacity] = useState(1); // 透明度の状態管理

  // 攻撃を受けた際に透明度を一時的に変更する関数
  const handleEnemyHit = () => {
    setEnemyOpacity(0.5); // 透明度を一時的に下げる
    setTimeout(() => {
      setEnemyOpacity(1); // 一定時間後に透明度を元に戻す
    }, 300); // 0.3秒後に元に戻す
  };

  const handleAttack = () => {
    handleEnemyHit(); // 攻撃時に敵が透明になる処理を呼び出す
    onAttack(); // 攻撃のロジック
  };

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
        width: "80%", // 横幅を広く
        height: "400px", // 高さを調整
        backgroundImage: 'url("/images/fields/pipo-battlebg001a.jpg")', // 背景画像を設定
        backgroundSize: "contain", // 画像が切れないようにする
        backgroundPosition: "center",
        // backgroundRepeat: "no-repeat", // 繰り返しを防ぐ
      }}
    >
      <h2>敵が現れた！</h2>

      {/* モンスターの画像 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <img
          src={enemy.image}
          alt="Enemy"
          style={{
            width: "150px",
            height: "150px",
            objectFit: "contain", // 画像を拡大縮小しても比率を維持
            opacity: enemyOpacity, // 透明度を変更
            transition: "opacity 0.3s", // スムーズに透明度を変更
          }}
        />
      </div>

      <p>HP: {enemy.hp}</p>
      <button onClick={handleAttack} disabled={!isPlayerTurn}>
        戦う
      </button>

      {/* やくそうボタン */}
      <button onClick={onUseHerb} disabled={herbCount === 0 || playerHp >= 50}>
        やくそう ({herbCount}個)
      </button>

      {/* 敵の攻撃メッセージ */}
      {enemyAttackMessage && <p>{enemyAttackMessage}</p>}
    </div>
  );
};

export default BattlePopup;
