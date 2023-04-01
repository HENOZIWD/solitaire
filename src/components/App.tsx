import React, { useState } from 'react';
import styles from '../styles/App.module.css';

interface ICardPosition {
  x: number;
  y: number;
}

const App = () => {

  const baseFontSizeString = getComputedStyle(document.documentElement).getPropertyValue('font-size');
  const baseFontSize = +baseFontSizeString.slice(0, baseFontSizeString.indexOf('px'));
  const cardWidth = baseFontSize * 5;
  const cardHeight = baseFontSize * 7;
  const [cardPositions, setCardPositions] = useState<ICardPosition[]>([
    { x: 100, y: 100 },
    { x: 200, y: 100 },
    { x: 300, y: 100 },
    { x: 400, y: 100 },
    { x: 500, y: 100 },
  ])

  return (
    <>
    <div
      className={styles.board}
    >
      {cardPositions.map((pos, i) => (
        <div
          key={i}
          className={styles.card}
          style={{ transform: `translateX(${pos.x}px) translateY(${pos.y}px)` }}
          onMouseDown={(mouseDownEvent) => {
            mouseDownEvent.preventDefault();
            mouseDownEvent.stopPropagation();

            const mouseMove = (mouseMoveEvent: MouseEvent) => {
              const newCardPos = cardPositions.slice();
              newCardPos[i] = { x: mouseMoveEvent.pageX - cardWidth / 2, y: mouseMoveEvent.pageY - cardHeight / 2 };
              setCardPositions(newCardPos);
            }

            const mouseUp = () => {
              document.removeEventListener('mousemove', mouseMove);
            }

            const newCardPos = cardPositions.slice();
            newCardPos[i] = { x: mouseDownEvent.pageX - cardWidth / 2, y: mouseDownEvent.pageY - cardHeight / 2 };
            setCardPositions(newCardPos);
            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp, { once: true });
          }}
        >
          {i + 1}
        </div>
      ))}
    </div>
    </>
  );
}

export default App;
