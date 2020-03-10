import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import settings from '../sideDrawer/settings.js';



const sideNavigator = createDrawerNavigator(
  {
    Home: settings,
  },
  {
  },
)

export default sideNavigator;