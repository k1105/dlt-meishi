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

  const { question, answer, roll } = req.body;
  if (!question || !answer || !roll) {
    return res.status(400).json({ error: "Missing question or answer" });
  }

  const prompt = `
以下の質問と回答に基づき、名刺デザインパターンをフォーマットに沿って出力してください。
肩書き: "${roll}"

【質問】  
"${question}"

【回答】  
"${answer}"

#### **要件**

1. **回答の特徴を簡潔に分析し、1～3行で「判断基準（原因）」を述べる。**
2. **次に、TypeScript形式ではなく「JSON形式」で出力する。** ただし出力の中に説明文を混在させない。
3. **ロゴサイズ (size) は必ず \`xs, s, m, l, xl\` のいずれか。**  
   - 回答が短く控えめ、あるいは非常に堅実である→\`xs\`  
   - 無難 or 少し行動的→\`s\` or \`m\`  
   - 強い語気・行動的→\`l\` or \`xl\`  
4. **position.x は 0～455, position.y は 0～275。**
   - 明快さ、ボールドな印象、正統派の印象の場合は中央付近に配置する: x=225, y=140.
   - ポジティブな印象の場合は右上、ネガティブな印象の場合は左下に配置する。
5. **grid.type は isolation, grid, scale, perspective, column, hybrid の6種類のみ。**  
   - 「量的比較」→scale  
   - 「全体俯瞰」→perspective  
   - 「秩序」→grid  
   - 「個性が強い」→isolation  
   - 「文書構造」→column  
   - 「多様性の混合」→hybrid
6. **grid.detailedness は 1～10 で設定。**  
   - 長文・丁寧な回答→大きめ（8～10）  
   - 簡潔 or カジュアル→小さめ  
7. **極端な表現の場合: sizeをxsかxlにし、positionも端へ寄せる。**

#### **出力フォーマット**
まず **判断基準（原因）** を1～3行で説明する。
続いて、下記 JSON を出力:

\`\`\`json
{
  "position": { "x": (数値0~455), "y": (数値0~275) },
  "size": "xs | s | m | l | xl",
  "grid": { "type": "(isolation | grid | scale | perspective | column | hybrid)", "detailedness": (1~10) }
}
\`\`\`

    `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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
