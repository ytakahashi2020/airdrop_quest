"use server";

import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY!;

/**
 * OpenAIのAPIを呼び出す
 * @returns
 */
export async function POST() {
  try {
    // プロンプトテンプレート
    const TEMPLATE = `
        あなたはWeb3とNFTに精通したエンジニアです。
        RPG系のゲームに出てくるモンスターNFTに割り当てるメタデータを生成してjson形式で答えてください。

        なお、次の要素を含んだメタデータとしてください。
            1. name
            2. description
            3. attributes

        attributesには次の要素を含めてください。
            1. health
            2. attack
            3. defense
            4. rarity
        
        なお、attributesの中身も json形式で出力してください。
    `;

    const llmModel = new OpenAI({
      apiKey: OPENAI_API_KEY,
      modelName: "gpt-4-1106-preview",
      modelKwargs: {response_format: {type: "json_object"}},
    });

    const prompt = new PromptTemplate({
      template: TEMPLATE,
      inputVariables: [],
    });
    // プロンプトチェーンを作成
    const chain = prompt.pipe(llmModel);
    // 実行
    const result = await chain.invoke({});
    console.log("result:::", result);

    // JSONオブジェクト化
    const metadata = JSON.parse(result);
    console.log("name::: ", metadata.name);

    return NextResponse.json({
      name: metadata.name,
      description: metadata.description,
      health: metadata.attributes.health,
      attack: metadata.attributes.attack,
      defense: metadata.attributes.defense,
      rarity: metadata.attributes.rarity,
    });
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
}