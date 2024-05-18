import React from "react";
import styled from "styled-components/native";

function CurrentForecast({ currentWeather, city }: any): JSX.Element {
  return (
    <CurrentView>
      <Timezone>{city}</Timezone>
      <MainInfoContainer>
        <CurrentTempView>
          {currentWeather.current && (
            <WeatherIcon
              source={{
                uri: `http://openweathermap.org/img/wn/${currentWeather.current.weather[0].icon}@2x.png`,
              }}
              resizeMode={"contain"}
            />
          )}
          <CurrentDegrees>
            {Math.round(currentWeather.current && currentWeather.current.temp)}
            °C
          </CurrentDegrees>
        </CurrentTempView>
        <Description>
          {currentWeather.current &&
            currentWeather.current.weather[0].description}
        </Description>
      </MainInfoContainer>
      <SecondaryInfoContainer>
        <Row>
          <DetailsBox>
            <Label>Cảm giác</Label>
            <Details>
              {currentWeather.current &&
                Math.round(currentWeather.current.feels_like)}
              °C
            </Details>
          </DetailsBox>
          <DetailsBox>
            <Label>Thấp nhất</Label>
            <Details>
              {currentWeather.daily &&
                Math.round(currentWeather.daily[0].temp.min)}
              °C
            </Details>
          </DetailsBox>
          <DetailsBox>
            <Label>Cao nhất</Label>
            <Details>
              {currentWeather.daily &&
                Math.round(currentWeather.daily[0].temp.max)}
              °C
            </Details>
          </DetailsBox>
        </Row>
        <Row>
          <DetailsBox>
            <Label>Gió</Label>
            <Details>
              {currentWeather.current && currentWeather.current.wind_speed} m/s
            </Details>
          </DetailsBox>
          <DetailsBox>
            <Label>Độ ẩm</Label>
            <Details>
              {currentWeather.current && currentWeather.current.humidity}%
            </Details>
          </DetailsBox>
          <DetailsBox>
            <Label>Mưa</Label>
            <Details>
              {currentWeather.daily && currentWeather.daily.length > 0
                ? currentWeather.daily[0].rain
                : "0"} MM
            </Details>
          </DetailsBox>
        </Row>
      </SecondaryInfoContainer>
    </CurrentView>
  );
};

const CurrentView = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const CurrentTempView = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const MainInfoContainer = styled.View`
  display: flex;
  align-items: center;
`;

const Description = styled.Text`
  color: white;
  font-size: 15px;
  text-transform: capitalize;
`;

const SecondaryInfoContainer = styled.View`
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 10px;
  width: 95%;
  max-width: 478px;
`;

const WeatherIcon = styled.Image`
  width: 50px;
  height: 50px;
`;

const Timezone = styled.Text`
  color: white;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  font-size: 15px;
`;

const CurrentDegrees = styled.Text`
  color: white;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  font-size: 60px;
`;

const Row = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  color: black;
  padding: 10px 30px;
`;

const DetailsBox = styled.View`
  display: flex;
  width: 40%;
`;

const Label = styled.Text`
  font-size: 18px;
`;

const Details = styled.Text`
  color: black;
  font-size: 15px;
  text-transform: capitalize;
`;

export default CurrentForecast;
