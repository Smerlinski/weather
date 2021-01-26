import { Button, Grid, Paper, TextField, Tooltip } from '@material-ui/core';
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
  let lon;
  let lat;

  const tekst = () => {
    wpis === "undefined" ? (
      console.log('Nie wybrano miasta')
    ) :
      (
        fetch(`${api.url_current}weather?q=${wpis.value}&units=metric&APPID=${api.key}`)
          .then((res) => res.json())
          .then((result) => {
            setCurrentWeather(result);
            lon = result.coord.lon;
            lat = result.coord.lat;
            sec();
          }))
  }

  const sec = () => {
    fetch(`${api.url_current}onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${api.key}`)
      .then((res) => res.json())
      .then((result) => {
        setDaily(result.daily);
        daily.pop();
        daily.pop();
      })
  }

  return (<>
    <div className="search-bar">
      <Grid container spacing={0} justify="center">
        <Grid item xs={8} md={8} className="text-field">
          <TextField variant="outlined" {...wpis} label="City" fullWidth className="text-field"></TextField>

        </Grid>
        <Grid item xs={2} md={2}>
          <Button style={{ minHeight: "56px" }} variant="contained" color="primary" size="large" onClick={tekst} fullWidth>Search</Button>
        </Grid>
      </Grid>
    </div>
    {typeof currentWeather.main != "undefined" ? (
      <>
        <div className="flex">
          <Grid container spacing={3} direction="row" justify="center" alignItems="center">
            <Grid item xs={10} md={10}>
              <Paper elevation={3} className="item">
                <Grid item className="current-day" md={6} xs={12}>
                  <h3>{currentWeather.name}</h3>
                  <p>{moment().format("dddd, h:mm a")}</p>
                  <Tooltip title={currentWeather.weather[0].description}>
                    <img src={`${api.icon}${currentWeather.weather[0].icon}@2x.png`} alt=""></img>
                  </Tooltip>
                  <p> {Math.round(currentWeather.main.temp)}<span>&#8451;</span></p>
                </Grid>
                <Grid item className="current-day" md={6} xs={12}>
                  <p>Feels like: {Math.round(currentWeather.main.feels_like)}<span>&#8451;</span></p>
                  <p>Humidity: {currentWeather.main.humidity}%</p>
                  <p>Pressure: {currentWeather.main.pressure}hPa</p>
                  <p>High {Math.round(currentWeather.main.temp_max)}<span>&#8451;</span></p>
                  <p>Low {Math.round(currentWeather.main.temp_min)}<span>&#8451;</span></p>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={3} direction="row" justify="center" alignItems="center">
            {daily.slice(1, 6).map((day) => (
              <Grid item lg={2} md={10} xs={10} key={day.dt}>
                <Paper elevation={3} className="item">
                  <div className="daily">
                    <p>{moment.unix(day.dt).format("ddd, D")}</p>
                    <Tooltip title={day.weather[0].description}>
                      <img src={`${api.icon}${day.weather[0].icon}@2x.png`} alt={day.weather.main}></img>
                    </Tooltip>
                    <Tooltip title="High/Low">
                      <p>{Math.round(day.temp.max)}<span>&#8451;</span>/
              {Math.round(day.temp.min)}<span>&#8451;</span></p>
                    </Tooltip>
                    <Tooltip title="Precipitation">
                      <p><span>&#9730;</span>{(day.pop) * 100}%</p>
                    </Tooltip>
                  </div>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </div>
      </>
    ) : ("")}
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
