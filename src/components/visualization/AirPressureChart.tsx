import React from 'react';
import { View, Text } from 'react-native';
import { LineChart, ruleTypes } from 'react-native-gifted-charts'

const getMaxValue = (data) => {
   let max = data[0].value;
   for (let i = 1; i < data.length; i++) {
      if (data[i].value > max) {
         max = data[i].value;
      }
   }
   return max;
}

const lcomp = (v) => <Text style={{ width: 50, color: 'black' }}>{v}</Text>


const getAirPressureData = (data) => {
   let tempData = [
      {
         value: 350,
         labelComponent: () => lcomp('22 Nov'),
      },
      {
         value: 370,
      },
      {
         value: 460,
         dataPointLabelComponent: () => {
            return (
               <View
                  style={{
                     backgroundColor: 'rgba(0,0,0,0.5)',
                     paddingHorizontal: 8,
                     paddingVertical: 5,
                     borderRadius: 4,
                  }}>
                  <Text style={{ color: 'white' }}>460</Text>
               </View>
            );
         },
         dataPointLabelShiftY: -25,
         dataPointLabelShiftX: 0,
      },
      {
         value: 500,
         hideDataPoint: true,
      },
      {
         value: 570,
         labelComponent: () => lcomp('24 Nov'),
      },
      {
         value: 560,
         hideDataPoint: true,
      },
      {
         value: 590,
      },
      {
         value: 490,
         hideDataPoint: true,
      },
      {
         value: 280,
         labelComponent: () => lcomp('26 Nov'),
      },
      {
         value: 370,
         hideDataPoint: true,
      },
      {
         value: 350,
      },
      {
         value: 460,
         hideDataPoint: true,
      },
      {
         value: 520,
         labelComponent: () => lcomp('28 Nov'),
      },
      {
         value: 490,
         hideDataPoint: true,
      },
      {
         value: 370,
         hideDataPoint: true,
      },
      {
         value: 350,
      },
      {
         value: 460,
         labelComponent: () => lcomp('28 Nov'),
      },
      {
         value: 270,
         hideDataPoint: true,
      },
      {
         value: 350,
      },
   ];

   return tempData;
}

const AirPressureChart = ({ data }) => {
   const pressures = getAirPressureData(data);

   return (
      <View style={{
         marginTop: 10,
         padding: 16,
         paddingLeft: 5,
         backgroundColor: 'white',
      }}>
         <Text style={{ marginLeft: 5, color: 'black', fontSize: 16, fontWeight: 'bold' }}>
            Overview
         </Text>
         <View
            style={{
               marginVertical: 10,
               backgroundColor: 'white',
            }}>
            <LineChart
               isAnimated
               thickness={2}
               color="#5cb85c"
               maxValue={getMaxValue(pressures)}
               noOfSections={5}
               animateOnDataChange
               animationDuration={500}
               onDataChangeAnimationDuration={1000}
               yAxisTextStyle={{ color: 'black', fontSize: 12 }}
               data={pressures}
               startOpacity={0.4}
               endOpacity={0.1}
               spacing={30}
               rulesColor="gray"
               rulesType={ruleTypes.DOTTED}
               initialSpacing={10}
               yAxisColor="lightgray"
               xAxisColor="lightgray"
               focusEnabled
               showTextOnFocus
               showStripOnFocus
               stripColor='lightgray'
               stripWidth={0.7}
               stripOpacity={0.5}

            // secondaryData={dewPoints}
            // secondaryLineConfig={{ color: 'blue', areaChart: true }}
            />
         </View>
      </View>
   );
};

export default AirPressureChart;