import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';
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
  }
  componentDidMount() {
    loc(this);
    this.fetchUserDetails();
  }

  fetchUserDetails() {
    const context = this;
    let db = firebase.firestore();
    let photosRef = db.collection('signup');
    photosRef.where('email', '==', this.props.screenProps.email.trim()).get().then(function (querySnapshot) {
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
      this.props.screenProps.navigation.dispatch(resetAction);
    } else {
      this.props.screenProps.navigation.navigate(route, { email: this.props.screenProps.email.trim(), navigation: this.props.screenProps.navigation })
    }
  }

  navigation() {
    this.props.screenProps.navigation.navigate('sideNavigator')
  }

  onBack = () => {
    this.props.screenProps.navigation.navigate('profile', { email: this.props.screenProps.email.trim(), searchedEmail: this.props.screenProps.email.trim(), privateAccount: false, isSameProfile: true, isFollowed: true })
  }


  logout = () => {
    firebase.auth().signOut().then(() => {
      this.navigateToRoute('Home')
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
              <Text style={styles.navItemStyle} onPress={() => this.navigateToRoute('editProfile')}>
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
              <Text style={styles.navItemStyle} onPress={() => this.navigateToRoute('editProfile')}>
                Wallet
                </Text>
            </View>
           
            <View style={{ flexDirection: 'row' }}>
              {/* <Text style={styles.navItemStyle} onPress={() => this.navigateToRoute('editProfile')}>
                  Edit Profile
                </Text> */}
              <FontAwesome5 style={styles.fabIcon} name='info-circle' size={16} />
              <Text style={styles.navItemStyle} onPress={() => this.navigateToRoute('editProfile')}>
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
};

export default Settings;