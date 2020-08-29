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
import photosUpload from '../navigation/uploadTab';
import CameraScreen from './camera';

const UploadPage = photosUpload;

class gallery extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: ''
    }
  }

  componentDidUpdate() {
    if (this.props && this.props.screenProps)
      this.setState({ email: this.props.screenProps.email })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <UploadPage screenProps={{ email: this.props.screenProps.email }} />
      </View>
    );
  }
}

export default gallery;