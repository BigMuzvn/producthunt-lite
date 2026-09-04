import fs from 'fs';
import path from 'path';
import { serverError } from '../utils/serverError.js';

// Whitelist stricte : les formats vectoriels/HTML (svg, xml...) sont exclus car
// ils peuvent embarquer du <script> exécuté si le fichier est ouvert directement
// (XSS stocké). Seuls des formats bitmap purs sont acceptés.
const ALLOWED_IMAGE_EXTENSIONS = {
  png: 'png',
  jpeg: 'jpg',
  jpg: 'jpg',
  gif: 'gif',
  webp: 'webp',
  avif: 'avif'
};

// 5 Mo par image, suffisant pour un logo/avatar/screenshot compressé.
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function uploadImage(req, res) {
  try {
    const { image } = req.body; // Base64 Data URL format e.g. "data:image/png;base64,..."
    if (!image) {
      return res.status(400).json({ message: 'Aucune donnée d\'image fournie.' });
    }

    const matches = image.match(/^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      // If it's already an HTTP URL, return as is
      if (image.startsWith('http://') || image.startsWith('https://')) {
        return res.json({ url: image });
      }
      return res.status(400).json({ message: 'Format d\'image invalide.' });
    }

    const subtype = matches[1].toLowerCase();
    const ext = ALLOWED_IMAGE_EXTENSIONS[subtype];
    if (!ext) {
      return res.status(400).json({ message: 'Format d\'image non autorisé. Formats acceptés : PNG, JPG, GIF, WEBP.' });
    }

    const data = Buffer.from(matches[2], 'base64');
    if (data.length > MAX_IMAGE_BYTES) {
      return res.status(400).json({ message: 'Image trop volumineuse (5 Mo maximum).' });
    }

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
    return serverError(res, err);
  }
}
