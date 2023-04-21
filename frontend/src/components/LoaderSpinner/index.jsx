import React from 'react';
import classNames from 'classnames';

import './style.scss';

const LoaderSpinner = ({
  pageCenter = false, center = false, stylingOptions = '', className = '',
}) => {
  const wrapperClasses = classNames(
    'loader-wrapper',
    {
      'loader-wrapper--center-page': pageCenter,
      'loader-wrapper--center': center,
    },
  );

  return (
    <div className={wrapperClasses}>
      <div className={`loader-spinner ${className}`} style={{ ...stylingOptions }} />
    </div>
  );
};

export default LoaderSpinner;
