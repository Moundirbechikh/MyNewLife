# 🚀 Objective Tracker — Purple & Lime Edition

Une application web élégante et motivante pour suivre ses **objectifs quotidiens**, **hebdomadaires** et **mensuels**.  
Pensée pour encourager la régularité, la discipline et la progression personnelle, avec un **design dynamique** basé sur le genre de l’utilisateur.

🎨 **Thèmes visuels Lime & Purple** pour une expérience immersive et personnalisée.

---

## ✨ Fonctionnalités principales

### 🎨 Thème dynamique selon le genre
- **Lime** pour les utilisateurs **masculins**
- **Purple** pour les utilisatrices **féminines**
- Transitions fluides et feedback visuel contextuel

### 📅 Vue Agenda
- Visualisation par **jour**, **semaine** ou **mois**
- Historique des validations et échecs
- Affichage des **jours “parfaits”** avec rendu motivant

### 🎯 Liste d’objectifs
- Objectifs **daily**, **weekly**, **monthly**
- Validation **manuelle** ou **automatique** (via cron)
- Suivi de progression, fréquence et statut

### 🕛 Cron Jobs intelligents
- **23:59** → Enregistrement automatique des objectifs non validés (*failed*)
- **00:00** → Réinitialisation des objectifs pour la nouvelle journée
- Système hebdomadaire dynamique avec reset & historique

### 📊 Historique visuel
- Affichage des jours où **tous les objectifs** ont été validés
- Icônes et couleurs pour chaque statut : ✅ ❌ ⏭️
- Motivation par **régularité** et feedback positif

### 🔐 Authentification utilisateur
- Connexion sécurisée avec **JWT**
- Objectifs liés à chaque utilisateur
- Initiales affichées dans la **barre de navigation**

---

## 🖼️ Aperçu visuel *(à ajouter)*
- Page principale avec **citation personnalisée**
- Carousel d’objectifs animés
- Vue agenda avec historique du jour
- Thèmes **Lime & Purple** en action

---

## 🛠️ Stack technique

**Frontend**  
- React.js  
- Tailwind CSS  

**Backend**  
- Express.js  
- MongoDB Atlas  

**Auth & Sécurité**  
- JWT + middleware sécurisé  

**Automatisation**  
- node-cron  
- date-fns  

**Design**  
- Transitions fluides  
- Feedback visuel  
- Responsive mobile/desktop  

---

## 🎨 Palette de couleurs

| Thème  | Couleurs |
|--------|----------|
| **Lime**   | `#32CD32` → `#C7F464` |
| **Purple** | `#6A0DAD` → `#DDA0DD` |

---

## 📌 Roadmap

- [x] Validation manuelle + historique  
- [x] Cron intelligent pour daily & weekly  
- [x] Responsive design mobile/tablette  
- [ ] Ajout d’un **calendrier visuel interactif**  
- [ ] Système de **badges** et récompenses  
- [ ] Notifications **push**  
- [ ] Mode **sombre**  

---

## 🚀 Déploiement

- **Backend** : Express hébergé sur [Render / Railway / VPS]  
- **Frontend** : React déployé séparément ou intégré  
- **Cron jobs** : Actifs en production  

---

## 📄 Licence

**MIT License** — libre d’usage, de modification et de partage.

---
