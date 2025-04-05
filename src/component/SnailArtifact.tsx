import { useEffect } from 'react';
import escargot from '../assets/artifact/escargot.svg';
import {useNow} from "./EventComponent.tsx";

export const SnailTimer = (props: { deadlineMillis: number | undefined, reset: () => void }) => {
  const now = useNow();

  const timeRemaining = props.deadlineMillis !== undefined
      ? Math.floor((props.deadlineMillis - now) / 1000)
      : undefined;

  const seconds = timeRemaining !== undefined
      ? Math.abs(timeRemaining) % 60
      : 0;

  console.log("timeremaining",timeRemaining);
console.log("seconds", seconds);
  useEffect(() => {
    if (timeRemaining !== undefined && timeRemaining <= 0 ) {
      props.reset();
    }
  }, [timeRemaining, props]);


  return props.deadlineMillis === undefined ? null : (
      <div className="snail-timer">
        <img src={escargot} alt="Escargot" className="snail-timer-icon" />
        <span className="manjari">{seconds}s</span>
      </div>
  );
};
