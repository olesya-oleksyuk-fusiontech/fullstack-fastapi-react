import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import InputBorderless from '../formElements/InputBorderless';
import ButtonCandyPrimary from '../buttons/ButtonCandyPrimary';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const history = useHistory();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push('/');
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <InputBorderless
        setValue={setKeyword}
        inputName="product"
        dark
        placeholder="Поиск товара..."
        positioning="me-lg-3 ms-lg-3 me-3"
        variant="dark"
      />
      <ButtonCandyPrimary type="submit" variant="dark">Поиск</ButtonCandyPrimary>
    </Form>
  );
};

export default SearchBox;
