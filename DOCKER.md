# Gwen - Docker Setup Guide

Ce projet utilise Docker et Docker Compose pour orchestrer tous les services.

## Prérequis

- Docker (version 20.10+)
- Docker Compose (version 1.29+)

## Services

- **PostgreSQL** : Base de données relationnelle (port 5432)
- **Gwen Server** : API backend Express/Node.js (port 3000)
- **Gwen Client** : Application React (port 5173)

## Démarrage rapide

### 1. Lancer tous les services

```bash
docker-compose up --build
```

Cela va:

- Construire les images Docker pour le serveur et le client
- Démarrer PostgreSQL avec un volume de persistance
- Démarrer le serveur API
- Démarrer l'application client

### 2. Accès aux services

- **Client React** : http://localhost:5173
- **Serveur API** : http://localhost:3000
- **PostgreSQL** : localhost:5432

### 3. Arrêter les services

```bash
docker-compose down
```

Pour supprimer aussi les volumes (données persistantes):

```bash
docker-compose down -v
```

## Configuration

Copiez le fichier `.env.example` vers `.env` et modifiez les variables d'environnement selon vos besoins:

```bash
cp .env.example .env
```

### Variables importantes

- `JWT_SECRET` : Clé secrète JWT (à changer en production)
- `POSTGRES_USER` / `POSTGRES_PASSWORD` : Identifiants PostgreSQL
- `VITE_API_URL` : URL de l'API pour le client

## Développement

Pour le développement local sans Docker:

```bash
# Terminal 1 - Démarrer PostgreSQL
docker run --name gwen-postgres -e POSTGRES_PASSWORD=gwenpassword -p 5432:5432 postgres:16-alpine

# Terminal 2 - Démarrer le serveur
npm run dev:server

# Terminal 3 - Démarrer le client
npm run dev:client
```

## Logs

Voir les logs d'un service spécifique:

```bash
docker-compose logs -f gwen-server
docker-compose logs -f gwen-client
docker-compose logs -f postgres
```

## Build en production

Pour construire les images sans les lancer:

```bash
docker-compose build
```

Pour pousser les images vers un registry:

```bash
docker tag gwen-server:latest your-registry/gwen-server:latest
docker tag gwen-client:latest your-registry/gwen-client:latest
docker push your-registry/gwen-server:latest
docker push your-registry/gwen-client:latest
```

## Troubleshooting

### Le serveur ne peut pas se connecter à PostgreSQL

Vérifiez que le service PostgreSQL est démarré et sain:

```bash
docker-compose ps
```

### Port déjà utilisé

Modifiez les ports dans `docker-compose.yml` ou stoppez le service qui utilise le port:

```bash
# Pour trouver quel processus utilise le port
lsof -i :5432
```

### Reconstruire après des modifications

```bash
docker-compose up --build --force-recreate
```
