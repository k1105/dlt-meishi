// pages/api/generate.ts
import type {NextApiRequest, NextApiResponse} from "next";
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
    return res.status(405).json({error: "Method Not Allowed"});
  }

  const {question, roll, image} = req.body;

  console.log("送信されたデータ:", {question, roll});
  console.log("送信される画像データ:", image.substring(0, 100)); // 100文字まで表示

  if (!question || !roll || !image) {
    return res.status(400).json({error: "Missing question, roll, or image"});
  }

  try {
    // **GPTに画像の内容を質問する**
    const visionPrompt = "この画像には何が写っていますか？";

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // 画像解析が可能なモデル
      messages: [
        {role: "system", content: "あなたは画像を解析するAIです。"},
        {role: "user", content: visionPrompt},
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
              },
            },
          ],
        }, // Base64画像を送信
      ],
      max_tokens: 300,
    });

    const imageDescription =
      response.choices[0].message?.content?.trim() ||
      "画像の説明が取得できませんでした";

    // **説明を既存の JSON 生成プロンプトに適用**
    const finalPrompt = `
以下の質問に対する答えとして、次のように説明される画像が提供されました。
それを踏まえて提供者のものごとに対して投げかける尺度を想像し、名刺デザインパターンを出力フォーマットに沿って出力してください。
肩書き: "${roll}"

【質問】  
"${question}"

【画像の説明】  
"${imageDescription}"

#### **要件**

1. **回答者の性格やものづくりに対する姿勢を想像し、1～3行で「あなたについて」を述べる。**
2. **次に、「JSON形式」で出力する。** 出力の中に説明文を混在させない。
3. **ロゴサイズ (size) は必ず \ xs, s, m, l\ のいずれか。**  
   - 繊細な印象を受ける→\ xs\ or \ s\    
   - 非常にポジティブな印象、ボールドな印象→\ l\ 
   - 回答者からは上記のような印象を受けない→\ m\
4. **position.x は 0～100, position.y は 0～100。**
   - 明快でボールドな印象、正統派の印象の場合は中央付近に配置する: x=50, y=50.
   - ポジティブな印象の場合は右上、ネガティブな印象の場合は左下に配置する。
5. **grid.type は isolation, perspective, hybrid の３種類のみ。**  
   - 「チームワークが好きな人」→perspective
   - 「一つの指針を考える人」→isolation  
   - 「きめ細やかな人」→hybrid
6. **grid.detailedness は 1～4 で設定。**  
   - 繊細な性格→ 1
   - 大胆、ざっくりした性格→ 4
7. **極端な性格の場合: sizeをxsかlにし、positionも端へ寄せる。**

#### **出力フォーマット**
まず **あなたについて** を1～3行で説明する。(冒頭に「あなたについて」という文字列は不要)
続いて、下記 JSON を出力:

\`\`\`json
{
  "position": { "x": (数値0~100), "y": (数値0~100) },
  "size": "xs | s | m | l",
  "grid": { "type": "(isolation | perspective | hybrid)", "detailedness": (1~4) }
}
`;

    // **OpenAI に最終プロンプトを送信**
    const finalResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{role: "user", content: finalPrompt}],
      max_tokens: 300,
    });

    const resultText = finalResponse.choices[0].message?.content?.trim() || "";
    const [judgment, jsonMatch] = resultText.split("```json");
    console.log("Image Description:", imageDescription);
    console.log("Judgment:", judgment);
    console.log("result", resultText);
    console.log("JSON Match:", jsonMatch);
    const jsonDataStr = jsonMatch ? jsonMatch.replace("```", "").trim() : "{}";
    console.log("JSON Data:", jsonDataStr);

    return res.status(200).json({
      judgment,
      jsonData: JSON.parse(jsonDataStr),
    });
  } catch (error) {
    console.error("Error generating response:", error);
    return res.status(500).json({error: "Error generating response"});
  }
}
