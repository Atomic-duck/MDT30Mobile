import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const MyCalender = ({ setBeginDate, setEndDate, closeModel }) => {
   let curDate = new Date();
   let pastDate = new Date(curDate.getTime() - 7 * 24 * 60 * 60 * 1000);
   const [selectBegin, setSelectBegin] = useState(true);
   const [selectedDates, setSelectedDates] = useState({});

   const onDayPress = (day) => {
      let newSelectedDates = {};

      if (selectBegin) {
         newSelectedDates[day.dateString] = { selected: true, selectedColor: 'orange' };
         setBeginDate(day.dateString);
      }
      else {
         let s_date = new Date(Object.entries(selectedDates).at(0)?.[0])
         let e_date = new Date(day.dateString)

         //Todo: loop from s_date to e_date for adding date to newSelectedDates
         while (s_date <= e_date) {
            let dateStr = s_date.toISOString().slice(0, 10); // convert date to YYYY-MM-DD format
            newSelectedDates[dateStr] = { selected: true, selectedColor: 'orange' };
            s_date.setDate(s_date.getDate() + 1); // increment the date
         }

         setEndDate(day.dateString);
         setTimeout(closeModel, 700)
      }

      setSelectedDates(newSelectedDates)
      setSelectBegin(!selectBegin)
   };

   return <View style={{ width: "100%" }}>
      <Calendar
         current={curDate.toISOString().slice(0, 10)}
         onDayPress={onDayPress}
         markedDates={selectedDates}
         theme={{
            selectedDayBackgroundColor: 'gray',
            todayTextColor: 'red',
            dayTextColor: 'darkblue',
            textDisabledColor: 'gray',
            monthTextColor: 'darkblue',
            textMonthFontWeight: 'bold',
            arrowColor: 'darkblue',
         }}
      />
   </View>
}

export default MyCalender;