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
    this.props.screenProps.navigation.navigate('profile', { email: this.props.screenProps.email.trim() })
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
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.navSectionStyle}><Text style={styles.header}>Settings</Text></View>
          <View>
            <Text style={styles.navItemStyle} onPress={() => this.navigateToRoute('editProfile')}>
              Edit Profile
              </Text>
          </View>
          <View>
            <Text style={styles.navItemStyle} onPress={() => this.navigateToRoute('updatePassword')}>
              Update Password
              </Text>
            <Text style={styles.navItemStyle} onPress={() => this.confirmDeactivate()}>
              De-activate Account
              </Text>
          </View>
          <View>
            <Text style={styles.navItemStyle} onPress={() => this.logout()}>
              Logout
              </Text>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={() => this.onBack()}>
            <Text style={styles.butText}>BACK</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

Settings.propTypes = {
  navigation: PropTypes.object
};

const styles = {
  container: {
    paddingTop: 20,
    flex: 1,
    position: 'absolute',
    right: 0,
    top: 0,
    opacity: 0.5,
    width: 400,
    height: '100%',
    backgroundColor: '#fff2e7'
  },
  navItemStyle: {
    padding: wp('8%'),
    paddingLeft: wp('10%'),
    borderBottomColor: '#FF7200',
    borderBottomWidth: 1,
    fontSize: hp('2.2%')
  },
  navSectionStyle: {
    padding: wp('10%'),
  },
  footerContainer: {
    padding: wp('20%'),
  },
  header: {
    fontSize: hp('4%')
  },
  butText: {
    color: '#000',
    fontSize: hp('2%'),
    marginTop: 10,
    borderColor: '#A9A9A9',
    backgroundColor: '#FF7200',
    paddingVertical: 10,
    paddingHorizontal: 100,
    fontWeight: 'bold',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF7200'
  }
};

export default Settings;