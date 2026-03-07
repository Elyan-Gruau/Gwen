const RedrawPhase = () => {
  const maxRedraws = 2;
  const redrawsUsed = 0;
  return (
    <div>
      <span>
        Choose a card to redraw {redrawsUsed}/{maxRedraws}
      </span>
    </div>
  );
};

export default RedrawPhase;
