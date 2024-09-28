/**
 * create new nft method
 */
export const createNFT = async () => {
  try {
    // NFTのメタデータを生成するAPIを呼びだす。
    const response = await fetch("/api/metaplex");
    console.log("response", response);
  } catch (error) {
    console.error("MetaPlext API呼び出し中にエラーが発生しました:", error);
  }
}