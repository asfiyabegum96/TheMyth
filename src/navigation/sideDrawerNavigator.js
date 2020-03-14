import React from 'react';
import {
  View,
} from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Settings from '../sideDrawer/settings.js';

class settingsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: ''
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Settings screenProps={{ email: this.props.navigation.state.params.email, navigation: this.props.navigation }} />
      </View>
    );
  }
}

const sideNavigator = createDrawerNavigator(
  {
    Home: settingsScreen,
  },
  {
  },
)

export default sideNavigator;