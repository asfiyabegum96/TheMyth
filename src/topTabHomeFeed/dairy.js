import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import SaveCollection from './save-collection';
import DiaryMaintain from './diary-maintain';
import {
  StyleSheet,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
}
  from 'react-native-responsive-screen';
const diary = createMaterialTopTabNavigator({
  Home: {
    screen: DiaryMaintain,
    navigationOptions: {
      title: 'DIARY',
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        defaultHandler()
        if (navigation.state && navigation.state.params) {
          navigation.state.params.onFocus()
        }
      },
    }
  },
  Second: {
    screen: SaveCollection,
    navigationOptions: {
      title: 'SAVED COLLECTIONS',
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        defaultHandler()
        if (navigation.state && navigation.state.params) {
          navigation.state.params.onFocus()
        }
      },
    }
  }
},
  {
    tabBarOptions: {
      activeTintColor: '#fff2e7',
      inactiveTintColor: '#22222C',
      showIcon: false,
      showLabel: true,
      indicatorStyle: {
        opacity: 0,
      },
      style: {
        backgroundColor: '#ff9380',
        borderBottomColor: '#fff2e7',
        borderBottomWidth: wp('0.5%')
      }
    },
  },
);

export default diary;



