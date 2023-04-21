import React, { useState } from 'react';
import NoProduct from '../../../svg/noProduct';
import useBreakpoints from '../../../hooks/useBreakpoints';

import {
  aqua, gray400, gray700, orange, yellow,
} from '../../../styles/colors.module.scss';
import '../style.scss';

const NoFoundProduct = ({ parentBlock = '' }) => {
  const [isHover, setIsHover] = useState(false);

  const viewport = useBreakpoints(window);

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const logoStyle = {
    height: '200',
    width: '200',
    mainColor: isHover ? orange : yellow,
    strokeColor: isHover ? gray700 : gray400,
    minorColor: aqua,
  };

  return (
    <div className="no-found">
      <div className={`no-found-main ${parentBlock ? `${parentBlock}__no-found-main` : ''}`}>
        <div
          className="no-found-logo"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <NoProduct logoStyle={logoStyle} />
        </div>
        <p className="no-found-header">Упс! Товар не найден... </p>
      </div>
      <p className={`no-found__text ${parentBlock ? `${parentBlock}__no-found__text` : ''}`}>
        Нам жаль, что
        {' '}
        {viewport !== 'xs' && <br />}
        мы не смогли найти товары по вашему запросу
      </p>
    </div>
  );
};

export default NoFoundProduct;
