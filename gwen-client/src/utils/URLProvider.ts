const CURRENT_DATAPACK_NAME = 'the-witcher';

export const getGameURL = (gameId: string) => {
  return `/game/${gameId}`;
};

export const getProfilePictureUrl = () => {
  return `/data-packs/${CURRENT_DATAPACK_NAME}/profile-picture/default.png`;
};

export const getGameBackgroundPictureUrl = () => {
  return `/data-packs/${CURRENT_DATAPACK_NAME}/board/background.png`;
};

export const getGemPictureUrl = () => {
  return `/icons/gem_red.png`;
};

export const getGemBrokenPictureUrl = () => {
  return `/icons/gem_grey.png`;
};
