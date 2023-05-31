import React from 'react';
import styles from './InfoCard.module.scss';

export default function InfoCard({ title, iconPath, evaluate, value, unit, iconClass }) {
  return (
    <div className={styles.infoCardContainer}>
      <p className={styles.title}>{title}</p>
      <p><span className={styles.txtValue}>{value}</span> <span>{unit}</span></p>
      <div className={styles.rowEvaluate}>
        <img src={iconPath} className={`${styles.icon} ${iconClass}`} />
        <span>{evaluate}</span>
      </div>
    </div>
  );
}
