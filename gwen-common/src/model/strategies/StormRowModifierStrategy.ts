import {RowModifierStrategy} from "../../ModifierStrategy";
import type {CharacterCard} from "../../types/CharacterCard";
import type {Row} from "../../types/Row";


export class StormRowModifierStrategy extends RowModifierStrategy {

    updateCardPower(card: CharacterCard, row: Row): number {
        return 1;
    }

}