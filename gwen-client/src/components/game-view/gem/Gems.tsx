import Gem from './Gem';
import { INITIAL_GEMS } from 'gwen-common';

export type GemsProps = {
  activeCount: number;
};

const Gems = ({ activeCount }: GemsProps) => {
  return (
    <div className="gems">
      {Array.from({ length: activeCount }, (_, i) => (
        <Gem isActive={true} />
      ))}
      {Array.from({ length: INITIAL_GEMS - activeCount }, (_, i) => (
        <Gem isActive={true} />
      ))}
    </div>
  );
};

export default Gems;
