import { useEffect, useState } from 'react';

const useBreakpoints = (window) => {
  const getCurrentBreakpoint = (width) => {
    if (width >= 1200) return 'xl';
    if (width >= 992) return 'lg';
    if (width >= 768) return 'md';
    if (width >= 576) return 'sm';
    return 'xs';
  };

  const [viewport, setViewport] = useState(getCurrentBreakpoint(window.innerWidth));

  const updateMedia = () => {
    setViewport(getCurrentBreakpoint(window.innerWidth));
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });

  return viewport;
};

export default useBreakpoints;
