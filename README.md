# Gwen

A gwent like game with parodic cards.

- Inscription sur le site
- Profil
- Connexion
- Matchmaking -> Elo

# Client

React

## Gwent rules

- 2 players
- 3 rounds
- 3 rows (melee, range, siege)
- Each player can play 1 card per round
- Each card has a power value and a type (melee, range, siege)
- The player with the highest total power at the end of the round wins the round

Gameplay : https://www.youtube.com/watch?v=sphmZC2U06Y

Cards effects :

- Moral boost : +1 power to all cards in the same row (excluding himself)
- Commander's horn : Double the strength of all cards in the same row
-

## Architecture

Un objet de config de base, ou est definis les factions, les cartes ...
Ainsi le jeu est modulaire et facilement extensible.

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

## Utilisation de l'IA dans le projet

### Models

- GPT5.2
- Claude haiku 4.5

Les ias ont été utilisées pour :

- Générer des idées de cartes et de factions : On envoit le site avec donnes a ChatGPT avec le modele a suivre (
  datastructure), et on lui demande depuis la page de crawl et de recuperer les infos des cartes.
- Fix les differents problemes de configuration typescript, scss, open-api ...