import React, { useState } from "react";
import { BattlePopupProps, Enemy } from "../utils/types";

// 主人公のステータス表示ポップアップ
const PlayerStatusPopup: React.FC<{
  playerHp: number;
  playerMp: number;
  playerLevel: number;
}> = ({ playerHp, playerMp, playerLevel }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "30%",
        left: "7%",
        width: "145px",
        paddingTop: "10px",
        paddingBottom: "10px",
        color: "white",
        backgroundColor: "black",
        border: "3px solid white",
        borderRadius: "7px",
        zIndex: 1000,
      }}
    >
      <h3>ユウキ</h3>
      <div
        style={{
          height: "1px",
          backgroundColor: "white",
          margin: "10px 0", // 上下の余白を調整
        }}
      />

      {/* ここで右端揃えと空白調整 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: "40px", // 左右に余白を作成
          paddingRight: "40px",
          gap: "10px", // 左と右のテキストの間に隙間を作成
        }}
      >
        <p>H</p>
        <p>{playerHp}</p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: "40px", // 左右に余白を作成
          paddingRight: "40px",
          gap: "10px",
        }}
      >
        <p>M</p>
        <p>{playerMp}</p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: "40px", // 左右に余白を作成
          paddingRight: "40px",
          gap: "10px",
        }}
      >
        <p>Lv</p>
        <p>{playerLevel}</p>
      </div>
    </div>
  );
};

// 戦闘の選択ポップアップ
const BattleOptionsPopup: React.FC<{
  onAttack: () => void;
  onUseHerb: () => void;
  herbCount: number;
}> = ({ onAttack, onUseHerb, herbCount }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "6%",
        left: "7%",
        width: "150px",
        paddingTop: "10px",
        paddingBottom: "10px",
        color: "white",
        backgroundColor: "black",
        border: "3px solid white",
        borderRadius: "7px",
        zIndex: 2000,
      }}
    >
      {/* ボタンの配置 */}
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <h3>ユウキ</h3>
        <div
          style={{
            height: "2px",
            backgroundColor: "white",
            margin: "10px 0", // 上下の余白を調整
          }}
        />
        <button
          onClick={onAttack}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "5px",
            color: "white",
          }}
        >
          たたかう
        </button>
        <button
          onClick={onUseHerb}
          disabled={herbCount === 0} // やくそうがない場合は無効化
          style={{
            width: "100%",
            padding: "10px",
            color: "white",
          }}
        >
          やくそう ({herbCount}個)
        </button>
      </div>
    </div>
  );
};

// 敵の画像と情報を表示するポップアップ
const EnemyPopup: React.FC<BattlePopupProps> = ({
  enemy,
  isPlayerTurn,
  onAttack,
}) => {
  const [enemyOpacity, setEnemyOpacity] = useState(1); // 透明度の状態管理

  const handleEnemyHit = () => {
    setEnemyOpacity(0.5);
    setTimeout(() => {
      setEnemyOpacity(1);
    }, 300);
  };

  const handleAttack = () => {
    handleEnemyHit();
    onAttack();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "30%",
        left: "20%",
        // transform: "translate(-50%, -50%)",
        padding: "20px",
        paddingTop: "30px",
        border: "3px solid white",
        borderRadius: "7px",
        color: "white",
        zIndex: 1000,
        width: "600px", // ポップアップの幅を設定
        height: "250px", // ポップアップの高さを設定
        backgroundImage: 'url("/images/fields/pipo-battlebg001a.jpg")', // 背景画像を設定
        backgroundSize: "cover", // 背景画像がボックスを覆うように調整
        backgroundPosition: "center", // 背景の位置
        display: "flex", // Flexboxを使って中央に配置
        justifyContent: "center", // 水平方向の中央揃え
      }}
    >
      <img
        src={enemy.image}
        alt="Enemy"
        style={{
          width: "150px",
          height: "150px",
          objectFit: "contain",
          opacity: enemyOpacity,
          transition: "opacity 0.3s",
        }}
      />
      <p>HP: {enemy.hp}</p>
    </div>
  );
};

// メッセージやコマンドを表示するポップアップ
const CommandPopup: React.FC<{
  enemyAttackMessage: string;
  enemy: Enemy | null; // 敵の情報を受け取る
  herbCount: number;
  onUseHerb: () => void;
  playerHp: number;
  isPlayerTurn: boolean;
  onAttack: () => void;
}> = ({ enemyAttackMessage, enemy }) => {
  return (
    <div
      style={{
        position: "fixed",
        color: "white",
        bottom: "7%",
        left: "10%",
        // transform: "translateX(-50%)",
        width: "800px",
        padding: "10px",
        height: "120px",
        border: "3px solid white",
        borderRadius: "7px",
        backgroundColor: "black",
        zIndex: 1000,
      }}
    >
      <p>
        {/* 敵の名前を表示、攻撃メッセージがなければ「現れた！」メッセージ */}
        {enemyAttackMessage || `${enemy?.name || "未知の敵"}が現れた！`}
      </p>
    </div>
  );
};

// 全体のコンポーネント
const BattlePopup: React.FC<BattlePopupProps> = (props) => {
  return (
    <>
      {/* 左側：主人公のステータス */}
      <PlayerStatusPopup
        playerHp={props.playerHp}
        playerMp={props.playerMp}
        playerLevel={props.playerLevel}
      />

      <BattleOptionsPopup
        onAttack={props.onAttack}
        onUseHerb={props.onUseHerb}
        herbCount={props.herbCount}
      />

      {/* 中央：敵の画像 */}
      <EnemyPopup {...props} />

      {/* 下：コマンドやメッセージ */}
      <CommandPopup
        enemyAttackMessage={props.enemyAttackMessage}
        herbCount={props.herbCount}
        onUseHerb={props.onUseHerb}
        playerHp={props.playerHp}
        isPlayerTurn={props.isPlayerTurn}
        onAttack={props.onAttack}
        enemy={props.enemy}
      />
    </>
  );
};

export default BattlePopup;
