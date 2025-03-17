// pages/api/upload.ts
import type {NextApiRequest, NextApiResponse} from "next";

const FIREBASE_FUNCTIONS_URL = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({success: false, error: "Method Not Allowed"});
  }

  try {
    // フロントエンドから受け取ったデータをそのまま Firebase Functions に送信
    const response = await fetch(
      `${FIREBASE_FUNCTIONS_URL}/generatePdfAndUpload`,
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("❌ Firebase Functions へのリクエスト失敗:", error);
    res.status(500).json({
      success: false,
      error: "Firebase Functions へのリクエストに失敗しました",
    });
  }
}
