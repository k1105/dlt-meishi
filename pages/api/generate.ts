// pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { question, answer } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ error: "Missing question or answer" });
  }

  const prompt = `
  以下の質問と回答に基づき、名刺のデザインパターンをフォーマットに則って出力してください。  

  【質問】  
  "${question}"  

  【回答】  
  "${answer}"  

  #### **要件**
  1. **最初に、回答の特徴に応じたデザイン判断基準（原因）を説明すること。**  
  2. **次に、フォーマットに従い TypeScript オブジェクトを JSON 形式で出力すること。**  
  3. **ロゴサイズは xs, s, m, l, xl のいずれかを選ぶこと。**  
  4. **グリッドの type は isolation | grid | scale | perspective | column | hybrid から選ぶこと。**  
  5. **グリッドの detailedness は 1〜10 の範囲で適切な値を設定すること。**

  #### **出力フォーマット**
  まず、判断基準（原因）を説明する。簡潔に記載すること!!!
  その後、以下の JSON 形式で出力する.

  \`\`\`json
  {
    "position": { "x": (適切な値), "y": (適切な値) },
    "size": "xs | s | m | l | xl",
    "grid": { "type": "(選択したグリッド)", "detailedness": (適切な値) }
  }
  \`\`\`
    `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    const resultText = response.choices[0].message?.content?.trim() || "";

    const [judgment, jsonMatch] = resultText.split("```json");
    const jsonDataStr = jsonMatch ? jsonMatch.replace("```", "").trim() : "{}";

    return res.status(200).json({
      judgment,
      jsonData: JSON.parse(jsonDataStr),
    });
  } catch (error) {
    console.error("Error generating response:", error);
    return res.status(500).json({ error: "Error generating response" });
  }
}
