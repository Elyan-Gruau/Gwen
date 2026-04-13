import { useEffect, useState } from 'react';
import { useGetFavoriteDeck, useSetFavoriteDeck } from 'gwen-generated-api';
import Checkbox from '../../reusable/checkbox/Checkbox';

interface FavoriteDeckToggleProps {
  userId: string | undefined;
  factionName: string;
}

export default function FavoriteDeckToggle({ userId, factionName }: FavoriteDeckToggleProps) {
  const [isFavoriteDeck, setIsFavoriteDeck] = useState(false);

  const { data: favoriteDeckData, refetch } = useGetFavoriteDeck(userId || '', {
    query: {
      enabled: !!userId,
      staleTime: 0,
    },
  });

  useEffect(() => {
    if (favoriteDeckData?.favorite_deck !== undefined) {
      setIsFavoriteDeck(favoriteDeckData.favorite_deck === factionName);
    }
    // Refetch to get fresh data when faction changes
    refetch();
  }, [factionName, refetch, favoriteDeckData?.favorite_deck]);

  // Set favorite deck mutation
  const { mutate: setFavoriteDeck, isPending: isUpdatingFavorite } = useSetFavoriteDeck();

  const handleFavoriteToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userId) return;

    const newIsFavorite = e.target.checked;
    setIsFavoriteDeck(newIsFavorite);

    setFavoriteDeck({
      userId,
      data: {
        factionId: newIsFavorite ? factionName : null,
      },
    });
  };

  return (
    <Checkbox
      label="Mark as favorite"
      checked={isFavoriteDeck}
      onChange={handleFavoriteToggle}
      disabled={isUpdatingFavorite}
      variant="success"
    />
  );
}
