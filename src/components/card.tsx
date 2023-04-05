import { forwardRef } from 'react';
import styles from '../styles/Card.module.css';

interface ICardProps {
  cardIndex: number;
  suit: string;
  rank: string;
  x: number;
  y: number;
  onMouseDown: (mouseDownEvent: React.MouseEvent) => void;
  isClicked: boolean;
  status: string;
}

const Card = forwardRef<HTMLDivElement, ICardProps>((props: ICardProps, ref) => {

  return (
    <div
      className={styles.card}
      ref={ref}
      style={{ 
        transform: `translateX(${props.x}px) translateY(${props.y}px) scale(${props.isClicked ? 0.9 : 1})`,
        backgroundColor: `${props.status === 'open' ? 'white' : 'lightblue'}`,
        color: `${props.suit === 'Diamond' || props.suit === 'Heart' ? 'red' : 'black'}`
      }}
      onMouseDown={props.onMouseDown}
    >
      {props.status === 'open' && props.suit + ' ' + props.rank}
    </div>
  )
});


export default Card;