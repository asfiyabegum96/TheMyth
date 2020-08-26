import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
}
    from 'react-native-responsive-screen';
import ProfilePosts from './profilePosts';
import { createAppContainer } from 'react-navigation';
import DiaryMaintain from '../topTabHomeFeed/diary-maintain';
import SaveCollection from '../topTabHomeFeed/save-collection';
const NavigatorTab = createMaterialTopTabNavigator({
    Home: {
        screen: ProfilePosts,
        navigationOptions: {
            title: 'Posts',
            tabBarOnPress: ({ navigation, defaultHandler }) => {
                defaultHandler()
                if (navigation.state && navigation.state.params) {
                    navigation.state.params.onFocus()
                }
            },
        }
    },
    Second: {
        screen: DiaryMaintain,
        navigationOptions: {
            title: 'Diary',
            tabBarOnPress: ({ navigation, defaultHandler }) => {
                defaultHandler()
                if (navigation.state && navigation.state.params) {
                    navigation.state.params.onFocus()
                }
            },
        }
    },
    Third: {
        screen: SaveCollection,
        navigationOptions: {
          title: 'Saved',
          tabBarOnPress: ({ navigation, defaultHandler }) => {
            defaultHandler()
            if (navigation.state && navigation.state.params) {
              navigation.state.params.onFocus()
            }
          },
        }
      }
},
    {
        tabBarOptions: {
            activeTintColor: '#FF7200',
            inactiveTintColor: '#22222C',
            showIcon: false,
            showLabel: true,
            indicatorStyle: {
                opacity: 0,
            },
            labelStyle: {
                textTransform: "capitalize",
                fontWeight: "bold"
            },
            style: {
                backgroundColor: '#fff6f2',
                borderTopColor: '#fff6f2',
                borderTopWidth: wp('0.1%'),
                borderBottomColor: '#FF7200',
                borderBottomWidth: wp('0.1%')
            }
        },
    },
);

const PostTab = createAppContainer(NavigatorTab);

export default PostTab;



