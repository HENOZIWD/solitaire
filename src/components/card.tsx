import React, { useEffect, useState } from 'react';
import styles from '../styles/Card.module.css';

interface ICardProps {
  cardIndex: number;
  xPos: number;
  yPos: number;
  boardWidth: number;
  boardHeight: number;
  movePosition: (i: number, x: number, y: number) => void;
  pushStack: (i: number) => void;
  popStack: (i: number) => void;
}

const Card = (props: ICardProps) => {

  const baseFontSizeString = getComputedStyle(document.documentElement).getPropertyValue('font-size');
  const baseFontSize = +baseFontSizeString.slice(0, baseFontSizeString.indexOf('px'));
  const cardWidth = baseFontSize * 5;
  const cardHeight = baseFontSize * 5;
  const gap = baseFontSize * 2;

  const [clicked, setClicked] = useState<boolean>(false);

  useEffect(() => {
    if (!clicked && props.xPos === baseFontSize * 23 && props.yPos === baseFontSize * 11.5) {
      props.pushStack(props.cardIndex + 1);
    }
    else if (!clicked && !(props.xPos === baseFontSize * 23 && props.yPos === baseFontSize * 11.5)){
      props.popStack(props.cardIndex + 1);
    }
  }, [clicked]);

  const mouseDown = (clickEvent: React.MouseEvent<HTMLDivElement>) => {
    clickEvent.preventDefault();
    
    const mouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - clickEvent.clientX;
      const deltaY = moveEvent.clientY - clickEvent.clientY;

      let nextX = props.xPos + deltaX;
      let nextY = props.yPos + deltaY;

      if (nextX < 0 + gap) {
        nextX = 0 + gap / 4;
      }
      if (props.boardWidth - cardWidth - gap < nextX) {
        nextX = props.boardWidth - cardWidth - gap / 4;
      }

      if (nextY < 0 + gap) {
        nextY = 0 + gap / 4;
      }
      if (props.boardHeight - cardHeight - gap < nextY) {
        nextY = props.boardHeight - cardHeight - gap / 4;
      }

      if (baseFontSize * 22.5 - gap / 2 < nextX && nextX < baseFontSize * 22.5 + gap &&
          baseFontSize * 11 - gap / 2 < nextY && nextY < baseFontSize * 11 + gap) {
        nextX = baseFontSize * 23;
        nextY = baseFontSize * 11.5;
      }

      props.movePosition(props.cardIndex, nextX, nextY);
    }

    const mouseUp = () => {
      setClicked(false);
      document.removeEventListener('mousemove', mouseMove);
    }

    setClicked(true);
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp, { once: true });
  }

  return (
    <>
    <div 
      className={styles.card}
      onMouseDown={mouseDown}
      style={{ 
        transform: `translateX(${props.xPos}px) translateY(${props.yPos}px) scale(${clicked ? 0.9 : 1})`,
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
      }}
    >
      {props.cardIndex + 1}
    </div>
    </>
  );
}

export default Card;