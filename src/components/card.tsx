import React, { useEffect, useState } from 'react';
import styles from '../styles/Card.module.css';
import { ICardPosition } from './App';

interface ICardProps {
  cardIndex: number;
  pos: ICardPosition;
  realPos: ICardPosition;
  boardWidth: number;
  boardHeight: number;
  cardWidth: number;
  cardHeight: number;
  movePosition: (i: number, newPos: ICardPosition) => void;
  moveRealPosition: (i: number, newPos: ICardPosition) => void;
  checkCardBoundary: (i: number, pos: ICardPosition) => { newPos: ICardPosition, isStacked: boolean, stackIdx: number };
  stackCard: (a: number, b: number) => void;
}

const Card = (props: ICardProps) => {

  const [clicked, setClicked] = useState<boolean>(false);

  useEffect(() => {
    if (!clicked) {
      const moveResult = props.checkCardBoundary(props.cardIndex, props.pos);
      if (moveResult.isStacked) {
        props.stackCard(moveResult.stackIdx, props.cardIndex);
        props.moveRealPosition(props.cardIndex, moveResult.newPos);
      }
      else {
        props.movePosition(props.cardIndex, props.realPos);
      }
    }
  }, [clicked])

  const mouseDown = (clickEvent: React.MouseEvent<HTMLDivElement>) => {
    clickEvent.preventDefault();
    
    const mouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - clickEvent.clientX;
      const deltaY = moveEvent.clientY - clickEvent.clientY;

      props.movePosition(props.cardIndex,{ x: props.pos.x + deltaX, y: props.pos.y + deltaY });
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
        transform: `translateX(${props.pos.x}px) translateY(${props.pos.y}px) scale(${clicked ? 0.9 : 1})`,
        width: `${props.cardWidth}px`,
        height: `${props.cardHeight}px`,
      }}
    >
      {props.cardIndex + 1}
    </div>
    </>
  );
}

export default Card;