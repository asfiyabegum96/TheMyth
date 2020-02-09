import React from 'react';
import { Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
}
  from 'react-native-responsive-screen';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import uploadNavigator from '../navigation/uploadTab';
import CameraScreen from './camera';

const UploadPage = createAppContainer(uploadNavigator);

class gallery extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: ''
    }
  }

  componentDidUpdate() {
    if (this.props && this.props.navigation && this.props.navigation.state && this.props.navigation.state.params)
      this.setState({ email: this.props.navigation.state.params.email })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <UploadPage screenProps={{ navigation: this.props.navigation }} />
      </View>
    );
  }
}

class photos extends React.Component {

  render() {
    return (
      <View style={{ flex: 1 }}>
        <CameraScreen />
      </View>
    );
  }
}
class videos extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <CameraScreen />
      </View>
    );
  }
}


const TabNavigator = createBottomTabNavigator(
  {
    // Gallery: gallery,
    Gallery: {
      screen: gallery,
      navigationOptions: {
        tabBarLabel: 'Gallery',
      },
    },
    Photos: photos,
    Videos: videos,
  },

  {

    tabBarOptions: {
      activeTintColor: '#FCD705',
      inactiveTintColor: 'white',
      showIcon: true,
      showLabel: true,
      indicatorStyle: {
        opacity: 0,
      },
      style: {
        backgroundColor: '#121212',
        paddingBottom: 15,
        fontSize: hp('10%'),
      }
    },
  },
);

export default createAppContainer(TabNavigator);