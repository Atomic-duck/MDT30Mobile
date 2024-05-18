import React from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

interface InfoHeaderProps {
   title: String;
   titleModal: String;
   handleModalNavigation: ((event: GestureResponderEvent) => void);
}

const InfoHeader: React.FC<InfoHeaderProps> = ({ title, titleModal, handleModalNavigation }) => {
   return (
      <Header>
         <Title>{title}</Title>
         <TouchableOpacity onPress={handleModalNavigation}>
            <TouchableText>{titleModal}</TouchableText>
         </TouchableOpacity>
      </Header>
   );
}

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  width: 95%;
`;

const Title = styled.Text`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: bold
`;

const TouchableText = styled.Text`
  font-size: 16px;
  color: white;
`;

export default InfoHeader;
