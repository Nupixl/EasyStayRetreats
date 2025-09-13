// API route to serve the search properties JavaScript
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Set proper headers for JavaScript
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    // Read the JavaScript file
    const filePath = path.join(process.cwd(), 'public', 'js', 'search-properties.js');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    res.status(200).send(fileContent);
  } catch (error) {
    console.error('Error serving JavaScript file:', error);
    res.status(500).send('// Error loading script');
  }
}
