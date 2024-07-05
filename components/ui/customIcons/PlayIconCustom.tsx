import { useState } from 'react';

export function PlayIconCustom() {
  const [strokeColor, setStrokColor] = useState('currentColor');

  return (
    <svg
      onMouseEnter={() => {
        setStrokColor('green');
      }}
      onMouseLeave={() => {
        setStrokColor('currentColor');
      }}
      className='cursor-pointer'
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke={strokeColor}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      //   class='lucide lucide-play'
    >
      <polygon points='6 3 20 12 6 21 6 3' />
    </svg>
  );
}
