"use server";

import axios from "axios";
import { NextResponse } from "next/server";
import { OPENAI_API_URL } from "./../../../utils/constants";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY!;

/**
 * OpenAIのAPIを呼び出す
 * @returns
 */
export async function POST() {
  try {
    // NFTのための画像生成プロンプト
    const prompt = `
        Please generate monster image.
        At that time, please follow these conditions.

        - Pixel art style
        - A monster that looks like it could appear in Super Mario or Dragon QuestHas or Pokemom
        - wings on its back
        - A posture that gives off an intimidating presence
        - A design reminiscent of old-school games
        - Please make the background transparent.
    `;

    const response = await axios.post(
      OPENAI_API_URL,
      {
        prompt, // 生成する画像のプロンプトを指定
        n: 1, // 生成する画像の数
        size: "1024x1024", // 画像サイズ
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 生成された画像のURLを取得
    const imageUrl = response.data.data[0].url;
    console.log("Generated image URL:", imageUrl);

    return NextResponse.json({
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
}