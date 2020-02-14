import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Entypo';
import UserAvatar from 'react-native-user-avatar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
}
  from 'react-native-responsive-screen';

import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import MainFeed from '../topTabHomeFeed/mainFeed.js';
import connect from '../topTabHomeFeed/connect.js';
import diary from '../topTabHomeFeed/dairy.js';
import notification from '../topTabHomeFeed/notification.js';
import { createAppContainer } from 'react-navigation';

// const ActualFeed = mainFeed;

class Mainscreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: ''
    }
  }

  navigateToComment = () => {
    this.props.screenProps()
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MainFeed screenProps={this.navigateToComment} />
      </View>
    );
  }
}
const TopNavigator = createMaterialTopTabNavigator(
  {
    Home: Mainscreen,
    Second: connect,
    Third: diary,
    Fourth: notification,
  },
  {
    tabBarOptions: {
      activeTintColor: '#FCD705',
      inactiveTintColor: '#22222C',
      showIcon: true,
      showLabel: false,
      indicatorStyle: {
        opacity: 0,
      },
      style: {
        backgroundColor: 'transparent',
        borderBottomColor: wp('0.5%'),
      }
    },
  },
)

export default TopNavigator;