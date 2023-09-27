import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
// import { Dimensions } from '../Dimensions';

type ResizePanelProps = {
  style?: React.CSSProperties;
  children?: React.ReactNode;
  className?: string;
  minWidth?: string;
};

export const ResizePanel: React.FC<ResizePanelProps> = ({ style, children, className, minWidth = '300px' }) => {
  const [resizing, setResizing] = useState(false);
  const [width, setWidth] = useState<number | undefined>(); // Initial width
  const [maxWidth, setMaxWidth] = useState<number | undefined>();
  const initialX = useRef<number | null>(null);
  const componentRef = useRef<HTMLDivElement | null>(null);
  const childComponentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (componentRef?.current) {
      setWidth(componentRef.current.clientWidth);
      setMaxWidth(componentRef.current.clientWidth);
    }

    // Handle window resize event
    const handleResize = () => {
      const parentNode = componentRef?.current?.parentNode as HTMLElement;
      if (parentNode) {
        //this needs to be here for resize
        const maxWidth = parentNode.clientWidth;
        const computedStyles = getComputedStyle(parentNode);
        const paddingLeft = parseFloat(computedStyles.paddingLeft);
        const paddingRight = parseFloat(computedStyles.paddingRight);
        const newMax = maxWidth - paddingLeft - paddingRight;
        setMaxWidth(newMax);
        setWidth(newMax);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setResizing(true);
    initialX.current = e.clientX;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (resizing && componentRef.current && maxWidth && childComponentsRef.current) {
      const deltaX = (initialX?.current ?? 0) - e.clientX;
      setWidth(prev =>
        prev === null || prev === undefined ? 0 : Math.max(parseInt(minWidth), Math.min(prev - deltaX, maxWidth)),
      );
      initialX.current = e.clientX;
    }
  };

  const handleMouseUp = () => {
    if (resizing) {
      setResizing(false);
    }
  };

  React.useEffect(() => {
    if (resizing) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      // Cleanup event listeners when the component unmounts
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing]);

  return (
    // width passed here is the state
    <ResizePanelWrapper style={{ ...style, width }} ref={componentRef}>
      {/* <Dimensions value={width && width > 0 , padding? width : 0} /> */}
      <Handle onMouseDown={handleMouseDown} />
      <ChildContainer className={className} ref={childComponentsRef}>
        {children}
      </ChildContainer>
    </ResizePanelWrapper>
  );
};
// ------------------------------------------------------------------------------------------------------------------------------------------------
// Styled-component warning: for frequently used attributes, use this syntax:

// Example:
//   const Component = styled.div.attrs(props => ({
//     style: {
//       background: props.background,
//     },
//   }))`width: 100%;`

const ResizePanelWrapper = styled.div.attrs<{ style: React.CSSProperties }>(props => ({
  style: {
    width: props?.style?.width,
    padding: props?.style?.padding || '2rem',
  },
}))`
  height: 100%;
  background: white;
  border: var(--border);
  border-radius: 4px;
  position: relative;
  max-width: 100%;
  justify-content: center;
`;

const ChildContainer = styled.div`
  gap: 1rem;
  display: flex;
  flex-direction: column;
`;

const Handle = styled.span`
  position: absolute;
  right: 0;
  top: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: rgba(255, 0, 0, 0.8);
  cursor: ew-resize;

  &:after {
    content: '';
    right: -10px;
    position: absolute;
    height: 30px;
    width: 5px;
    border-radius: 5px;
    background: hsla(200, 0%, 0%, 0.4);
  }
`;
