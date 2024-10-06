/**
 * mint WinnerNFT method
 */
export const mintWinnerNFT = async () => {
  try {
    // NFTのメタデータを生成するAPIを呼びだす。
    const response = await fetch("/api/nft/mint/winnerNft");
    console.log("response", response);
    return response;
  } catch (error) {
    console.error("MetaPlext API呼び出し中にエラーが発生しました:", error);
    return null;
  }
}

/**
 * mint Statue method
 */
export const mintStatueNFT = async () => {
  try {
    // NFTのメタデータを生成するAPIを呼びだす。
    const response = await fetch("/api/nft/mint/statue");
    console.log("response", response);
    return response;
  } catch (error) {
    console.error("MetaPlext API呼び出し中にエラーが発生しました:", error);
    return null;
  }
}