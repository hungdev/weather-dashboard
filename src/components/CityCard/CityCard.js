import React, { useRef } from 'react';
import { useDrag, useDrop } from "react-dnd";
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import styles from './CityCard.module.scss';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import { BsThreeDotsVertical } from "react-icons/bs";
import dayjs from 'dayjs';
import { animations } from "../../config/constants";

export default function CityCard({ data, onDelete, moveCard, index, id }) {
  const cityCardRef = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'CARD',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!cityCardRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = cityCardRef.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveCard?.(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(cityCardRef));

  const animation = data && animations.find((animation) =>
    String(data?.weatherInfo?.current?.weather?.[0]?.id).startsWith(animation.id)
  )?.url;

  return (
    <div ref={cityCardRef} className={styles.infoCityCard} style={{ opacity }} data-handler-id={handlerId}>
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
        <Menu menuButton={<MenuButton className={styles.btnVertical} ><BsThreeDotsVertical /></MenuButton>}
          align='end'
          transition>
          <MenuItem onClick={() => onDelete?.(data)}>Delete Widget</MenuItem>
        </Menu>
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
