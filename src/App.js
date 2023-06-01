import { useEffect, useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
      const mergeCityInfo = cityList.map((ct, idx) => ({ ...ct, weatherInfo: allCityForecast?.[idx].data }));
      setCityList(mergeCityInfo);
      localStorage.setItem("cityList", JSON.stringify(mergeCityInfo));
    };
    cityList?.length && getCityListLocation();


    // Auto refresh to update weather after 5mins
    const intervalId = setInterval(function () {
      getDefaultLocation();
      getCityListLocation();
    }, 300000);

    return () => clearInterval(intervalId);
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
    setCityList(prev => prev?.filter(el => el.label !== city.label));
  };

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setCityList((list) => {
      let changed = [...list];
      changed.splice(dragIndex, 1, list[hoverIndex]);
      changed.splice(hoverIndex, 1, list[dragIndex]);
      return changed;
    });
  }, []);


  return (
    <div className={styles.appContainer}>
      <DndProvider backend={HTML5Backend}>
        <Sidebar onSearchChange={onSearchChange} weatherInfo={weatherInfo} onAddCity={onAddCity} />
        <Dashboard weatherInfo={weatherInfo} cityList={cityList} onDeleteWidget={onDeleteWidget} moveCard={moveCard} />
      </DndProvider>
    </div>
  );
}

export default App;
