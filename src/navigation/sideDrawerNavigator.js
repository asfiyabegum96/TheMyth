import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Entypo';
import UserAvatar from 'react-native-user-avatar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
}
  from 'react-native-responsive-screen';

import { createDrawerNavigator } from 'react-navigation-drawer';
import settings from '../sideDrawer/settings.js';
import connect from '../sideDrawer/editProfile.js';



const sideNavigator = createDrawerNavigator(
  {
    Home: settings,
  },
  {
  },
)

export default sideNavigator;