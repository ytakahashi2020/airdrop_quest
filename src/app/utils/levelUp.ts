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

  // レベルアップメッセージを設定
  setLevelUpMessage(`レベルが${playerLevel + 1}に上がりました！`);
  setStatIncreaseMessage(
    `HP: +${hpIncrease} MP: +${mpIncrease} 攻撃力: +${attackIncrease} 防御力: +${defenseIncrease}`
  );
};
