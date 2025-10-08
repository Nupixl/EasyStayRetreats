import data from "../../../data.json";

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.json({ success: true, data: data });
  }
  
  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
