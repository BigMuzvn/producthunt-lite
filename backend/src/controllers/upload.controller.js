import fs from 'fs';
import path from 'path';

export async function uploadImage(req, res) {
  try {
    const { image } = req.body; // Base64 Data URL format e.g. "data:image/png;base64,..."
    if (!image) {
      return res.status(400).json({ message: 'Aucune donnée d\'image fournie.' });
    }

    const matches = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      // If it's already an HTTP URL, return as is
      if (image.startsWith('http://') || image.startsWith('https://')) {
        return res.json({ url: image });
      }
      return res.status(400).json({ message: 'Format d\'image invalide.' });
    }

    const ext = matches[1].split('/')[1].replace('+xml', '');
    const data = Buffer.from(matches[2], 'base64');

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, data);

    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:5000';
    const fileUrl = `${protocol}://${host}/uploads/${filename}`;

    return res.json({ url: fileUrl });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
