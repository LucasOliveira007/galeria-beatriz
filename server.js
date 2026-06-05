const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const { google } = require("googleapis");

const app = express();
app.use(cors());

// Configuração do multer (uploads temporários)
const upload = multer({ dest: "uploads/" });

// OAuth2 usando variáveis de ambiente
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Refresh token salvo como variável de ambiente
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});

// Cliente do Google Drive
const drive = google.drive({ version: "v3", auth: oauth2Client });

// Upload de Foto
app.post("/upload/foto", upload.single("file"), async (req, res) => {
  try {
    const fileMetadata = {
      name: req.file.originalname,
      parents: [process.env.FOLDER_FOTOS] // ID da pasta Fotos no Drive
    };

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path)
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id"
    });

    fs.unlinkSync(req.file.path); // remove arquivo temporário

    res.json({
      success: true,
      message: "📸 Foto enviada com sucesso!",
      fileId: file.data.id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Upload de Vídeo
app.post("/upload/video", upload.single("file"), async (req, res) => {
  try {
    const fileMetadata = {
      name: req.file.originalname,
      parents: [process.env.FOLDER_VIDEOS] // ID da pasta Vídeos no Drive
    };

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path)
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id"
    });

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: "🎥 Vídeo enviado com sucesso!",
      fileId: file.data.id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Inicializar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
