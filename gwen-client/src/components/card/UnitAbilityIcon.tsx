import type { UnitCardAbilityType } from 'gwen-common/src/types/UnitCardAbilityType';

const ABILITY_ICONS: Record<UnitCardAbilityType, string> = {
  AGILE: '/icons/agile.png',
  MEDIC: '/icons/medic.png',
  MORAL_BOOST: '/icons/morale_boost.png',
  MUSTER: '/icons/muster.png',
  SPY: '/icons/spy.png',
  TIGHT_BOND: '/icons/tight_bound.png',
  ROW_BOOST: '/icons/range.png', // à ajuster si besoin
  DECAY: '/icons/decoy.png', // à ajuster si besoin
  COMMANDER_HORN: '/icons/commander_horn.png',
  SCORCH: '/icons/scortch.png',
};

export type UnitAbilityIconProps = {
  ability: UnitCardAbilityType;
  size?: number | string; // ex: '2em' ou 32
  className?: string;
};

export default function UnitAbilityIcon({
  ability,
  size = '1.5em',
  className,
}: UnitAbilityIconProps) {
  const icon = ABILITY_ICONS[ability];
  if (!icon) return null;
  return (
    <span
      className={className}
      style={{
        display: 'grid',
        placeItems: 'center',
        width: size,
        height: size,
      }}
    >
      <img
        src={icon}
        alt={ability}
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
      />
    </span>
  );
}
