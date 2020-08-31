import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
}
  from 'react-native-responsive-screen';

import { createBottomTabNavigator } from 'react-navigation-tabs';
import MainFeed from '../topTabHomeFeed/mainFeed.js';
import notification from '../topTabHomeFeed/notification.js';
import Search from '../topTabHomeFeed/search.js';
import Gallery from '../camera/cameraBottomTab.js';
import Settings from '../sideDrawer/settings.js';
import PhotosUpload from './uploadTab.js';

class Mainscreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    }
  }

  navigateToComment = (item, isComment, isSavedCollection, viewUserProfile) => {
    this.props.screenProps.navigation(item, isComment, isSavedCollection, viewUserProfile)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MainFeed screenProps={{ navigation: this.navigateToComment, property: this.props, navigateToOther: this.props.screenProps.navigateToOther }} />
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
      screen: Search,
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => (
          <FontAwesome5 name={'search'}
            style={styles.icon}
            color={tintColor} />

        )
      }
    },
    Third: {
      screen: PhotosUpload,
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
      screen: Settings,
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