// pages/api/upload.ts
import type {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({success: false, error: "Method Not Allowed"});
  }

  try {
    // ローカルサーバーに名刺情報を送信
    const response = await fetch("http://localhost:4000/generate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("❌ ローカルサーバーへのリクエスト失敗:", error);
    res.status(500).json({
      success: false,
      error: "ローカルサーバーへのリクエストに失敗しました",
    });
  }
}
