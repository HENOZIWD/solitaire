import { useState } from 'react';
import styles from '../styles/Card.module.css';

interface ICardProps {
  boardWidth: number;
  boardHeight: number;
}

const Card = (props: ICardProps) => {

  const baseFontSizeString = getComputedStyle(document.documentElement).getPropertyValue('font-size');
  const baseFontSize = +baseFontSizeString.slice(0, baseFontSizeString.indexOf('px'));
  const cardWidth = baseFontSize * 5;
  const cardHeight = baseFontSize * 5;
  const gap = baseFontSize * 2;

  const [clicked, setClicked] = useState<boolean>(false);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  // useEffect(() => {
  //   console.log(cardWidth);
  // }, [])

  const mouseDown = (clickEvent: React.MouseEvent<HTMLDivElement>) => {
    clickEvent.preventDefault();
    
    const mouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - clickEvent.clientX;
      const deltaY = moveEvent.clientY - clickEvent.clientY;

      let nextX = position.x + deltaX;
      let nextY = position.y + deltaY;

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

      setPosition({
        x: nextX,
        y: nextY,
      });
    };

    const mouseUp = () => {
      setClicked(false);
      document.removeEventListener('mousemove', mouseMove);
    }

    setClicked(true);
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp, { once: true });
  };

  return (
    <>
    <div 
      className={styles.card}
      onMouseDown={mouseDown}
      style={{ 
        transform: `translateX(${position.x}px) translateY(${position.y}px) scale(${clicked ? 0.9 : 1})`,
        cursor: `${clicked ? 'grabbing' : 'grab'}`,
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
      }}
    />
    </>
  );
}

export default Card;