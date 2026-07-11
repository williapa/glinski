import { useEffect, useState } from 'react';
import usePageScrollLock from './usePageScrollLock';

const PAGE_SIZE_THRESHOLDS = [
  [1924, 1255],
  [1441, 875],
  [1141, 762],
  [911, 699],
  [767, 574],
  [600, 792],
  [10, 680],
];

const shouldLockPageScroll = () => {
  const { clientHeight, clientWidth } = document.documentElement;
  let sizeIndex = 0;

  while (
    clientWidth < PAGE_SIZE_THRESHOLDS[sizeIndex][0]
    && sizeIndex < PAGE_SIZE_THRESHOLDS.length - 1
  ) {
    sizeIndex++;
  }

  return clientHeight >= PAGE_SIZE_THRESHOLDS[sizeIndex][1];
};

const useResponsivePageScrollLock = () => {
  const [locked, setLocked] = useState(shouldLockPageScroll);

  usePageScrollLock(locked);

  useEffect(() => {
    const handleResize = () => setLocked(shouldLockPageScroll());

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);
};

export { PAGE_SIZE_THRESHOLDS, shouldLockPageScroll };
export default useResponsivePageScrollLock;
