import React from 'react';
import classNames from 'classnames';

import './style.scss';

const ButtonCandyPrimary = ({
  type = 'button', variant = 'light', className, fullWidth = false, disabled = false, onClick, children,
}) => {
  const classes = classNames(
    'btn-candy-primary',
    {
      'btn-candy-primary--light': variant === 'light',
      'btn-candy-primary--dark': variant === 'dark',
      'full-width': fullWidth,
    },
    className,
  );

  return (

    <button
      // eslint-disable-next-line react/button-has-type
      type={type || 'button'}
      disabled={disabled}
      className={classes}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonCandyPrimary;
