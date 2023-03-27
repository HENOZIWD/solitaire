import { useState } from 'react';
import styles from '../styles/Card.module.css';

const Card = () => {

  const [clicked, setClicked] = useState<boolean>(false);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  const mouseDown = (clickEvent: React.MouseEvent<HTMLDivElement>) => {
    clickEvent.preventDefault();
    
    const mouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - clickEvent.clientX;
      const deltaY = moveEvent.clientY - clickEvent.clientY;

      setPosition({
        x: position.x + deltaX,
        y: position.y + deltaY,
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
      }}
    />
    </>
  );
}

export default Card;