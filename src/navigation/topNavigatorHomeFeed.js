import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import MainFeed from '../topTabHomeFeed/mainFeed.js';
import notification from '../topTabHomeFeed/notification.js';
import Search from '../topTabHomeFeed/search.js';
import Gallery from '../camera/cameraBottomTab.js';
import Settings from '../sideDrawer/settings.js';
import PhotosUpload from './uploadTab.js';
import DiaryMaintain from '../topTabHomeFeed/diary-maintain.js';

class Mainscreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      keyboardState: false,
    };
  }

  // componentDidMount() {
  //   this.keyboardDidShowListener = Keyboard.addListener(
  //     'keyboardDidShow',
  //     this._keyboardDidShow,
  //   );
  //   this.keyboardDidHideListener = Keyboard.addListener(
  //     'keyboardDidHide',
  //     this._keyboardDidHide,
  //   );
  // }

  // componentWillUnMount() {
  //   this.keyboardDidShowListener.remove();
  //   this.keyboardDidHideListener.remove();
  // }

  // _keyboardDidShow() {
  //   this.setState({
  //     keyboardState: true,
  //   });
  //   console.log(this.keyboardState);
  // }

  // _keyboardDidHide() {
  //   console.log('False');
  //   this.setState({
  //     keyboardState: false,
  //   });
  // }

  render() {
    return (
      <View style={{flex: 1}}>
        <MainFeed
          screenProps={{
            navigation: this.navigateToComment,
            property: this.props,
            navigateToOther: this.props.screenProps.navigateToOther,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    fontSize: hp('3%'),
  },
  addIcon: {
    marginTop: wp('-2%'),
    marginRight: wp('1.2%'),
  },
  addFab: {
    backgroundColor: '#fff',
    alignItems: 'center',
    // width: wp('15%'),
    // borderRadius: wp('10%'),
    justifyContent: 'center',
    width: 30,
    height: 30,
    marginBottom: wp('6%'),
  },
  fab: {
    backgroundColor: '#fff',
    alignItems: 'center',
    // width: wp('15%'),
    // borderRadius: wp('10%'),
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
  fabIcon: {
    color: '#fff',
    // padding: wp('2%'),
  },
});
const TopNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: Mainscreen,
      navigationOptions: {
        tabBarIcon: ({tintColor, focused}) => (
          <View style={styles.fab}>
            <Image
              source={require('../images/home-active.png')}
              style={styles.fabIcon}
              tintColor={tintColor}
              inactiveTintColor="#aaa"
              width={35}
              height={35}
            />
            {/* <FontAwesome5 style={styles.fabIcon} name='telegram-plane' size={30} /> */}
          </View>
        ),
      },
    },
    Second: {
      screen: Search,
      navigationOptions: {
        tabBarIcon: ({tintColor, focused}) => (
          <View style={styles.fab}>
            <Image
              source={require('../images/explore-new.png')}
              style={styles.fabIcon}
              tintColor={tintColor}
              width={35}
              height={35}
            />
            {/* <FontAwesome5 style={styles.fabIcon} name='telegram-plane' size={30} /> */}
          </View>
        ),
      },
    },
    Third: {
      screen: PhotosUpload,
      navigationOptions: {
        tabBarIcon: ({tintColor, focused}) => (
          // <>
          //   {this.state.keyboardState == true ? (
          <View
            style={{
              marginBottom: wp('15%'),
              // top: this.state.keyboardState === 'closed' ? 0 : 30,
            }}>
            <View
              style={{
                width: 50,
                height: 50,
                elevation: 3,
                borderRadius: 50 / 2,
                borderWidth: 1,
                borderColor: '#fff',
                padding: wp('3%'),
                height: hp('6%'),
                backgroundColor: 'white',
              }}>
              <View style={styles.addFab}>
                <Image
                  source={require('../images/new-post.png')}
                  style={styles.addIcon}
                  tintColor={tintColor}
                  width={38}
                  height={38}
                />
                {/* <FontAwesome5 style={styles.fabIcon} name='telegram-plane' size={30} /> */}
              </View>
            </View>
          </View>
          //   ) : (
          //     <View />
          //   )}
          // </>
        ),
      },
    },
    Fourth: notification,
    Fifth: {
      screen: DiaryMaintain,
      navigationOptions: {
        tabBarIcon: ({tintColor, focused}) => (
          <View style={styles.fab}>
            <Image
              source={require('../images/Diary-new.png')}
              style={styles.fabIcon}
              tintColor={tintColor}
              width={35}
              height={35}
            />
            {/* <FontAwesome5 style={styles.fabIcon} name='telegram-plane' size={30} /> */}
          </View>
        ),
      },
    },
  },
  {
    // tabBarOptions: {
    //   activeTintColor: '#EE6E3D',
    //   inactiveTintColor: '#aaa',
    //   showIcon: true,
    //   showLabel: false,
    //   indicatorStyle: {
    //     opacity: 0,
    //   },
    //   style: {
    //     backgroundColor: '#fff',
    //   },
    // },
    tabBarOptions: {
      keyboardHidesTabBar: true,
      tabStyle: {
        backgroundColor: '#fff',
        height: 60,
        bottom: 10,
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
      },
      inactiveTintColor: '#aaa',
      activeTintColor: '#EE6E3D',
      showLabel: false,
      showIcon: true,
      indicatorStyle: {
        opacity: 0.2,
      },
      style: {
        borderRadius: 20,
        backgroundColor: '#fff',
        padding: 10,
        height: 60,
        zIndex: 8,
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
      },
    },
  },
);
export default TopNavigator;
