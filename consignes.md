## Fonctionnalités — Thème

L'utilisateur peut changer le thème de l'application (light / dark).

- Le choix est sauvegardé dans le navigateur (persistant au rechargement)
- Si le système d'exploitation est en mode dark et que le navigateur supporte
  prefers-color-scheme , le site propose automatiquement le mode dark

## Autres fonctionnalités

|------|--------------------|
| Fonctionnalité | Difficulté |
|----------------|------------|----------------|
| 🫶 Déployer en ligne (AWS / GCP / Azure free tier) |🦁|
|🫶 WebSockets — visualiser le dessin en temps réel|🥷|
|👍 Export d'un PixelBoard en image (SVG ou PNG) |🐵|
|SuperPixelBoard — affiche toutes les créations| 🐵|
|Heatmap des pixels les plus utilisés| 🐵 / 🦁|
|Mode "replay" — historique des contributions par pixel |🥷|
|Upload d'une image convertie en pixel |🦁|

- 🐵 facile
- 🦁 moyen
- 🥷 difficile
- 👍 Nice to have
- 🫶 Must have !

## Contraintes

- MonoRepo — utiliser l'architecture fournie : project-skeleton
    - api/ : structurer en dossiers routes/ , services/ , models/
    - client/ : prévoir une bonne structure de dossiers/fichiers
- React côté client, Node.js côté serveur
- Docker Compose obligatoire pour la base de données
- Responsive — l'affichage s'adapte à toutes les tailles d'écran
- TypeScript si vous le souhaitez
- Gestion des requêtes : erreurs + états de chargement (spinners)
- SPA avec routeur (react-router ou équivalent)
- Validation des formulaires côté client
- Linter de code

## Modalités

ÉQUIPES
3 à 4 personnes

DEADLINE
📅 Rendu : 15 avril 📅 Soutenance : 17 avril

Barème /20
| ------ |--------------------|
| Critère | Points |
| Livrables (consignes, Readme, déploiement, lancement) |4|
| Gestion de projet (commits, GitHub, kanban) |4|
| Fonctionnalités développées| 6|
| Code (lisibilité, architecture, bonnes pratiques)| 6|