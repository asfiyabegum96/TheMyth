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

import { createBottomTabNavigator } from 'react-navigation-tabs';
import MainFeed from '../topTabHomeFeed/mainFeed.js';
import connect from '../topTabHomeFeed/connect.js';
import diary from '../topTabHomeFeed/dairy.js';
import notification from '../topTabHomeFeed/notification.js';
import { createAppContainer } from 'react-navigation';
import Search from '../topTabHomeFeed/search.js';
import Gallery from '../camera/cameraBottomTab.js';
import Settings from '../sideDrawer/settings.js';

// const ActualFeed = mainFeed;

class Mainscreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: ''
    }
    console.log(props)
  }

  navigateToComment = (item, isComment, isSavedCollection, viewUserProfile) => {
    this.props.screenProps.navigation(item, isComment, isSavedCollection, viewUserProfile)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MainFeed screenProps={{ navigation: this.navigateToComment, property: this.props }} />
      </View>
    );
  }
}

class SearchScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: ''
    }
    console.log(props)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Search screenProps={{ navigation: this.props.navigation, email: this.props.screenProps.email.trim() }} />
      </View>
    );
  }
}

class CameraScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: ''
    }
    console.log(props)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Gallery screenProps={{ navigation: this.props.navigation, email: this.props.screenProps.email.trim() }} />
      </View>
    );
  }
}

class SettingsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: ''
    }
    console.log(props)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Settings screenProps={{ navigation: this.props.navigation, email: this.props.screenProps.email.trim() }} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  icon: {
    fontSize: hp('3%'),
  },
  addIcon: {
    fontSize: hp('3%'),
    marginTop: wp('-0.5%'),
  }
})
const TopNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: Mainscreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => (
          <FontAwesome5 name={'home'}
            style={styles.icon}
            color={tintColor} />
        )
      }
    },
    Second: {
      screen: SearchScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => (
          <FontAwesome5 name={'search'}
            style={styles.icon}
            color={tintColor} />

        )
      }
    },
    Third: {
      screen: CameraScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => (
          <View style={{ marginBottom: wp('6%'), backgroundColor: 'white' }}>
            <View style={{ borderRadius: 50, borderWidth: 1, borderColor: '#ccc', padding: wp('3%'), height: hp('6%') }}>
              <FontAwesome5 name={'plus-square'}
                style={styles.addIcon}
                color={tintColor} />
            </View>
          </View>
        )
      }
    },
    Fourth: notification,
    Fifth: {
      screen: SettingsScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => (
          <FontAwesome5 name={'cog'}
            style={styles.icon}
            color={tintColor} />
        )
      }
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#FF7200',
      inactiveTintColor: '#aaa',
      showIcon: true,
      showLabel: false,
      indicatorStyle: {
        opacity: 0,
      },
      style: {
        backgroundColor: '#fff',
      }
    },
  },
)
export default TopNavigator;