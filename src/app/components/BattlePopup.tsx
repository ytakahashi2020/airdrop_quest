import React, { useState } from "react";
import styles from "../battlePopup.module.css"; // CSSモジュールのインポート
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
        top: "60%",
        right: "3%",
        width: "15%",
        height: "30%",
        paddingTop: "10px",
        paddingBottom: "10px",
        color: "white",
        backgroundColor: "black",
        border: "6px solid white",
        borderRadius: "16px",
        zIndex: 10000,
        textAlign: "center",
      }}
    >
      <h3>Qudo</h3>

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
        <p>HP</p>
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
        <p>Lv</p>
        <p>{playerLevel}</p>
      </div>
    </div>
  );
};

// 戦闘の選択ポップアップ
const BattleOptionsPopup: React.FC<{
  onAttack: () => void;
  onMagic: () => void;
  onUseHerb: () => void;
  herbCount: number;
}> = ({ onAttack, onMagic, onUseHerb, herbCount }) => {
  return (
    <div className={`${styles.commonPopup} ${styles.battlePopup}`}>
      {/* ボタンの配置 */}
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <h3>Qudo</h3>
        <div
          style={{
            height: "2px",
            backgroundColor: "white",
            margin: "10px 0", // 上下の余白を調整
          }}
        />
        <button onClick={onAttack} className={styles.battleCommand}>
          Attack
        </button>
        <button onClick={onMagic} className={styles.battleCommand}>
          Magic
        </button>
        <button
          onClick={onUseHerb}
          disabled={herbCount === 0} // やくそうがない場合は無効化
          className={styles.battleCommand}
        >
          Herb ({herbCount})
        </button>
      </div>
    </div>
  );
};

// 敵の画像と情報を表示するポップアップ
const EnemyPopup: React.FC<{
  enemy: Enemy;
  isPlayerTurn: boolean;
  onAttack: () => void;
  onMagic: () => void;
  enemyOpacity: number;
  showAttackEffect: boolean;
  showMagicEffect: boolean;
  showEnemyAttackEffect: boolean;
}> = ({
  enemy,
  isPlayerTurn,
  onAttack,
  onMagic,
  enemyOpacity,
  showAttackEffect,
  showMagicEffect,
  showEnemyAttackEffect,
}) => {
  return (
    <div
      className={`${
        showEnemyAttackEffect ? styles.enemyAttackPopup : styles.commonPopup
      } ${
        showEnemyAttackEffect ? styles.enemyAttackImagePopup : styles.enemyPopup
      }`}
    >
      {showAttackEffect && (
        <img
          src="/images/effect/sword.gif" // 攻撃エフェクトのGIF
          alt="Attack Effect"
          className={styles.commonEffect}
        />
      )}
      {showMagicEffect && (
        <img
          src="/images/effect/magic.gif" // 魔法エフェクトのGIF
          alt="Magic Effect"
          className={styles.commonEffect}
        />
      )}
      <img
        src={enemy.image}
        alt="Enemy"
        style={{
          opacity: enemyOpacity,
        }}
        className={styles.enemyImage}
      />
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
  onMagic: () => void;
  isQuizActive: boolean; // クイズ中かどうかのフラグ
  quizText?: string;
  quizOptions?: string[]; // クイズの選択肢
  onQuizAnswer?: (answer: string) => void; // クイズの回答ハンドラ
  quizResultMessage?: string; // クイズ結果メッセージの追加
}> = ({
  enemyAttackMessage,
  enemy,
  isQuizActive,
  quizOptions,
  quizText,
  onQuizAnswer,
  quizResultMessage, // クイズ結果メッセージを受け取る
}) => {
  return (
    <div className={`${styles.commonPopup} ${styles.commandPopup}`}>
      {isQuizActive ? (
        // クイズがアクティブな場合、クイズを表示する
        <div className={styles.quizPopup}>
          <p> {quizText} </p>
          <div className={styles.quizOptions}>
            {quizOptions?.map((option, index) => (
              <button key={index} onClick={() => onQuizAnswer?.(option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // クイズが非アクティブの場合は通常のメッセージまたはクイズ結果メッセージを表示
        <p>{quizResultMessage || enemyAttackMessage || `${enemy?.name || "Enemy"} appeared!`}</p>
      )}
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
        onMagic={props.onMagic}
        onUseHerb={props.onUseHerb}
        herbCount={props.herbCount}
      />

      {/* 中央：敵の画像 */}
      <EnemyPopup
        enemy={props.enemy}
        isPlayerTurn={props.isPlayerTurn}
        onAttack={props.onAttack}
        onMagic={props.onMagic}
        enemyOpacity={props.enemyOpacity}
        showAttackEffect={props.showAttackEffect}
        showMagicEffect={props.showMagicEffect}
        showEnemyAttackEffect={props.showEnemyAttackEffect}
      />

      {/* 下：コマンドやメッセージ */}
      <CommandPopup
        enemyAttackMessage={props.enemyAttackMessage}
        herbCount={props.herbCount}
        onUseHerb={props.onUseHerb}
        playerHp={props.playerHp}
        isPlayerTurn={props.isPlayerTurn}
        onAttack={props.onAttack}
        onMagic={props.onMagic}
        enemy={props.enemy}
        isQuizActive={props.isQuizActive}
        quizText={props.quizText}
        quizOptions={props.quizOptions}
        onQuizAnswer={props.onQuizAnswer}
        quizResultMessage={props.quizResultMessage}
      />
    </>
  );
};

export default BattlePopup;

