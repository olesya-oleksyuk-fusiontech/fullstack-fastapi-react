import React from 'react';
import PropTypes from 'prop-types';

import { COLOR, RATING_TYPE, STAR_TYPE } from './constants';

const Rating = ({
  ratingValue, reviewsNumber = 0, noReviewsNumber, starColor, ratingType,
}) => {
  const getStar = (starIndex, key) => {
    const { FULL, HALF, EMPTY } = STAR_TYPE;

    const starType = (index) => {
      if (ratingValue >= index) return FULL;
      if (ratingValue >= index - 0.5) return HALF;
      return EMPTY;
    };
    return (<i className={starType(starIndex)} style={{ color: starColor }} key={key} />);
  };

  const getRatingScale = (type) => [...Array(type)].map((_, i) => getStar(i + 1, i));

  return (
    <div className="rating">
      <span>
        { getRatingScale(ratingType) }
      </span>
      { !!reviewsNumber && (
        <div>
          Отзывов:&nbsp;
          {reviewsNumber}
        </div>
      )}
      { !reviewsNumber && !noReviewsNumber ? (
        <div>
          Отзывов нет
        </div>
      ) : <></> }
    </div>
  );
};

Rating.defaultProps = {
  starColor: COLOR.GOLD,
  ratingType: RATING_TYPE.FIVE_STARS,
  reviewsNumber: 0,
};

Rating.propTypes = {
  ratingValue: PropTypes.number.isRequired,
  reviewsNumber: PropTypes.number,
  starColor: PropTypes.oneOf((Object.values(COLOR))),
  ratingType: PropTypes.oneOf((Object.values(RATING_TYPE))),
};

export default Rating;
