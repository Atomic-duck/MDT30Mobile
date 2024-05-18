import React from 'react';
import { View, Text } from 'react-native';

const Average = ({ color, title, metric }) => {
   return <View style={{ alignContent: 'center', backgroundColor: "white", width: "48%", padding: 10, borderRadius: 5, marginBottom: 5 }}>
      <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: 'bold' }}>27</Text>{metric}</Text>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
         <View style={{ backgroundColor: color, borderRadius: 50, width: 8, height: 8, marginRight: 5 }}></View>
         <Text style={{ fontSize: 12 }}>{title}</Text>
      </View>
   </View>
}

export default Average;