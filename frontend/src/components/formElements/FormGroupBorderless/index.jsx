import React from 'react';
import { FormGroup } from 'react-bootstrap';
import classNames from 'classnames';

import InputBorderless from '../InputBorderless';
import './style.scss';

const FormGroupBorderless = (
  {
    controlId,
    inputValue = '',
    setInputValue,
    inputType = 'text',
    positioning = 'mt-4_5',
    inputPositioning = 'ms-3 pt-2',
    valueAsPlaceholder,
    variant = 'light',
    inputRef,
    blockClass = '',
    children,
  },
) => {
  const placeholder = valueAsPlaceholder ? inputValue : '';

  const formElementClass = blockClass ? `${blockClass}__form-group-borderless` : '';
  const labelElementClass = blockClass ? `${blockClass}__label-borderless` : '';

  const formClasses = classNames(
    'form-group-borderless',
    {
      'form-group-borderless--light': variant === 'light',
      'form-group-borderless--dark': variant === 'dark',
      used: inputValue,
    },
    positioning,
    formElementClass,
  );

  const labelClasses = classNames(
    'label-borderless',
    {
      'label-borderless--light': variant === 'light',
      'label-borderless--dark': variant === 'dark',
    },
    labelElementClass,
  );

  return (
    <FormGroup
      className={formClasses}
    >
      <label htmlFor={controlId} className={labelClasses}>{children}</label>
      <InputBorderless
        variant={variant}
        inputName={controlId}
        setValue={setInputValue}
        inputType={inputType}
        placeholder={placeholder}
        positioning={inputPositioning}
        inputRef={inputRef}
      />
    </FormGroup>
  );
};

export default FormGroupBorderless;
