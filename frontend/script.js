// Upload de foto
app.post("/upload/foto", upload.single("file"), async (req, res) => {
  try {
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const fileMetadata = {
      name: req.file.originalname,
      mimeType: req.file.mimetype,
      parents: ["ID_DA_PASTA_FOTOS"] // pasta só para fotos
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

    res.send({ success: true, fileId: file.data.id });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

// Upload de vídeo
app.post("/upload/video", upload.single("file"), async (req, res) => {
  try {
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const fileMetadata = {
      name: req.file.originalname,
      mimeType: req.file.mimetype,
      parents: ["ID_DA_PASTA_VIDEOS"] // pasta só para vídeos
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

    res.send({ success: true, fileId: file.data.id });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});
