export type GemProps = {
  isActive: boolean;
};

const Gem = ({ isActive }: GemProps) => {
  const path = isActive ? '/assets/gem-active.png' : '/assets/gem-inactive.png';
  return (
    <div>
      <img
        src={path}
        alt="Gem"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );
};

export default Gem;
