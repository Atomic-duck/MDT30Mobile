import React from "react";
import { Text } from "react-native";
import styled from "styled-components/native";
import moment from "moment";

const HourlyForecast = ({ hour }) => {
   return (
      <HourContainer>
         <TimeContainer>
            <Time>{moment(hour.dt * 1000).format("HH:mm")}</Time>
         </TimeContainer>
         <IconTempView>
            <WeatherIcon
               source={{
                  uri: `http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`,
               }}
               resizeMode={"contain"} // cover or contain its upto you view look
            />
         </IconTempView>
         <DegreeView>
            <Degree>{Math.round(hour.temp)}°C</Degree>
            <Degree>{Math.round(hour.pop * 100)}%</Degree>
            {/* <FeelsLike>Feels {Math.round(day.feels_like.day)}°C</FeelsLike> */}
         </DegreeView>
      </HourContainer>
   );
};

const HourContainer = styled.View`
   padding: 5px 0px 8px 0px;
   background-color: rgba(255, 255, 255, 0.6);
   border-radius: 10px;
   margin: 10px 0px 10px 10px;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: space-evenly;
   width: 50px;
   max-width: 478px;
`;

const TimeContainer = styled.View`
  text-align: right;
  flex: 1;
`;

const Time = styled.Text`
  font-size:14px;
  text-align: center;
  margin: 3px;
`;

const IconTempView = styled.View`
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  flex: 2;
`;

const WeatherIcon = styled.Image`
  width: 50px;
  height: 50px;
`;

const DegreeView = styled.View`
  text-align: center;
  flex: 1;
`;

const Degree = styled.Text`
  font-size: 14px;
`;

const FeelsLike = styled.Text`
  font-size: 14px;
`;

export default HourlyForecast;
