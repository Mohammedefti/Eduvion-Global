
// javascript id = "servercode"
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const { google } = require("googleapis");

const app = express();

app.use(cors());

const upload = multer({
    dest: "uploads/"
});

const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: ["https://www.googleapis.com/auth/drive"]
});

const drive = google.drive({
    version: "v3",
    auth
});



app.post("/upload", upload.single("cv"), async (req, res) => {
    console.log("UPLOAD API HIT");

    try {
        // console.log("FILE RECEIVED:", req.file);
        console.log("FILE INFO:", req.file);

        // proper upload in upload file
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file received from frontend"
            });
        }
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const fileMetadata = {
            name: req.file.originalname,
            parents: ["13wwRY5q-qxHDuZiq06m7yj7WWzfeGOvc"]
        };

        const media = {
            mimeType: req.file.mimetype,
            body: fs.createReadStream(req.file.path)
        };

        const response = await drive.files.create({
            resource: fileMetadata,
            media,
            fields: "id"
        });

        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            fileId: response.data.id
        });

    } catch (error) {

        console.log("UPLOAD ERROR:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

console.log("Starting server...");

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

