const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

router.post("/upload", upload.any(), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ msg: "Nenhum arquivo enviado." });
    }

    const arquivosInfo = req.files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        path: `/uploads/${file.filename}`
    }));

    res.status(200).json({
        msg: "Arquivos enviados com sucesso!",
        arquivos: arquivosInfo
    });
});


router.get("/download/:filename", (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(uploadDir, filename);

    if (!fs.existsSync(filepath)) {
        return res.status(404).json({ msg: "Arquivo não encontrado." });
    }

    res.download(filepath, filename, (err) => {
        if (err) {
            console.error("Erro ao baixar arquivo:", err);
            res.status(500).json({ msg: "Erro ao baixar o arquivo." });
        }
    });
});

module.exports = router;
