const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const cors = require("cors");
const config = require("./config.json");
const studentRoutes = require("./routes/studentRoutes");
const professorRoutes = require("./routes/professorRoutes")
const authRoutes = require("./routes/authRoutes");
const curriculumRoutes = require("./routes/curriculumRoutes");
const fileRoutes = require("./routes/fileRoutes");

const app = express();

connectDB(config.mongoURI);

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "login.html"));
});

app.use("/api/student", studentRoutes);
app.use("/api/professor", professorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/curriculum", curriculumRoutes);
app.use("/api/files", fileRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = config.port || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
