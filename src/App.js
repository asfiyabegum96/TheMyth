import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { createAppContainer } from 'react-navigation';
import PushNotification from 'react-native-push-notification';
import SplashScreen from 'react-native-splash-screen';
const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  async componentDidMount() {
    SplashScreen.hide()
    PushNotification.configure({

      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);

      },
    });
  }
  render() {
    return (
      <AppContainer />
    );
  }
}
