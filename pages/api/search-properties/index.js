import { withBasePath } from "../../../utils/basePath";

export default function handler(req, res) {
  if (req.method === "HEAD") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.redirect(307, withBasePath("/api/properties/search"));
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
