const PIXEL_BUFFER = Buffer.from(
  "R0lGODlhAQABAIAAAP///////ywAAAAAAQABAAACAkQBADs=",
  "base64"
);

export default function handler(req, res) {
  res.setHeader("Content-Type", "image/gif");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Content-Length", PIXEL_BUFFER.length.toString());
  res.status(200).end(PIXEL_BUFFER);
}
