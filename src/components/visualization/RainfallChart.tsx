import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from "react-native-gifted-charts";

const getRainfallData = (data) => {
   const rainfall = [
      { value: 2500, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label: 'Jan' },
      { value: 3500, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label: 'Feb' },
      { value: 4500, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label: 'Mar' },
      { value: 5200, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label: 'Apr' },
      { value: 3000, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label: 'May' },
      { value: 2500, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label: 'Jan' },
      { value: 3500, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label: 'Feb' },
      { value: 4500, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label: 'Mar' },
      { value: 5200, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label: 'Apr' },
      { value: 3000, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label: 'May' },
      { value: 2500, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label: 'Jan' },
      { value: 3500, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label: 'Feb' },
      { value: 4500, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label: 'Mar' },
      { value: 5200, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label: 'Apr' },
      { value: 3000, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label: 'May' },
      { value: 2500, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label: 'Jan' },
      { value: 3500, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label: 'Feb' },
      { value: 4500, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label: 'Mar' },
      { value: 5200, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label: 'Apr' },
      { value: 3000, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label: 'May' },
   ];


   return rainfall;
}

const RainfallChart = ({ data }) => {
   let rainfall = getRainfallData(data)
   return (
      <View
         style={{
            marginTop: 10,
            padding: 16,
            paddingLeft: 5,
            backgroundColor: 'white',
         }}
      >
         <Text style={{ marginLeft: 5, color: 'black', fontSize: 16, fontWeight: 'bold' }}>
            Overview
         </Text>
         <View style={{ marginVertical: 10, }}>
            <BarChart
               data={rainfall}
               barWidth={20}
               initialSpacing={10}
               spacing={14}
               barBorderRadius={4}
               showGradient
               yAxisThickness={0.5}
               xAxisType={'dashed'}
               xAxisColor={'lightgray'}
               yAxisTextStyle={{ color: 'black' }}
               stepValue={1000}
               maxValue={6000}
               noOfSections={6}
               yAxisLabelTexts={['0', '1', '2', '3', '4', '5', '6']}
               labelWidth={40}
               xAxisLabelTextStyle={{ color: 'black', textAlign: 'center' }}
            />
         </View>
      </View>
   );
};

export default RainfallChart;