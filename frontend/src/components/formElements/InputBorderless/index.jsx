import React from 'react';
import { FormControl } from 'react-bootstrap';
import classNames from 'classnames';

import './styling.scss';

const InputBorderless = ({
  setValue, inputName = '', inputType = 'text', placeholder = 'Введите...', positioning = '', variant = 'light', inputRef,
}) => {
  const boxClasses = classNames(
    'borderless-input-box',
    {
      'borderless-input-box--light': variant === 'light',
      'borderless-input-box--dark': variant === 'dark',
    },
    positioning,
  );

  const inputClasses = classNames(
    'input-borderless',
    {
      'input-borderless--light': variant === 'light',
      'input-borderless--dark': variant === 'dark',
    },
  );

  return (
    <div className={boxClasses}>
      <FormControl
        id={inputName}
        type={inputType}
        name={inputName}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        bsPrefix={inputClasses}
        ref={inputRef}
      />
    </div>
  );
};

export default InputBorderless;
