import React from 'react';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import styles from './DayCard.module.scss';
import { animations } from "../../config/constants";

export default function DayCard({ data, isDisplayToday }) {

  const animation = data && animations.find((animation) =>
    String(data?.iconId).startsWith(animation.id)
  )?.url;

  return (
    <div className={styles.dayCardContainer}>
      <div>{data.weekday}</div>
      <Player
        src={animation}
        autoplay
        loop
        renderer="svg"
        background="transparent"
        controls={false}
        style={{ height: '60px', width: '60px' }}
        speed={2}
      />
      {isDisplayToday ? <div className={styles.degree}><span>{data?.hourTemp}º</span></div>
        : <div className={styles.degree}><span>{data?.minTemp}º</span> <span className={styles.upTo}>{data?.maxTemp}º</span></div>}
    </div>
  );
}
