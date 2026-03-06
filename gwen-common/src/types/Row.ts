import type {CharacterCard} from './CharacterCard'
import type {RowModifierCard} from './RowModifierCard'
import type {RangeType} from "./RangeType";

export class Row {

    private readonly range: RangeType;
    private readonly cards: CharacterCard[]
    private modifierCard: RowModifierCard | undefined
    private score: number;

    constructor(range: RangeType) {
        this.range = range;
        this.cards = [];
        this.modifierCard = undefined;
        this.score = 0;
    }

    public setModifierCard(modifierCard: RowModifierCard) {
        this.modifierCard = modifierCard
        this.modifierCard.affectRow(this)
    }

    public addCard(card: CharacterCard) {
        this.cards.push(card)
    }

    public findCardById(id: string): CharacterCard {
        const maybeCard = this.cards.find(card => card.getId() === id);
        if (!maybeCard) {
            throw new Error(`Card with id ${id} not found in row`)
        }
        return maybeCard
    }

    public flush() {
        this.cards.slice(0, 0);
        this.modifierCard = undefined;
    }

    updateScore(): number {
        let total = 0;
        this.cards.forEach((c) => c.getPower());
        this.score = total;
        return total;
    }

    getScore(): number {
        return this.score;
    }

    getCards(): CharacterCard[] {
        return this.cards
    }

    getRange() {
        return this.range;
    }
}
