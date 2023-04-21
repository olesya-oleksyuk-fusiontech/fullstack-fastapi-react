import React from 'react';
import { useHistory } from 'react-router-dom';

import femaleFaceImg from '../../assets/cartoon-female-face.png';
import CandyShopLargeLogo from '../../svg/candyShopLargeLogo';

import ButtonWelcome from '../../components/buttons/ButtonWelcome';
import './style.scss';

const Welcome = () => {
  const history = useHistory();

  return (
    <div className="no-scroll-wrapper">
      <div className="start-page">
        <div className="content">
          <div className="content__large-logo"><CandyShopLargeLogo /></div>
          <div className="content__moto">закажи сладости!</div>
          <div className="content__text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor!
          </div>
          <div className="content__row">
            <ButtonWelcome className="content__button" onClick={() => history.push('/home')}>каталог</ButtonWelcome>
            <ButtonWelcome className="content__button" onClick={() => history.push('/login')}>заказать</ButtonWelcome>
          </div>
        </div>
        <div className="logo">
          <div className="logo__wrapper">
            <img className="logo__pic" src={femaleFaceImg} alt="Логотип магазина девушка в стиле поп-арт" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
