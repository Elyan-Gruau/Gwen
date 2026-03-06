import type {CharacterCard} from '../types/CharacterCard.js'

export class Player {
    private readonly id: string
    private hands: CharacterCard[]
    private deadCards: CharacterCard[]
    private pioche: CharacterCard[]

    constructor(id: string) {
        this.id = id
        this.hands = []
        this.deadCards = []
        this.pioche = []
    }

    getId(): string {
        return this.id
    }
}