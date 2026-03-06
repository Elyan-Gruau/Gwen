import type {RangeType} from './RangeType'

export class CharacterCard {
    private readonly id: string;
    private readonly name: string
    private readonly basePower: number
    private readonly description: string
    private readonly isHero: boolean
    private readonly range: RangeType
    private readonly imageUrl: string

    private power: number

    constructor(config: CharacterCardConfig) {
        this.id = crypto.randomUUID()
        this.name = config.name
        this.power = config.power
        this.basePower = config.power
        this.description = config.description
        this.isHero = config.isHero
        this.range = config.range
        this.imageUrl = config.imageUrl
    }

    getName(): string {
        return this.name
    }

    getBasePower() {
        return this.basePower
    }

    getPower(): number {
        return this.power
    }

    setPower(newPower: number) {
        this.power = newPower
    }

    getDescription(): string {
        return this.description
    }

    getIsHero(): boolean {
        return this.isHero
    }

    getRange(): RangeType {
        return this.range
    }

    getImageUrl(): string {
        return this.imageUrl
    }

    getId(): string {
        return this.id
    }
}

export type CharacterCardConfig = {
    name: string
    power: number
    description: string
    isHero: boolean
    range: RangeType
    imageUrl: string
}
