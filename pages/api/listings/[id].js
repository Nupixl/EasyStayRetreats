export default function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query
    return res.redirect(307, `/api/properties/${id}`)
  }
}
