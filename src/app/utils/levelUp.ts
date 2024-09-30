export const levelUp = (
  playerLevel: number,
  setPlayerLevel: React.Dispatch<React.SetStateAction<number>>,
  setPlayerHp: React.Dispatch<React.SetStateAction<number>>,
  setPlayerMp: React.Dispatch<React.SetStateAction<number>>,
  setPlayerAttack: React.Dispatch<React.SetStateAction<number>>,
  setPlayerDefense: React.Dispatch<React.SetStateAction<number>>,
  setLevelUpMessage: React.Dispatch<React.SetStateAction<string>>,
  setStatIncreaseMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  setPlayerLevel((prevLevel) => prevLevel + 1);

  // 各ステータスが1〜5の範囲でランダムに増加
  const hpIncrease = Math.floor(Math.random() * 5) + 1;
  const mpIncrease = Math.floor(Math.random() * 5) + 1;
  const attackIncrease = Math.floor(Math.random() * 5) + 1;
  const defenseIncrease = Math.floor(Math.random() * 5) + 1;

  setPlayerHp((prevHp) => prevHp + hpIncrease);
  setPlayerMp((prevMp) => prevMp + mpIncrease);
  setPlayerAttack((prevAttack) => prevAttack + attackIncrease);
  setPlayerDefense((prevDefense) => prevDefense + defenseIncrease);

  // Set level up message
  setLevelUpMessage(`Leveled up to ${playerLevel + 1}!`);
  setStatIncreaseMessage(
    `HP: +${hpIncrease} MP: +${mpIncrease} Attack: +${attackIncrease} Defense: +${defenseIncrease}`
  );
};

export const gainExperience = (
  expGained: number,
  playerLevel: number,
  setPlayerExp: React.Dispatch<React.SetStateAction<number>>,
  handleLevelUp: () => void,
  setLeveledUp: React.Dispatch<React.SetStateAction<boolean>> // レベルアップ状態を管理
) => {
  setPlayerExp((prevExp) => {
    const totalExp = prevExp + expGained;
    const nextLevelExp = playerLevel * 100; // 次のレベルに必要な経験値（例: レベル2なら100、レベル3なら200）
    console.log("playerLevel", playerLevel);
    console.log("nextLevelExp", nextLevelExp);
    // レベルアップ判定
    if (totalExp >= nextLevelExp) {
      setLeveledUp(true); // レベルアップフラグをオン
      handleLevelUp(); // レベルアップ処理を呼び出す
    } else {
      setLeveledUp(false); // レベルアップしていない場合はオフ
    }

    return totalExp;
  });
};
