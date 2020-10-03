import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { ScrollView, Text, View, TouchableOpacity, Alert, BackHandler, AsyncStorage } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
}
  from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';
import { StackActions } from 'react-navigation';
import RadialGradient from 'react-native-radial-gradient';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import main from "../authentication/styles/main";

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uri: '',
      imagePath: '',
      imageSelected: false,
      radioState: ''
    }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    this._onFocusListener = this.props.navigation.addListener('didFocus', (payload) => {
      // Perform the reset action here
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    loc(this);
    this.checkUserAuthorization();
    this.fetchUserDetails();
  }

  async checkUserAuthorization() {
    firebase.messaging().hasPermission()
      .then((enabled) => {
        if (enabled) {
          console.log('user has permission');
        } else {
          console.log('user does not have permission');
          this.getPermission()
        }
      });
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    this.setState({ token: fcmToken })
    console.log('token from async storage', fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        console.log('token from firebase', fcmToken);
        this.setState({ token: fcmToken })
        await AsyncStorage.setItem("fcmToken", fcmToken); // store in db during installing and access that token
      }
    }
  }

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    return true;
  }

  fetchUserDetails() {
    const context = this;
    let db = firebase.firestore();
    let photosRef = db.collection('signup');
    photosRef.where('email', '==', this.props.navigation.state.params.email.trim()).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        let data;
        const docNotEmpty = (doc.id, " => ", doc.data() != null);
        if (docNotEmpty) data = (doc.id, " => ", doc.data());
        context.setState({ user: doc.data() })
      })
    })
  }

  navigateToRoute = (route) => {
    if (route === 'Home') {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: route })],
      });
      this.props.navigation.dispatch(resetAction);
    } else {
      this.props.navigation.navigate(route, { email: this.props.navigation.state.params.email.trim(), navigation: this.props.navigation })
    }
  }

  navigation() {
    this.props.navigation.navigate('sideNavigator')
  }

  logout = () => {
    const context = this;
    context.removeToken();
    firebase.auth().signOut().then(() => {
      this.navigateToRoute('Home')
    })
  }

  removeToken() {
    const context = this;
    let db = firebase.firestore();
    let userRef = db.collection('signup');
    userRef.where('email', '==', context.props.navigation.state.params.email.trim()).get().then(function (userQuerySnapshot) {
      userQuerySnapshot.forEach(function (doc) {
        let userData;
        const docNotEmpty = (doc.id, " => ", doc.data() != null);
        if (docNotEmpty) {
          userData = (doc.id, " => ", doc.data());
          if (userData.token && userData.token.length) {
            if (userData.token.includes(context.state.token)) {
              const token = userData.token.filter((data) => data !== context.state.token)
              db.collection("signup").doc(context.state.user.docRef).update({ token: token })
            }
          }
        }
      })
    })
  }

  confirmDeactivate = () => {
    Alert.alert(
      //title
      'Confirmation',
      //body
      'Are you sure to deactivate this account?',
      [
        { text: 'Yes', onPress: () => this.deactivate() },
        { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    );
  }

  deactivate = () => {
    let db = firebase.firestore();
    firebase.auth().currentUser.delete().then(() => {
      db.collection("signup").doc(this.state.user.docRef).update({
        isDeleted: true
      })
      alert('Thanks for using Myth!');
      this.navigateToRoute('Home');
    })
  }

  render() {
    return (
      <RadialGradient style={{ width: '100%', height: '100%' }}
        colors={['#FE7948', '#E23E00']}
        stops={[0.1, 0.95]}
        center={[180, 270]}
        radius={400}>
        {
          <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
              {/* <Text style={styles.navItemStyle} onPress={() => this.navigateToRoute('editProfile')}>
                  Edit Profile
                </Text> */}
              <FontAwesome5 style={styles.fabIcon} name='user-plus' size={14} />
              <Text style={styles.navItemStyle}>
                Invite Friends
                </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              {/* <Text style={styles.navItemStyle} onPress={() => this.navigateToRoute('editProfile')}>
                  Edit Profile
                </Text> */}
              <FontAwesome5 style={styles.fabIcon} name='user-circle' size={18} />
              <Text style={styles.navItemStyle} onPress={() => this.navigateToRoute('accountSettings')}>
                Account
                </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              {/* <Text style={styles.navItemStyle} onPress={() => this.navigateToRoute('editProfile')}>
                  Edit Profile
                </Text> */}
              <FontAwesome5 style={styles.fabIcon} name='id-card' size={16} />
              <Text style={styles.navItemStyle} onPress={() => alert("Coming soon!")}>
                Wallet
                </Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              {/* <Text style={styles.navItemStyle} onPress={() => this.navigateToRoute('editProfile')}>
                  Edit Profile
                </Text> */}
              <FontAwesome5 style={styles.fabIcon} name='info-circle' size={16} />
              <Text style={styles.navItemStyle}>
                About
                </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              {/* <Text style={styles.navItemStyle} onPress={() => this.navigateToRoute('editProfile')}>
                  Edit Profile
                </Text> */}
              <FontAwesome5 style={styles.fabIcon} name='power-off' size={16} />
              <Text style={styles.navItemStyle} onPress={() => this.logout()}>
                Logout
                </Text>
            </View>
            {/* <Text style={styles.navItemStyle} onPress={() => this.navigateToRoute('updatePassword')}>
                  Update Password
                </Text>
                <Text style={styles.navItemStyle} onPress={() => this.confirmDeactivate()}>
                  De-activate Account
                </Text> */}

            {/* <Text style={styles.navItemStyle} onPress={() => this.navigateToRoute('account')}>
                  Account Settings
            </Text> */}
            {/* <View style={styles.footerContainer}>
              <View style={main.primaryButtonContanier}>
                <TouchableOpacity onPress={() => this.onBack()}>
                  <Text style={main.primaryButtonText}>Back</Text>
                </TouchableOpacity>
              </View>
            </View> */}
          </View>}
      </RadialGradient>
    );
  }
}

Settings.propTypes = {
  navigation: PropTypes.object
};

const styles = {
  container: {
    flex: 1,
  },
  navItemStyle: {
    padding: wp('6%'),
    paddingLeft: wp('2%'),
    color: 'white'
  },
  navSectionStyle: {
    padding: wp('10%'),
  },
  footerContainer: {
    marginTop: wp('40%')
  },
  header: {
    fontSize: hp('4%')
  },
  fabIcon: {
    color: '#fff',
    padding: wp('6%'),
    paddingLeft: wp('7%'),
  },
  inputText: {
    width: wp('70%'),
    paddingVertical: 2,
    borderBottomWidth: wp('0.1%'),
    borderBottomColor: '#fff',
    fontSize: 17,
    color: '#fff',
    height: hp('7%'),
    paddingLeft: wp('5%'),
    paddingTop: wp('3.5%'),
    fontWeight: 'bold',
    marginTop: wp('2%'),
    borderBottomWidth: 0, borderTopWidth: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: wp('-3%')
  },
};

export default Settings;