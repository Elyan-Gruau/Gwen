[![CI](https://github.com/Elyan-Gruau/Gwen/actions/workflows/ci.yml/badge.svg)](https://github.com/Elyan-Gruau/Gwen/actions/workflows/ci.yml)
# Gwen

A gwent like game.

## How do you play Gwent?

Gwent is a card game for two players. The aim of the game is to beat your opponent using one’s own deck by ensuring that the total strength of your cards on the board is greater than that of your opponent’s in two out of three rounds. During the game, various unit cards can be placed in one of three corresponding tiers:
1. _Close Combat_;
2. _Ranged Combat_;
3. _Siege Combat_.

The sum of the played cards strength decides which player wins the round itself.

All rounds of a match must be played with the same starting hand. Mastering how to use your available cards sparingly is the key to victory.

- Each player can play 1 card per round
- Each card has a power value and a type (melee, range, siege, other...)
- To end the round, both players must skip their turn or cannot play any card anymore.

Gameplay : https://www.youtube.com/watch?v=sphmZC2U06Y

<p align="center">
<img src="doc/resources/gwent_rules_1.png" width="270">
<img src="doc/resources/gwent_rules_2.png" width="270">
<img src="doc/resources/gwent_rules_3.png" width="270">
</p>

## Assets

- icons from svgrepo
- card visuals from https://github.com/matt77hias/Gwent

## Backend

- Websockets
- Authentication

TODO

- [x] Add a builder to build the real objects from the config.
- [ ] Cache the images so that we don't have to load them every time.
- [ ] Profile page
    - [ ] Change username (if not already taken)
    - [ ] Change password
    - [ ] Change avatar
    - [ ] See elo
- [ ] Matchmaking
    - [ ] Elo based matchmaking (Ranked)
    - [ ] Casual matchmaking
        - [ ] Find a match
        - [ ] Create a game
        - [ ] Join a game
- [ ] Game logic
    - [ ] Place a card
    - [ ] Do the "Coin flip" to decide who starts
    - [ ] End turn 
    - [ ] End game
    - [ ] Implement game quit
    - [ ] Implement surrender
    - [ ] Implement rematch
- [ ] Add IA
    - [ ] Very basic IA strategy (If, else)
    - [ ] Use the IA when no opponent is found after 10seconds
- [ ] Add light mode / dark mode switch, auto select from the os
- [ ] Lazyload each route.
- [ ] Add auto token refresh
- [ ] Prevent user from joining the matchmaking queue if the deck is not SAVED & valid
- [ ] Move the deck validation to the backend 

## Utilisation de l'IA dans le projet

### Models

- GPT 5.2
- GPT 4.1
- Claude haiku 4.5

Les ias ont été utilisées pour :

- Générer des idées de cartes et de factions : On envoit le site avec donnes a ChatGPT avec le modele a suivre (
  datastructure), et on lui demande depuis la page de crawl et de recuperer les infos des cartes.
- Fix les differents problemes de configuration typescript, scss, open-api ...
- implémenter certaines fonctionnalités bien précises mais en aucun cas utilisées pour définir la structure globale du projet


## Lancement du projet 

Le projet peut etre lancer en 100% docker, en executant le script ***bash*** `launch-project.sh`.
```bash
./scripts/launch-project.sh
```

## Repartition du travail

### Adrien Passeron

- Page de profil
- [X] Logique de jeu
- [X] Page d'accueil
- [X] Theme light / dark
- [ ] hebergement
- [X] Ameliorations UI/UX
- [X] Page de win /lose
- [X] Calcul du elo
- [X] Metadata et correctifs finaux

### Elyan Gruau

- [X] Authentification
- [X] Matchmaking
- [X] Dockerisation
- [X] Page de connexion
- [X] Page d'inscription
- [X] Page de deck builder

## For next updates

- [ ] Sound effects
- [ ] Special card effects
- [ ] Leader abilities