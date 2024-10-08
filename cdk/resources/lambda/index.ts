import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { Document } from "@langchain/core/documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RunnableLambda,
  RunnableMap,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getS3Object } from "./helper/s3";

// 環境変数を取得する。
const {OPENAI_API_KEY} = process.env;

/**
 * ハンドラー
 * @param event
 * @returns
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  
  console.log(`
    ================================ [Generate Quiz API START] ================================
  `);

  // S3バケット名を指定
  const bucketName = 'solana-radar-hackathon2024'; 
  // ファイル名を指定
  const objectKey = 'MagicBlock.md'; 
  // S3バケットからオブジェクトを取得する。
  const content = await getS3Object(bucketName, objectKey);
  // ベクトルデータストアを作成
  const vectorStore = await HNSWLib.fromDocuments(
    [new Document({pageContent: content})],
    new OpenAIEmbeddings()
  );

  const retriever = vectorStore.asRetriever(1);
  // テンプレートプロンプト
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "ai",
      `Please create simple question based on only the following context:
        
      {context}`,
    ],
    ["human", "{question}"],
  ]);

  // ChatOpenAIインスタンスを生成
  const model = new ChatOpenAI({
    apiKey: OPENAI_API_KEY!,
  });
  const outputParser = new StringOutputParser();
  // セットアップ
  const setupAndRetrieval = RunnableMap.from({
    context: new RunnableLambda({
      func: (input: string) =>
        retriever.invoke(input).then((response) => response[0].pageContent),
    }).withConfig({runName: "contextRetriever"}),
    question: new RunnablePassthrough(),
  });

  let response;

  try {
    // プロンプトチェーンを作成
    const chain = setupAndRetrieval.pipe(prompt).pipe(model).pipe(outputParser);
    // プロンプトを実行
    const aiResponse = await chain.invoke(`
      MagicBookについて簡単なクイズを英語で作成してください。

      その際、回答は4択で、正しい答えが1つだけになるようにしてください。  
      問題文に答えが含まれないように注意してください。

      問題と回答は1ペアだけ作成してください。  
      なお、correct_answerは回答のキーではなく、answersオブジェクト内の4つの選択肢のいずれかの値と文字列一致させてください。  
      正解は選択肢A〜Dの中でランダムに設定してください。

      問題と回答は次の形式でJSONとして出力してください：

      {
        "question": "問題文",
        "answers": {
          "A": "選択肢A",
          "B": "選択肢B",
          "C": "選択肢C",
          "D": "選択肢D"
        },
        "correct_answer": "正しい回答（選択肢A〜Dのいずれかと一致する値）"
      }

      よろしくお願いします。
    `);
    console.log("aiResponse:::", aiResponse);

    response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-API-KEY",
      },
      body: JSON.stringify({
        content: aiResponse,
      }),
    };
  } catch (e: any) {
    console.error("error: ", e);

    response = {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-API-KEY",
      },
      body: JSON.stringify({
        message: "send meta tx failed.",
      }),
    };
  } finally {
    console.log(`
      ================================ [Generate Quiz API END] ================================
    `);
  }

  return response;
}