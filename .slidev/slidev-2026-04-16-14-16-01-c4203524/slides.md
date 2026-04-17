---
theme: seriph
title: Gwen — Architecture
info: |
  Présentation technique du projet Gwen
author: Adrien PASSERON, Elyan GRUAU, Delphine POTHIN
colorSchema: auto
highlighter: shiki
lineNumbers: true
layout: default
drawings:
  enabled: false
  persist: false
transition: slide-left
mdc: true
themeConfig:
  sidebar: false
---

<style>
h1, h2 { color: #ffffff; }
.slidev-code { font-size: 0.82rem; }
.small { font-size: 0.9rem; opacity: 0.9; }
</style>

---
layout: cover
---

# Gwen
## Architecture (5 min) + Action complète (5 min)

<div class="small">

Projet: Gwent - jeu de cartes multijoueur type (React + Node + Socket.IO + MongoDB)

</div>

---
layout: agenda
---

# Plan (10 min)

- **Partie 1 — Architecture (5 min)**
  - Monorepo & choix techniques
  - Flux applicatif
  - Modèle de données
- **Partie 2 — Action complète (5 min)**
  - Cas: *un utilisateur joue une carte*
  - Client → API/Socket → Route → Service → BDD → Retour UI

<!-- 1 min -->

---
layout: section
---

# 1) Architecture globale

---
layout: two-cols
---

# Monorepo npm workspaces

- `gwen-client` → React + Vite
- `gwen-server` → Node.js + Express + Socket.IO
- `gwen-common` → types + logique métier partagée
- `gwen-generated-api` → client OpenAPI généré

## Pourquoi ce choix

- séparation claire des responsabilités
- partage de types TypeScript
- réduction des incohérences client/serveur

::right::

```txt
gwen/
├─ gwen-client/
├─ gwen-server/
├─ gwen-common/
├─ gwen-generated-api/
├─ docker-compose.yml
└─ scripts/
```

```bash
npm install
npm run dev
```

---
layout: default
---

# Stack & choix techniques

- **Frontend**: React, `react-router-dom`, Formik/Yup, SCSS modules
- **Backend**: Express (API REST) + Socket.IO (temps réel)
- **DB**: MongoDB (Docker Compose)
- **Auth**: JWT
- **Qualité**: ESLint, typecheck, tests, prettier
- **Temps réel**: matchmaking + événements de partie

---
layout: default
---



# Modèles de données réels

```ts
// gwen-server/src/features/auth/model/DBUser.ts
export interface DBUser {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string; // Jamais exposé côté client
  bio: string;
  profilePictureUrl?: string | null;
  favorite_deck?: string | null; // Référence deck favori (faction_id)
}

// gwen-server/src/features/auth/model/DBUserFactionDeck.ts
export interface DBUserFactionDeck {
  _id?: ObjectId;
  user_id: string;
  faction_id: string;
  leader_card_id: string | null;
  unit_card_ids: string[];
  special_card_ids: string[];
  is_valid: boolean;
  created_at?: Date;
  updated_at?: Date;
}
```

---
layout: section
---

# 2) Action complète: jouer une carte

---
layout: default
---

# Étape 1 — Client (React): intention de jeu

```ts
// gwen-client/src/features/game/usePlayCard.ts
import { api } from '@/api/client'
import { socket } from '@/realtime/socket'

export async function playCard(params: {
  matchId: string
  cardInstanceId: string
  targetRow: 'MELEE' | 'RANGED' | 'SIEGE'
}) {
  // Option A: REST pour validation/traçabilité
  await api.games.playCard(params.matchId, {
    cardInstanceId: params.cardInstanceId,
    targetRow: params.targetRow,
  })

  // Option B: socket d'accusé + sync immédiate
  socket.emit('game:play-card', params)
}
```

- Le client envoie l’action utilisateur.
- L’UI passe en état *loading* puis attend l’état serveur.

---
layout: default
---

# Étape 2 — Route API / WebSocket (entrée serveur)

```ts
// gwen-server/src/routes/game.routes.ts
router.post('/games/:matchId/play-card', authJwt, async (req, res, next) => {
  try {
    const result = await gameService.playCard({
      userId: req.user.id,
      matchId: req.params.matchId,
      cardInstanceId: req.body.cardInstanceId,
      targetRow: req.body.targetRow,
    })
    res.status(200).json(result)
  } catch (e) {
    next(e)
  }
})
```

```ts
// gwen-server/src/realtime/game.socket.ts
socket.on('game:play-card', async (payload) => {
  const updated = await gameService.playCard({ userId: socket.data.userId, ...payload })
  io.to(payload.matchId).emit('game:state-updated', updated.publicState)
})
```

---
layout: default
---

# Étape 3 — Service métier: validation + application des règles

```ts
// gwen-server/src/services/game.service.ts
export async function playCard(cmd: PlayCardCommand) {
  const game = await gameRepo.findById(cmd.matchId)
  assertPlayerTurn(game, cmd.userId)

  const card = findCardInHand(game, cmd.userId, cmd.cardInstanceId)
  const row = resolveRow(card, cmd.targetRow) // AGILE => MELEE | RANGED

  validatePlacement(card, row)
  applyCardToBoard(game, cmd.userId, card, row)
  removeFromHand(game, cmd.userId, card.id)
  recomputeRoundScore(game)

  const ended = checkRoundOrGameEnd(game)
  const saved = await gameRepo.save(game)

  if (ended.matchFinished) {
    await eloService.updateAfterMatch(saved)
  }

  return { publicState: toPublicGameState(saved) }
}
```

- C’est ici que la **règle métier** vit réellement.
- Client et API ne font pas la logique de jeu.

---
layout: two-cols
---

# Étape 4 — Persistance MongoDB

```ts
// gwen-server/src/repositories/game.repository.ts
export async function save(game: GameState) {
  await gamesCollection.updateOne(
    { _id: game.id },
    {
      $set: {
        board: game.board,
        hands: game.hands,
        scores: game.scores,
        turnPlayerId: game.turnPlayerId,
        updatedAt: new Date(),
      },
    }
  )
  return game
}
```

::right::

# Étape 5 — Retour UI temps réel

```ts
// gwen-client/src/features/game/socketHandlers.ts
socket.on('game:state-updated', (state) => {
  gameStore.setState(state)
  uiStore.clearPendingAction()
})
```

- Tous les clients de la room reçoivent l’état autoritaire.
- L’interface se resynchronise immédiatement.

---
layout: default
---

# Récapitulatif du flux complet

1. Utilisateur clique **“Jouer carte”** (client)
2. Appel API / événement Socket
3. Route/handler serveur
4. Service métier (validation, application règles)
5. Sauvegarde MongoDB
6. Broadcast état mis à jour
7. UI des 2 joueurs rafraîchie

## Points de qualité

- source de vérité côté serveur
- logique centralisée et testable
- typage partagé via `gwen-common`

---
layout: end
---

# Merci
## Des questions ?