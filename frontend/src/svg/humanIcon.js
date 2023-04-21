import React from 'react';

const HumanIcon = ({ colors = {}, strokeColor = 'black', size = {} }) => {
  const { circle = 'transparent', body = '#000000', head = '#000000' } = colors;
  const { width = '100', height = '100' } = size;

  return (
    <svg width={width} height={height} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="none" strokeWidth="5">
      {/* Circle */}
      <path fill={circle} stroke={strokeColor} strokeWidth="4" d="M97.9674 50C97.9674 76.0715 76.5193 97.2561 50 97.2561C23.4806 97.2561 2.03247 76.0715 2.03247 50C2.03247 23.9284 23.4806 2.7439 50 2.7439C76.5193 2.7439 97.9674 23.9284 97.9674 50Z" />
      {/* Body */}
      <path fill={body} fillRule="evenodd" clipRule="evenodd" d="M90.6502 86.4837C90.6504 86.4498 90.6504 86.4161 90.6504 86.3821C90.6504 68.1411 72.4506 53.3537 50 53.3537C27.5494 53.3537 9.34961 68.1411 9.34961 86.3821C9.34961 86.4161 9.34967 86.4498 9.34979 86.4837H90.6502Z" />
      {/* Head */}
      <path fill={head} d="M50 48.6788C61.2253 48.6788 70.3252 39.5789 70.3252 28.3536C70.3252 17.1283 61.2253 8.02844 50 8.02844C38.7747 8.02844 29.6748 17.1283 29.6748 28.3536C29.6748 39.5789 38.7747 48.6788 50 48.6788Z" />
    </svg>
  );
};

export default HumanIcon;
