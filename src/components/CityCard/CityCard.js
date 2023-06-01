import React from 'react';
import styles from './CityCard.module.scss';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import { BsThreeDotsVertical } from "react-icons/bs";
import dayjs from 'dayjs';
import { animations } from "../../config/constants";
import PopupMenu from '../PopupMenu/PopupMenu';

export default function CityCard({ data, onDelete }) {

  const animation = data && animations.find((animation) =>
    String(data?.weatherInfo?.current?.weather?.[0]?.id).startsWith(animation.id)
  )?.url;

  return (
    <div className={styles.infoCityCard}>
      <div className={styles.header}>
        <p className={styles.cityName}>{data?.label}</p>
        <div className={styles.temperatureGroup}>
          <p>{Math.round(data?.weatherInfo?.current?.temp)}<sup>ºC</sup></p>
          <Player
            src={animation}
            autoplay
            loop
            renderer="svg"
            background="transparent"
            controls={false}
            style={{ height: '50px', width: '50px' }}
            speed={2}
          />
        </div>
        <PopupMenu
          position='bottom-right'
          renderChildren={(setVisible => <div className={styles.deleteWidgetIcon}
            onClick={() => {
              setVisible({ show: false, top: 0, left: 0 });
              onDelete?.(data);
            }}>Delete Widget</div>)}
          renderToggle={<BsThreeDotsVertical />}
        />
        {/* <p>{data?.weatherInfo?.current?.weather?.[0]?.main}</p> */}
      </div>
      <div className={styles.dayWeather}>
        {data?.weatherInfo?.daily?.slice(0, 7)?.map((el, idx) => {
          const aniDay = el && animations.find((animation) =>
            String(el?.weather?.[0]?.id).startsWith(animation.id)
          )?.url;
          return (
            <div key={idx}>
              <div className={styles.weekday}>
                <p>{dayjs.unix(el?.dt).format('dd')}</p>
                <Player
                  src={aniDay}
                  autoplay
                  loop
                  renderer="svg"
                  background="transparent"
                  controls={false}
                  style={{ height: '40px', width: '40px' }}
                  speed={2}
                />
                <div className={styles.degree}><span>{Math.round(el?.temp?.day)}º</span></div>
              </div>
            </div>);
        })}
      </div>
    </div >
  );
}
