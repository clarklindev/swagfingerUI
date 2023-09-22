import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Orientation } from '../../types/Orientation';

type SliderProps = {
  onChange: (value: number, index: number) => void;
  orientation?: Orientation | string;
  length?: string;
  offset?: string;
  thickness?: number;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  index?: number;
  thumbSize?: number;
  trackClickable?: boolean;
  hideTrack?: boolean;
  className?: string;

  //atleast one of below must be provided: "valueGradient" (precedence) OR "activeColor" and "trackColor"
  valueGradient?: string | undefined;
  activeColor?: string;
  trackColor?: string;
  style?: React.CSSProperties;
};

// ------------------------------------------------------------------------------------------------------------------------------------------------

export const Slider: React.FC<SliderProps> = ({
  onChange,
  orientation = Orientation.HORIZONTAL,
  length = '100%',
  offset = '0px',
  thickness = 15,
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  index = 0,
  thumbSize = 30,
  trackClickable = true,
  hideTrack = false,
  valueGradient = undefined,
  activeColor = 'red',
  trackColor = '#FF000055',
  className = index,
  style = {},
}) => {
  const myRef: React.Ref<HTMLDivElement> = useRef(null);

  const [computedHeight, setComputedHeight] = useState('0px');

  useEffect(() => {
    // Access and use the ref
    if (myRef.current !== null) {
      setComputedHeight(myRef.current?.clientHeight + 'px');
    }
  }, []);

  const onChangeHandler = (value: string, index: number) => {
    onChange(parseInt(value), index); //reads string from target, but passes number
  };

  return (
    <SliderContainer orientation={orientation} length={length} offset={offset} ref={myRef} style={style}>
      <SliderInput
        onChange={event => onChangeHandler(event.target.value, index)}
        orientation={orientation}
        thickness={thickness}
        value={value}
        min={min}
        max={max}
        step={step}
        thumbSize={thumbSize}
        trackClickable={trackClickable}
        hideTrack={hideTrack}
        computedHeight={computedHeight}
        background={
          valueGradient ||
          `linear-gradient(90deg, ${activeColor} 0%, ${activeColor} ${value}%, ${trackColor} ${value}%, ${trackColor} 100% )`
        }
        className={['Slider_', className].join(' ')}
      />
    </SliderContainer>
  );
};

// ------------------------------------------------------------------------------------------------------------------------------------------------

const SliderContainer = styled.div<{
  orientation: Orientation | string;
  offset: string;
  ref: React.Ref<any>;
  length: string;
}>`
  box-sizing: border-box;
  position: relative;

  ${({ orientation, offset, length }) =>
    orientation === Orientation.HORIZONTAL &&
    `
    width: ${length ? length : '100%'};
    margin-left: ${offset};
  `};

  ${({ orientation, offset, length }) =>
    orientation === Orientation.VERTICAL &&
    `
    height: ${length ? length : '100%'};
    margin-top: ${offset};
  `};
`;

const SliderInput = styled.input.attrs({
  type: 'range',
})<{
  index?: number;
  orientation: Orientation | string;
  trackClickable: boolean;
  computedHeight: string;
  thickness: number;
  background: string;
  thumbSize: number;
  hideTrack: boolean;
}>`
  position: absolute;
  

  ${({ orientation, thickness }) =>
    orientation === Orientation.HORIZONTAL &&
    `
    width: 100%;
    height: ${thickness}px;
  `};

  ${({ orientation, thickness, computedHeight }) =>
    orientation === Orientation.VERTICAL &&
    `
  height: ${thickness}px;
  width: ${computedHeight};  //width should now be height of container when vertical - use js to get height of container or use prop's length value 
  transform: rotate(-90deg) translateX(-100%); /* Rotate the scrollbar counterclockwise by 90 degrees */
  transform-origin: top left; /* Set the rotation origin to the top-left corner */
`};

  pointer-events: ${({ trackClickable }) => (trackClickable ? 'auto' : 'none')};
  border-radius: 10px;
  outline: none;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none; 

  //slider track
  ${({ hideTrack, background, thickness }) =>
    `
    background: ${hideTrack ? 'transparent' : background};
    height: ${thickness}px;
    border-radius: 10px;
    
    &::-moz-range-track{
      background: ${hideTrack ? 'transparent' : background};
      height: ${thickness}px;
      border-radius: 10px;
    }

    &::-webkit-slider-runnable-track {
      background: ${hideTrack ? 'transparent' : background};
      height: ${thickness}px;
      border-radius: 10px;
    }
    `};
 
  // slider thumb
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: ${({ thumbSize }) => thumbSize}px;
    height: ${({ thumbSize }) => thumbSize}px;
    background: #666;
    border: 1px solid red;
    border-radius: 50%;
    cursor: pointer;
    pointer-events: auto;
    transform: translateY(
      ${({ thumbSize, thickness }) =>
        `${thickness > thumbSize ? -0.5 * (thumbSize - thickness) : 0.5 * (thickness - thumbSize)}px`});

  &::-moz-range-thumb {
    width: ${({ thumbSize }) => thumbSize}px;
    height: ${({ thumbSize }) => thumbSize}px;
    background: #666;
    border: 1px solid red;
    border-radius: 50%;
    cursor: pointer;
    pointer-events: auto;
    transform: translateY(
      ${({ thumbSize, thickness }) =>
        `${thickness > thumbSize ? -0.5 * (thumbSize - thickness) : 0.5 * (thickness - thumbSize)}px`});
`;