import React from 'react';

const BG = {
  hero: '/images/bg-hero.jpg',
  trains: '/images/bg-trains.jpg',
  auth: '/images/bg-auth.jpg',
};

export const PageBackground = ({ variant = 'trains', children, className = '' }) => {
  const image = BG[variant] || BG.trains;
  const overlayClass =
    variant === 'auth'
      ? 'page-background__overlay page-background__overlay--auth'
      : variant === 'hero'
        ? 'page-background__overlay page-background__overlay--hero'
        : 'page-background__overlay';

  return (
    <div
      className={`page-background ${className}`}
      style={{ '--page-bg-image': `url(${image})` }}
    >
      <div className={overlayClass} />
      <div className="page-background__content relative z-10">{children}</div>
    </div>
  );
};

export default PageBackground;
