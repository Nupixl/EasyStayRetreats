import { withBasePath } from "../../../utils/basePath";

// Redirect to new Supabase-based properties endpoint
export default function handler(req, res) {
  if (req.method === "GET") {
    // Redirect to the new properties endpoint
    return res.redirect(307, withBasePath("/api/properties"));
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
