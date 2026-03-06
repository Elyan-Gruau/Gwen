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

## Architecture

Un objet de config de base, ou est definis les factions, les cartes ...
Ainsi le jeu est modulaire et facilement extensible.

## Backend

- Websockets
- Authentication
