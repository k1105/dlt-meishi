// app/api/generate/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { question, answer } = await request.json();
    if (!question || !answer) {
      return NextResponse.json(
        { error: "Missing question or answer" },
        { status: 400 }
      );
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
  まず、判断基準（原因）を説明する。
  その後、以下の TypeScript オブジェクトを JSON 形式で出力する.

  \`\`\`typescript
  {
    "position": { "x": (適切な値), "y": (適切な値) },
    "size": "xs | s | m | l | xl",
    "grid": { "type": "(選択したグリッド)", "detailedness": (適切な値) }
  }
  \`\`\`
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    const resultText = response.choices[0].message?.content?.trim() || "";
    // 分割によって判断基準と JSON 部分を分ける
    const [judgment, jsonMatch] = resultText.split("```typescript");
    const jsonDataStr = jsonMatch ? jsonMatch.replace("```", "").trim() : "{}";

    return NextResponse.json({
      judgment,
      jsonData: JSON.parse(jsonDataStr),
    });
  } catch (error) {
    console.error("Error generating response:", error);
    return NextResponse.json(
      { error: "Error generating response" },
      { status: 500 }
    );
  }
}
