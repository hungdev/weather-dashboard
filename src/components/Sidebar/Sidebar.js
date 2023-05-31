import React, { useState } from 'react';
import styles from './Sidebar.module.scss';
import { MdMyLocation, MdSearch } from "react-icons/md";
import { BiMessageSquareAdd } from "react-icons/bi";
import dayjs from 'dayjs';
import { getGeo } from '.././../config/axiosConfig';
import { AsyncPaginate } from "react-select-async-paginate";
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import { animations } from "../../config/constants";
import { fcConverter } from '../../config/convertDegree';


const timeRangeStyle = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 20
  }),
};

const timeRange = [
  { value: 3, label: '3 days' },
  { value: 5, label: '5 days' },
  { value: 7, label: '7 days' }
];

export default function Sidebar(props) {
  const { onSearchChange, weatherInfo, onAddCity } = props;
  const [search, setSearch] = useState({ label: "Singapore, SG", value: { lat: 1.2899175, lon: 103.8519072 } });

  const animation = weatherInfo && animations.find((animation) =>
    String(weatherInfo?.current?.weather?.[0].id).startsWith(animation.id)
  ).url;
  const temperature = Math.round(weatherInfo?.current.temp) || null; // fcConverter(Math.round(temperature), 'f');
  const image = weatherInfo && animations.find((animation) =>
    String(weatherInfo.current.weather[0].id).startsWith(animation.id)
  ).image;

  const onGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        onSearchChange?.({ type: 'currentPosition', value: { lat: position.coords.latitude, lon: position.coords.longitude } });
        setSearch({ label: 'Your Location', value: { lat: position.coords.latitude, lon: position.coords.longitude } });
      });
    }
  };

  const loadOptions = async (inputValue) => {
    if (!inputValue) {
      return { options: [] };
    }
    const geoResult = await getGeo({ q: inputValue, limit: 5, });
    const formatData = geoResult?.data?.map(city => ({
      // value: `${city.lat} ${city.lon}`,
      value: { lat: city.lat, lon: city.lon },
      label: `${city.name}, ${city.country}`,
    }));
    return { options: formatData };
  };

  const handleOnChange = (searchData) => {
    setSearch(searchData);
    onSearchChange?.(searchData);
  };

  const onHandleAddCity = () => onAddCity?.(search);

  return (
    <div className={styles.sidebar}>
      <div className={styles.addressLocation}>
        <div className={styles.searchBox}>
          <MdSearch className={styles.searchIcon} />
          {/* <input className={styles.search} /> */}
          <AsyncPaginate
            placeholder="Search for places..."
            debounceTimeout={600}
            value={search}
            onChange={handleOnChange}
            loadOptions={loadOptions}
            styles={timeRangeStyle}
          />
        </div>
        <div className={styles.wrapLocation}>
          <MdMyLocation className={styles.location} onClick={onGetCurrentLocation} />
        </div>
      </div>
      <Player
        src={animation}
        autoplay
        loop
        renderer="svg"
        background="transparent"
        controls={false}
        style={{ height: '200px', width: '200px' }}
        speed={2}
      />
      <p className={styles.place}>{search?.label}
        <span><BiMessageSquareAdd onClick={onHandleAddCity} color='#E99F18' className={styles.btnAdd} /></span>
      </p>
      {temperature && <p className={styles.temperature}>{temperature}<sup>ºC</sup></p>}
      <p className={styles.currentTime}>{weatherInfo?.current?.dt && dayjs.unix(weatherInfo?.current?.dt).format('dddd, hh:mm A')}</p>
      <div className={styles.currentWeatherBox}>
        {weatherInfo?.current?.weather?.[0]?.icon && <img src={`http://openweathermap.org/img/wn/${weatherInfo?.current?.weather?.[0]?.icon}@2x.png`} width="80" height="80" alt="" />}
        <div>
          <p className={styles.currentWeather}>{weatherInfo?.current?.weather?.[0]?.main}</p>
          <p>{weatherInfo?.current?.weather?.[0]?.description}</p>
        </div>
      </div>
      {image && <img src={image} alt="" className={styles.sidebarImgBottom} />}
    </div>
  );
}
