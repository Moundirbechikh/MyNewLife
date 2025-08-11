// routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../Models/users');

router.post('/register', async (req, res) => {
  try {
    const { nom, prenom, email, sexe, password, age, profession } = req.body;

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email déjà utilisé.' });

    // Hash du mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Optionnel : hash de l’email (non recommandé sauf besoin spécifique)
    // const emailHash = await bcrypt.hash(email, 10);

    const newUser = new User({
      nom,
      prenom,
      email,
      sexe,
      passwordHash,
      age,
      profession,
    });

    await newUser.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès.' });
  } catch (err) {
    console.error('Erreur lors de l’inscription :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});
const jwt = require('jsonwebtoken'); // si tu veux un token plus tard

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cherche l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });

    // Compare le mot de passe
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect." });

    // Optionnel : générer un token JWT
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const jwt = require('jsonwebtoken');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({
      message: "Connexion réussie.",
      token,
      user: {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        sexe: user.sexe
      }
    });
    
      
  } catch (err) {
    console.error("Erreur de connexion :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});


module.exports = router;
