import { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const symbol = req.query.symbol as string;

  if (!symbol) {
    return res.status(400).json({ error: "Missing 'symbol' parameter" });
  }

  const apiKey = process.env.TWELVE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing Twelve Data API key in environment" });
  }

  try {
    const apiRes = await fetch(
      `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=5min&outputsize=30&apikey=${apiKey}`
    );
    const data = await apiRes.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch stock data" });
  }
}
