import { useEffect, useState } from 'react';
import styles from './App.module.scss';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import { getForecast } from './config/axiosConfig';

function App() {
  const [coordination, setCoordination] = useState({ lat: 1.29, lon: 103.85, units: 'metric' });
  const [weatherInfo, setWeatherInfo] = useState();
  const defaultCityList = JSON.parse(localStorage.getItem("cityList"));
  const [cityList, setCityList] = useState(defaultCityList || []);

  useEffect(() => {
    const getDefaultLocation = async () => {
      const forecast = await getForecast(coordination);
      setWeatherInfo(forecast?.data);
    };
    getDefaultLocation();

    const getCityListLocation = async () => {
      const forecastList = cityList?.map(ct => getForecast({ ...ct.value, units: 'metric' }));
      const allCityForecast = await Promise.all(forecastList);
      console.log('allCityForecast', allCityForecast);
      const mergeCityInfo = cityList.map((ct, idx) => ({ ...ct, weatherInfo: allCityForecast?.[idx].data }));
      setCityList(mergeCityInfo);
      localStorage.setItem("cityList", JSON.stringify(mergeCityInfo));
    };
    cityList?.length && getCityListLocation();


    // Auto refresh to update weather
    // const intervalId = setInterval(function () {
    //   getDefaultLocation();
    //   getCityListLocation
    // }, 10000);

    // return () => clearInterval(intervalId);
  }, [coordination, cityList?.length]);

  const onSearchChange = async (co) => {
    setCoordination({ ...co.value, units: 'metric' });
    const forecast = await getForecast({ ...co.value, units: 'metric' });
    setWeatherInfo(forecast?.data);
  };

  const onAddCity = (city) => {
    const isExisted = cityList?.find(e => e.label === city.label);
    console.log('isExisted', isExisted);
    // setCityList(prev => isExisted ? prev?.filter(el => el.label !== city.label) : [...prev, city]);
    !isExisted && setCityList(prev => ([...prev, city]));
  };

  const onDeleteWidget = (city) => {
    // const isExisted = cityList?.find(e => e.label === city.label);
    // console.log('isExisted', isExisted);
    setCityList(prev => prev?.filter(el => el.label !== city.label));
    // !isExisted && setCityList(prev => ([...prev, city]));
  };


  return (
    <div className={styles.appContainer}>
      <Sidebar onSearchChange={onSearchChange} weatherInfo={weatherInfo} onAddCity={onAddCity} />
      <Dashboard weatherInfo={weatherInfo} cityList={cityList} onDeleteWidget={onDeleteWidget} />
    </div>
  );
}

export default App;
