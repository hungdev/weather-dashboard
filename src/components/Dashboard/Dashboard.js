import React, { useEffect, useState, useCallback } from 'react';
import styles from './Dashboard.module.scss';
import Select from 'react-select';
import dayjs from 'dayjs';
import DayCard from '../DayCard/DayCard';
import InfoCard from '../InfoCard/InfoCard';
import CityCard from '../CityCard/CityCard';
import SunCard from '../SunCard/SunCard';
import { getGeo } from '.././../config/axiosConfig';

const timeRange = [
  { value: 3, label: `3 items` },
  { value: 5, label: `5 items` },
  { value: 7, label: `7 items` },
  { value: 8, label: `8 items` },
];

const timeRangeStyle = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 20
  }),
};
export default function Dashboard({ weatherInfo, cityList, onDeleteWidget, moveCard }) {
  const [location, setLocation] = useState('ha noi');
  // const [geo, setGeo] = useState(null);
  const [displayType, setDisplayType] = useState({ type: 'today', range: 8 });


  const isDisplayToday = displayType.type === 'today';

  const weatherOfDays = weatherInfo?.[isDisplayToday ? 'hourly' : 'daily']?.map(day => ({
    weekday: dayjs.unix(day?.dt).format(isDisplayToday ? 'h A' : 'ddd'),
    iconId: day?.weather?.[0]?.id,
    minTemp: Math.round(day?.temp?.min),
    maxTemp: Math.round(day?.temp?.max),
    hourTemp: Math.round(day?.temp)
  })).slice(0, displayType.range);

  const onSelectTimeRange = (range) => {
    setDisplayType(prev => ({ ...prev, range: range.value }));
  };

  const onChangeDisplayType = (type) => () => {
    setDisplayType(prev => ({ ...prev, type }));
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.displayRowTime}>
        <div className={styles.weekday}>
          <span className={`${styles.txtToday} ${isDisplayToday && styles.selectedWeekday}`} onClick={onChangeDisplayType('today')}>Today</span>
          <span className={`${styles.txtToday} ${!isDisplayToday && styles.selectedWeekday}`} onClick={onChangeDisplayType('week')}>Week</span>
        </div>
        <Select options={timeRange} styles={timeRangeStyle} onChange={onSelectTimeRange} />
      </div>
      <div className={styles.dayCard}>
        {weatherOfDays?.map((e, i) => <DayCard key={i} data={e} isDisplayToday={isDisplayToday} />)}
      </div>
      <p className={styles.txtTodayHighlight}>Today's Highlights</p>
      <div className={styles.weatherAdditionInfo}>
        <InfoCard
          title='Wind Status'
          value={weatherInfo?.current?.wind_speed}
          unit={'m/s'}
          evaluate={`${weatherInfo?.current?.wind_deg} degrees`}
          iconPath='/today/direction.png'
          iconClass={styles.directionIcon} />
        <InfoCard
          title='Humidity'
          value={weatherInfo?.current?.humidity}
          unit={'m/s'}
          evaluate={`${weatherInfo?.current?.humidity < 30 ? "Very Dry" : weatherInfo?.current?.humidity < 70 ? "Normal" : "Very Wet"}`}
          iconPath='/today/humidity.png' />
        <SunCard
          sunrise={weatherInfo?.current?.sunrise && dayjs.unix(weatherInfo?.current?.sunrise).format('hh:mm A')}
          sunset={weatherInfo?.current?.sunset && dayjs.unix(weatherInfo?.current?.sunset).format('hh:mm A')}
        />
      </div>
      <p className={styles.txtTodayHighlight}>Favorite Cities</p>
      <div className={styles.weatherAdditionInfo}>
        {cityList?.map((city, idx) =>
          <CityCard
            key={idx}
            index={idx}
            id={city.label}
            moveCard={moveCard}
            data={city}
            onDelete={onDeleteWidget}
          />)}
      </div>
    </div>
  );
}
