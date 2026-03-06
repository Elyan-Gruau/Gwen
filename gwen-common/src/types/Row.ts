import type {CharacterCard} from './CharacterCard'
import type {RowModifierCard} from './RowModifierCard'

export class Row {

    private cards: CharacterCard[]
    private modifierCard: RowModifierCard | undefined

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
}
