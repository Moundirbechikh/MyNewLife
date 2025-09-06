require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");


const app = express();

// 🌐 Middlewares
app.use(cors({
  origin: 'https://my-new-life-blond.vercel.app',
  credentials: true
}));
app.use(express.json());

// 📦 Routes
const userRoutes = require("./Routes/users");
const objectiveRoutes = require("./Routes/objective");

app.use("/api/users", userRoutes);
app.use("/api/objectives", objectiveRoutes);

// ✅ Route d’accueil pour test Render
app.get('/', (req, res) => {
  res.send(`
    <h1>🚀 Backend opérationnel</h1>
    <p>Endpoints disponibles :</p>
    <ul>
      <li><a href="/api/users">/api/users</a></li>
      <li><a href="/api/objectives">/api/objectives</a></li>
    </ul>
  `);
});

// 🌍 Connexion à MongoDB + lancement du serveur
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
