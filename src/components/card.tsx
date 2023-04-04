import { forwardRef } from 'react';
import styles from '../styles/Card.module.css';

interface ICardProps {
  cardIndex: number;
  x: number;
  y: number;
  onMouseDown: (mouseDownEvent: React.MouseEvent) => void;
  isClicked: boolean;
}

const Card = forwardRef<HTMLDivElement, ICardProps>((props: ICardProps, ref) => {
  return (
    <div
      className={styles.card}
      ref={ref}
      style={{ transform: `translateX(${props.x}px) translateY(${props.y}px) scale(${props.isClicked ? 0.9 : 1})` }}
      onMouseDown={props.onMouseDown}
    >
      {props.cardIndex + 1}
    </div>
  )
});


export default Card;