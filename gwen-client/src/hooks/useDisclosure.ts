import { useCallback, useState } from 'react';

export type UseDisclosureResult = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  set: (value: boolean) => void;
};

export const useDisclosure = (initialState = false): UseDisclosureResult => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const set = useCallback((value: boolean) => {
    setIsOpen(value);
  }, []);

  return { isOpen, open, close, toggle, set };
};
