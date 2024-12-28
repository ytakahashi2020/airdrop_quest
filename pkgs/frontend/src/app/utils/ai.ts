import axios from "axios";
import { AWS_API_GATEWAY_ENDPOINT } from "./constants";
import { MonsterNFTData, QuizData } from "./types";

/**
 * generate Monster Data (Status & Image) method
 */
export const generateMonsterData = async () => {
  try {
    // NFTのメタデータを生成するAPIを呼びだす。
    const response = await axios.post("/api/ai");
    console.log("response", response);
    console.log("response.data", response.data);
    console.log("Name: ", response.data.name);

    // NFTの画像データを自動生成するAPIを呼び出す。
    const response2 = await axios.post("/api/ai/generateImage");
    console.log("response2", response2);
    console.log("response2.data", response2.data);
    console.log("imageUrl: ", response2.data.imageUrl);
    // 返却用NFTデータを作成
    const nftData: MonsterNFTData = {
      name: response.data.name,
      description: response.data.description,
      imageUrl: response2.data.imageUrl,
      health: response.data.health,
      attack: response.data.attack,
      defense: response.data.defense,
      rarity: response.data.rarity,
    }
    return nftData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axiosのエラーが発生しました:", error);
    } else {
      console.error("Axios以外のエラーが発生しました:", error);
    }
  }
};

/**
 * generate Quiz data method
 */
export const generateQuizData = async (): Promise<QuizData> => {
  try {
    // ヘッダー情報
    const headers = {
      'X-API-KEY': `${process.env.NEXT_PUBLIC_AWS_APIGATEWAY_API_KEY}`,  
      'Content-Type': 'application/json'  
    };
    // 問題と回答を自動生成するAPIを呼び出す。
    const response: any = await fetch(`${AWS_API_GATEWAY_ENDPOINT}/generateQuiz`,  {method: 'POST',headers: headers});
    const responseContent = await response.json()
    console.log("response:::", responseContent);
    console.log("content:::", responseContent.content);
    // 変換して値を返却する。
    const quizData: QuizData = JSON.parse(responseContent.content);
    return quizData;
  } catch (error) {
    console.error("クイズ生成用APIを呼び出している途中でエラーが発生しました:", error);
    
    return {
      question: "",
      answers: {
        A: "",
        B: "",
        C: "",
        D: ""
      },
      correct_answer: "NONE"
    }
  }
};