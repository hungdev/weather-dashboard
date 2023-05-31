import React from 'react';
import styles from './SunCard.module.scss';

export default function SunCard({ sunrise, sunset }) {
  return (
    <div className={styles.infoCardContainer}>
      <p className={styles.title}>Sunrise and Sunset</p>
      <div className={styles.sunInfo}>
        <img src={'/today/sunrise.png'} className={styles.icon} />
        <span>{sunrise}</span>
      </div>
      <div className={styles.sunInfo}>
        <img src={'/today/sunset.png'} className={styles.icon} />
        <p>{sunset}</p>
      </div>
    </div>
  );
}
