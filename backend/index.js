require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// 🔁 Import des cron jobs (daily + weekly dynamique)
require('./cronJobs');

const app = express();

// 🌐 Middlewares
app.use(cors({
  origin: 'https://mynewlife-frontend.vercel.app',
  credentials: true
}));

app.use(express.json());

// 📦 Routes
const userRoutes = require("./Routes/users");
const objectiveRoutes = require("./Routes/objective");

app.use("/api/users", userRoutes);
app.use("/api/objectives", objectiveRoutes);

// 🌍 Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log("✅ Connexion à MongoDB réussie");

  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("📁 Collections disponibles :", collections.map(c => c.name));

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`🚀 Serveur backend lancé sur http://localhost:${port}`);
  });
})
.catch((err) => {
  console.error("❌ Erreur de connexion à MongoDB :", err);
});
