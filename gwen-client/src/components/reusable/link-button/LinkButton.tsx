import { useNavigate } from 'react-router-dom';
import Button, { type ButtonProps } from '../button/Button';
import type { MouseEvent } from 'react';

export interface LinkButtonProps extends ButtonProps {
  href: string;
}

const LinkButton = ({ href, onClick, ...props }: LinkButtonProps) => {
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    navigate(href);
    onClick?.(e);
  };

  return <Button {...props} onClick={handleClick} />;
};

export default LinkButton;
