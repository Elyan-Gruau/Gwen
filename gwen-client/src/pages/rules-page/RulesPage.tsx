import styles from './RulesPage.module.scss';

type Section = {
  icon: string;
  title: string;
  content: React.ReactNode;
};

const sections: Section[] = [
  {
    icon: '🎯',
    title: 'Objective',
    content: (
      <p>
        Win <strong>2 rounds</strong> out of 3. Each player starts with <strong>2 gems</strong>. You
        lose a gem when you lose a round. The player who runs out of gems first loses the game.
      </p>
    ),
  },
  {
    icon: '🃏',
    title: 'Turn Structure',
    content: (
      <ul>
        <li>
          Players alternate turns. On your turn, you must either <strong>play a card</strong> or{' '}
          <strong>pass the round</strong>.
        </li>
        <li>
          If you do not act within <strong>30 seconds</strong>, your turn is automatically skipped.
        </li>
        <li>
          Once you pass, you cannot play any more cards that round. Your opponent may continue
          playing.
        </li>
        <li>
          A round ends when <strong>both players have passed</strong>.
        </li>
      </ul>
    ),
  },
  {
    icon: '📊',
    title: 'Scoring',
    content: (
      <ul>
        <li>
          Each unit card has a <strong>power value</strong>. The sum of all your cards on the board
          is your score.
        </li>
        <li>
          The player with the <strong>highest score</strong> at the end of a round wins it. The
          loser loses a gem.
        </li>
        <li>
          In case of a <strong>draw</strong>, both players lose a gem.
        </li>
      </ul>
    ),
  },
  {
    icon: '🗂️',
    title: 'Card Types',
    content: (
      <ul>
        <li>
          <strong>Unit cards</strong> — Placed on a row (Melee, Ranged or Siege). Each has a power
          value.
        </li>
        <li>
          <strong>Agile cards</strong> — Can be placed on either the Melee or Ranged row.
        </li>
        <li>
          <strong>Leader card</strong> — Each faction has a unique leader with a special ability.
        </li>
        <li>
          <strong>Neutral cards</strong> — Special cards with effects that work for any faction.
        </li>
      </ul>
    ),
  },
  {
    icon: '⚔️',
    title: 'Rows',
    content: (
      <ul>
        <li>
          <strong>Melee</strong> — Front row, for close-combat units.
        </li>
        <li>
          <strong>Ranged</strong> — Middle row, for archers and ranged units.
        </li>
        <li>
          <strong>Siege</strong> — Back row, for catapults and siege weapons.
        </li>
      </ul>
    ),
  },
  {
    icon: '🏰',
    title: 'Factions',
    content: (
      <ul>
        <li>
          <strong>Northern Realms</strong> — Balanced faction with solid unit cards.
        </li>
        <li>
          <strong>Nilfgaard</strong> — Tactical faction with control effects.
        </li>
        <li>
          <strong>Monsters</strong> — Aggressive faction with high-power units.
        </li>
        <li>
          <strong>Scoia'tael</strong> — Agile faction with flexible card placement.
        </li>
      </ul>
    ),
  },
  {
    icon: '🚩',
    title: 'Resign',
    content: (
      <p>
        You can <strong>resign</strong> at any time during a game. Resigning immediately ends the
        game and counts as a loss. Your ELO will be updated accordingly.
      </p>
    ),
  },
  {
    icon: '📈',
    title: 'ELO Rating',
    content: (
      <p>
        Winning or losing a game updates your <strong>ELO rating</strong>. Beating a higher-ranked
        opponent grants more ELO. Losing to a lower-ranked opponent costs more ELO.
      </p>
    ),
  },
];

const Ornament = () => (
  <svg
    className={styles.ornament}
    viewBox="0 0 200 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="0" y1="10" x2="80" y2="10" stroke="currentColor" strokeWidth="0.75" />
    <path
      d="M85 10 L90 4 L95 10 L100 4 L105 10 L110 4 L115 10"
      stroke="currentColor"
      strokeWidth="0.75"
      fill="none"
    />
    <line x1="120" y1="10" x2="200" y2="10" stroke="currentColor" strokeWidth="0.75" />
    <circle cx="100" cy="10" r="2" fill="currentColor" />
    <circle cx="85" cy="10" r="1.5" fill="currentColor" />
    <circle cx="115" cy="10" r="1.5" fill="currentColor" />
  </svg>
);

const CornerDecor = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => (
  <svg
    className={`${styles.corner} ${styles[`corner--${position}`]}`}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M2 22 L2 6 Q2 2 6 2 L22 2" stroke="currentColor" strokeWidth="1" fill="none" />
    <circle cx="2" cy="22" r="1.5" fill="currentColor" />
    <circle cx="22" cy="2" r="1.5" fill="currentColor" />
    <circle cx="6" cy="6" r="1" fill="currentColor" />
  </svg>
);

const RulesPage = () => (
  <div className={styles.rulesPage}>
    <div className={styles.heroWrap}>
      <h1 className={styles.pageTitle}>
        <span className={styles.titleLine}>How to</span>
        <span className={styles.titleLine + ' ' + styles.titleAccent}>Play</span>
      </h1>
      <Ornament />
      <p className={styles.intro}>
        Gwen is a turn-based card game inspired by Gwent from The Witcher universe.
      </p>
    </div>

    <div className={styles.sections}>
      {sections.map((section, i) => (
        <section
          key={section.title}
          className={styles.section}
          style={{ '--delay': `${i * 0.06}s` } as React.CSSProperties}
        >
          <CornerDecor position="tl" />
          <CornerDecor position="tr" />
          <CornerDecor position="bl" />
          <CornerDecor position="br" />
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>{section.icon}</span>
              {section.title}
            </h2>
            <div className={styles.sectionContent}>{section.content}</div>
          </div>
        </section>
      ))}
    </div>

    <footer className={styles.footer}>
      <Ornament />
      <p>Good luck, Witcher.</p>
    </footer>
  </div>
);

export default RulesPage;
