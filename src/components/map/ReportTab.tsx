import { CheckBox } from '@rneui/base';
import React from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import WeatherContainer from './WeatherContainer';
import { checkCoordinates, geTimeDiff } from '../../utils/notify'


interface FloodTabProps {
   showCameraIcons: boolean
   setShowCameraIcons: any
   roadStatusList: any[],
   focusCameraTo: any
}

const ReportTab: React.FC<FloodTabProps> = ({ showCameraIcons, setShowCameraIcons, roadStatusList, focusCameraTo }) => {
   // Function to handle checkbox state changes
   const handleCheckboxChange = (value: boolean) => {
      setShowCameraIcons(value);
   };

   return (
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.tabContent}>
         <View style={styles.checkboxContainer}>
            <CheckBox
               checked={showCameraIcons}
               onPress={(e) => handleCheckboxChange(!showCameraIcons)}
               containerStyle={styles.boxContainer}
            />
            <Text>HIển thị Camera</Text>
         </View>
         <View>
            {
               roadStatusList.length == 0 && (
                  <Text style={{ alignSelf: 'center' }}>Không có báo cáo</Text>
               )
            }
            {
               roadStatusList.map((report, idx) => {
                  console.log(report)
                  let condition = report.conditions.reduce((name, e, idx) => name + e.condition + (idx == report.conditions.length - 1 ? '' : ', '), "");
                  let time = geTimeDiff(new Date(report.timestamp));
                  return (
                     <TouchableOpacity style={styles.info} key={'report-' + idx} onPress={() => focusCameraTo(report.coordinates)}>
                        <Text key={'report-' + idx}><Text style={styles.titleReport}>Báo cáo {idx + 1}</Text> - <Text style={styles.contentReport}>{time}</Text></Text>
                        <Text key={'condition-' + idx} style={styles.contentReport}>Tình trạng: {condition}</Text>
                        <Text key={'location-' + idx} style={styles.contentReport}>Vị trí: {report.location?.slice(0, report.location?.length - 10)}</Text>
                     </TouchableOpacity>
                  )
               })
            }
         </View>
      </ScrollView >
   );
}

export default ReportTab;

const styles = StyleSheet.create({
   scrollViewContent: {
      justifyContent: 'flex-start',
      flexGrow: 1,
   },
   checkboxContainer: {
      flexDirection: 'row-reverse',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 0,
      marginBottom: 10,
   },
   boxContainer: {
      padding: 0,
   },
   tabContent: {
      paddingVertical: 5,
      height: 200,
   },
   info: {
      flexDirection: 'column',
      backgroundColor: '#ccc',
      borderRadius: 5,
      marginBottom: 10,
      padding: 10
   },
   titleReport: {
      fontSize: 15,
      color: 'black',
      fontWeight: '500'
   },
   contentReport: {
      fontSize: 14,
      color: 'black'
   }
});
