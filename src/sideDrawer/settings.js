import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
}
  from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';
import { StackActions } from 'react-navigation';

class settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uri: '',
      imagePath: '',
      imageSelected: false,
      radioState: ''
    }
  }

  navigateToRoute = (route) => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: route })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  navigateToScreen = (route) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    console.log(navigateAction)
    this.props.navigation.dispatch(navigateAction);
  }

  onBack = () => {
    this.props.navigation.navigate('profile')
  }


  logout = () => {
    firebase.auth().signOut();
    this.navigateToRoute('Home')
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
            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Page2')}>
              Update Password
              </Text>
            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Page3')}>
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

settings.propTypes = {
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

export default settings;