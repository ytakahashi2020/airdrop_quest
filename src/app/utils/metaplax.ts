/**
 * mint WinnerNFT method
 */
export const mintWinnerNFT = async () => {
  try {
    // NFTのメタデータを生成するAPIを呼びだす。
    const response = await fetch("/api/metaplex");
    console.log("response", response);
    return response;
  } catch (error) {
    console.error("MetaPlext API呼び出し中にエラーが発生しました:", error);
    return null;
  }
}