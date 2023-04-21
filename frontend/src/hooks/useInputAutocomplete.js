import { useEffect } from 'react';

// to set input's 'autocomplete' attribute
const useInputAutocomplete = (elementRef, autocompleteValue = 'off') => {
  useEffect(() => {
    elementRef?.current && elementRef.current.setAttribute('autocomplete', autocompleteValue);
  });
};

export default useInputAutocomplete;
