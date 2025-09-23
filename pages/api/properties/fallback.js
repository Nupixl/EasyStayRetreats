import data from "../../../data.json";

export default function handler(req, res) {
  if (req.method === "GET") {
    // Add artificial delay to match original behavior
    const time = Math.floor(Math.random() * 1000);
    
    setTimeout(() => {
      return res.json({ success: true, data: data });
    }, time);
  }
  
  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
