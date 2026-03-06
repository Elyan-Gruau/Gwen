import type {CharacterCard} from './CharacterCard'
import type {RowModifierCard} from './RowModifierCard'
import type {RangeType} from "./RangeType";

export class Row {

    private readonly range: RangeType;
    private readonly cards: CharacterCard[]
    private modifierCard: RowModifierCard | undefined

    constructor(range: RangeType) {
        this.range = range;
        this.cards = [];
        this.modifierCard = undefined;
    }

    public setModifierCard(modifierCard: RowModifierCard) {
        this.modifierCard = modifierCard
        this.modifierCard.affectRow(this)
    }

    public addCard(card: CharacterCard) {
        this.cards.push(card)
    }

    public getCards(): CharacterCard[] {
        return this.cards
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

    getScore(): number {
        let total = 0;
        this.cards.forEach((c) => c.getPower());
        return total;
    }
}
