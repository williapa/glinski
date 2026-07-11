import { useLayoutEffect } from 'react';

const LOCK_CLASS = 'page-scroll-locked';
const SCROLLABLE_SELECTOR = '[data-scroll-lock-scrollable]';

const usePageScrollLock = (locked) => {
  useLayoutEffect(() => {
    if (!locked) return undefined;

    const preventPageTouchMove = (event) => {
      if (event.target.closest?.(SCROLLABLE_SELECTOR)) return;
      event.preventDefault();
    };

    document.documentElement.classList.add(LOCK_CLASS);
    document.body.classList.add(LOCK_CLASS);
    document.addEventListener('touchmove', preventPageTouchMove, { passive: false });

    return () => {
      document.documentElement.classList.remove(LOCK_CLASS);
      document.body.classList.remove(LOCK_CLASS);
      document.removeEventListener('touchmove', preventPageTouchMove);
    };
  }, [locked]);
};

export default usePageScrollLock;
