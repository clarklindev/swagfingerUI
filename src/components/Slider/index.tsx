import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

type SliderProps = {
  width: string;
  hideTrack: boolean;
  trackClickable: boolean;
  min: number;
  max: number;
  step: number;
  index: number;
  thumbSize: string;
  backgroundColor: string;
  savedData: number;
  offset: number;
  className: string;
  onChange: (value: number, index: number) => void;
};

export const Slider: React.FC<SliderProps> = ({
  width = '100%',
  hideTrack = false,
  trackClickable = true,
  min = 0,
  max = 100,
  step = 1,
  index = 0,
  thumbSize = '16px',
  backgroundColor = 'red',
  savedData = 0,
  offset = 0,
  onChange,
  className,
}) => {
  const [sliderValue, setSliderValue] = useState(0);
  useEffect(() => {
    setSliderValue(savedData);
  }, []);

  const onChangeHandler = (value: string, index: number) => {
    onChange(parseInt(value), index);
    setSliderValue(parseInt(value));
  };

  return (
    <SliderContainer width={width} offset={offset} className={['Slider', className].join(' ')}>
      <SliderWrapper>
        <SliderTrack hideTrack={hideTrack} backgroundColor={backgroundColor} />
        <SliderColor color="red" splitPosition={sliderValue}>
          <div />
          <div />
        </SliderColor>
        <SliderInput
          type="range"
          trackClickable={trackClickable}
          thumbSize={thumbSize}
          min={min}
          max={max}
          step={step}
          value={savedData}
          onChange={event => onChangeHandler(event.target.value, index)}
        />
      </SliderWrapper>
    </SliderContainer>
  );
};

// ------------------------------------------------------------------------------------------------------------------------------------------------

const SliderContainer = styled.div<{ width: string; offset: number }>`
  box-sizing: border-box;
  width: ${({ width }) => width};
  margin-left: ${({ offset }) => offset};
`;

const SliderWrapper = styled.div`
  width: 100%;
  background: red;
  position: relative;
`;

//you want to show the SliderTrack if there is only one slider
//TODO: use backgroundColor
const SliderTrack = styled.div<{ hideTrack: boolean; backgroundColor: string }>`
  border-radius: 0px;
  height: 1px;
  width: 100%;
  top: 7px;
  position: absolute;
  display: ${({ hideTrack }) => (hideTrack ? 'none' : 'block')};
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

// TODO: use splitPosition to give background color (think using gradient)
const SliderColor = styled.div<{ splitPosition: number }>`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  > div {
    background-color: pink;
  }
`;

const SliderInput = styled.input.attrs<{
  index?: number; // Declare the index prop
}>(props => ({
  index: props.index || 0,
  type: 'range',
}))<{ trackClickable: boolean; thumbSize: string }>`
  /* Add styles for the input element */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  pointer-events: ${({ trackClickable }) => (trackClickable ? 'auto' : 'none')};
  position: absolute;
  top: 0;
  width: 100%;
  border-radius: 2px;
  outline: none;
  background: transparent; //the actual clickable part of scrolltrack
  display: flex;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: ${({ thumbSize }) => thumbSize};
    height: ${({ thumbSize }) => thumbSize};
    background: #666;
    border-radius: 50%;
    cursor: pointer;
    pointer-events: auto;
  }
`;
