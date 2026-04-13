import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import DeckBuilder from '../../components/deck-builder/deck-builder/DeckBuilder';
import Button from '../../components/reusable/button/Button';
import { ROUTES } from '../../constants/routes';
import styles from './DeckSelectionPage.module.scss';

interface DeckSelectionPageProps {
  onDeckSelected?: () => void;
}

const DeckSelectionPage = ({ onDeckSelected }: DeckSelectionPageProps) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [canPlayWithDeck, setCanPlayWithDeck] = useState(false);

  if (!user) {
    navigate(ROUTES.LOGIN);
    return null;
  }

  const handlePlayWithThisDeck = () => {
    if (onDeckSelected) {
      onDeckSelected();
    }
    navigate(ROUTES.MATCHMAKING);
  };

  return (
    <div className={styles.deckSelectionContainer}>
      <div className={styles.deckBuilderWrapper}>
        <DeckBuilder onDeckValidityChange={setCanPlayWithDeck} />
      </div>

      <div className={styles.playButtonContainer}>
        <Button
          onClick={handlePlayWithThisDeck}
          disabled={!canPlayWithDeck}
          variant={canPlayWithDeck ? 'success' : 'ghost'}
          size="lg"
          fullWidth
          title={canPlayWithDeck ? 'Start playing with this deck' : 'Your deck is not valid yet'}
        >
          Play with this deck
        </Button>
        {!canPlayWithDeck && (
          <p className={styles.validationMessage}>
            Make sure your deck has a leader, at least 25 units, and maximum 10 specials.
          </p>
        )}
      </div>
    </div>
  );
};

export default DeckSelectionPage;
