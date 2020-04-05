import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { createAppContainer } from 'react-navigation';
import { View, Text } from 'react-native';
import PushNotification from 'react-native-push-notification';
const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  async componentDidMount() {
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
