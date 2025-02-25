const mongoose = require("mongoose");
const config = require("../config.json");

const connectDB = async (mongoURI) => {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("MongoDB conectado...");
    } catch (err) {
        console.error("Erro ao conectar ao MongoDB:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
