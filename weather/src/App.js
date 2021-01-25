import { Button, Grid, Paper, TextField } from '@material-ui/core';
import 'fontsource-roboto';
import './App.css';
import React, { useState } from 'react';
import moment from 'moment';

const api = {
  key: "2d2e542e894bb85ca6208df6d35349ea",
  url_current: "https://api.openweathermap.org/data/2.5/",
  icon: "http://openweathermap.org/img/wn/",
};

function App() {
  
  const [daily, setDaily] = useState([]);
  const [currentWeather, setCurrentWeather] = useState({});
  const wpis = useFormInput('');
  let timezone = 0;
  let dateTime = 0;
  let lo;
  let la;
  let day;

  const tekst = () => {
    fetch(`${api.url_current}weather?q=${wpis.value}&units=metric&APPID=${api.key}`)
    .then((res) => res.json())
    .then((result) => {
      dateTime = result.dt;
      setCurrentWeather(result);
      lo = result.coord.lon;
      la = result.coord.lat;
      sec();
    });
  }

  const sec = () => {
    fetch(`${api.url_current}onecall?lat=${la}&lon=${lo}&exclude=minutely&units=metric&appid=${api.key}`)
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      setDaily(result.daily);
      console.log(daily);
      daily.pop();
      daily.pop();
      console.log(daily.dt)
    })
  }

  return (<>
  <div className="search-bar">
  <TextField variant="outlined" {...wpis} label="City" fullWidth></TextField>
  <Button variant="contained" color="primary" size="large" onClick={tekst}>Search</Button>
  </div>
  {typeof currentWeather.main != "undefined" ? (
    <>
    <div className="flex">
    <Grid container spacing={3} direction="row" justify="center" alignItems="center">
      <Grid item xs={10}>
        <Paper>
        <h1>Miasto: {currentWeather.name}</h1>
        <p>Date: {moment().format("dddd, h:mm a")}</p>
        <img src={`${api.icon}${currentWeather.weather[0].icon}@2x.png`} alt=""></img>
        <p>Current temp: {Math.round(currentWeather.main.temp)}<span>&#8451;</span></p>
        <p>Feels like: {Math.round(currentWeather.main.feels_like)}<span>&#8451;</span></p>
        <p>Humidity: {currentWeather.main.humidity}%</p>
        <p>Pressure: {currentWeather.main.pressure}hPa</p>
        <p>Temp min: {currentWeather.main.temp_min}</p>
        <p>Temp max: {currentWeather.main.temp_max}</p>
        </Paper>
      </Grid>
      </Grid>
      <Grid container spacing={3} direction="row" justify="center" alignItems="center">
      {daily.slice(1,6).map((dai) =>(
        <Grid item xs={12} sm={2} key={dai.id}>
        <Paper>
          <p>{moment.unix(dai.dt).format("dddd, Do")}</p>
          <div>
            <img src={`${api.icon}${dai.weather[0].icon}@2x.png`} alt=""></img>
            <p>Max:{Math.round(dai.temp.max)}</p>
            <p>Min:{Math.round(dai.temp.min)}</p>
            <p>{(dai.pop)*100}%</p>
          </div>
        </Paper>
      </Grid>
      ))}
    </Grid>
    <Grid>
      
    </Grid>
    </div>
   </>
  ):("")}
  </>
  );
}

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
      setValue(e.target.value);
  }
  return {
      value,
      onChange: handleChange
  }
}

export default App;
