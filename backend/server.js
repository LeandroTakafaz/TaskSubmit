const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const cors = require("cors");
const config = require("./config.json");
const authRoutes = require("./routes/authRoutes");

const app = express();

connectDB(config.mongoURI);

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "login.html"));
});

app.use("/api/auth", authRoutes);

const PORT = config.port || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
