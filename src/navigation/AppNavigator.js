import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import loading from '../authentication/loading';
import signIn from '../authentication/signIn';
import signup from '../authentication/signUp';
import profile from '../profile/ownProfile';
import TabNavigator from '../camera/cameraBottomTab';
import homeFixed from '../homeFeed/homeFixed';
import chatLanding from '../chat/chatLanding';
import chatScreen from '../chat/chat';
import mainFeed from '../topTabHomeFeed/mainFeed'
import forgotPassword from '../authentication/forgotPassword';
import Comments from '../topTabHomeFeed/comments';
import sideNavigator from './sideDrawerNavigator'
import editProfile from '../sideDrawer/editProfile'
import updatePassword from '../sideDrawer/updatePassword';
import privacySettings from '../sideDrawer/privacySettings';
import accountSettings from '../sideDrawer/accountSettings'
import search from '../topTabHomeFeed/search';

const AppNavigator = createStackNavigator({
    Home: {
        screen: loading,
        navigationOptions: { header: null },
    },
    signIn: {
        screen: signIn,
        navigationOptions: { header: null },
    },
    signUp: {
        screen: signup,
        navigationOptions: { header: null },
    },
    privacySettings: {
        screen: privacySettings,
        navigationOptions: {
            headerTitle: 'Privacy',
            headerTintColor: "#fff", headerStyle: { backgroundColor: '#ed5720' }, headerTitleStyle: { color: 'white', fontSize: 17 },
        }
    },
    accountSettings: {
        screen: accountSettings,
        navigationOptions: {
            headerTitle: 'Account',
            headerTintColor: "#fff", headerStyle: { backgroundColor: '#ed5720' }, headerTitleStyle: { color: 'white', fontSize: 17 },
        }
    },
    editProfile: {
        screen: editProfile,
        navigationOptions: { headerTitle: 'Edit Profile' }
    },
    search: {
        screen: search,
        navigationOptions: { header: null },
    },
    updatePassword: {
        screen: updatePassword,
        navigationOptions: {
            headerTitle: 'Update Password',
            headerTintColor: "#fff", headerStyle: { backgroundColor: '#ed5720' }, headerTitleStyle: { color: 'white', fontSize: 17 },
        }
    },
    signup: {
        screen: signup,
        navigationOptions: {
            header: null
            // headerTitle: 'Create Account',
            // headerTintColor: "#fff", headerStyle: { backgroundColor: '#ed5720' }, headerTitleStyle: { color: 'white' },
        }
    },
    forgotPassword: {
        screen: forgotPassword,
        navigationOptions: {
            header: null
            // headerTitle: 'Forgot Password',
            // headerTintColor: "#fff", headerStyle: { backgroundColor: '#ed5720' }, headerTitleStyle: { color: 'white' }
        }
    },
    profile: {
        screen: profile,
        navigationOptions: { header: null },
    },
    homeFixed: {
        screen: homeFixed,
        navigationOptions: { header: null },
    },
    mainFeed: {
        screen: mainFeed,
    },
    bottomTab: {
        screen: TabNavigator,
        navigationOptions: { headerTitle: 'Add a photo', headerTitleStyle: { fontSize: 17 } },
    },
    chat: {
        screen: chatLanding,
        navigationOptions: { headerTitle: 'Chat' }
    },
    chatScreen: {
        screen: chatScreen,
        navigationOptions: {}
    },
    comments: {
        screen: Comments,
        navigationOptions: { headerTitle: 'Comments' }
    },
    sideNavigator: {
        screen: sideNavigator,
        navigationOptions: {
            headerTitle: 'Settings',
            headerTintColor: "#fff", headerStyle: { backgroundColor: '#ed5720' }, headerTitleStyle: { color: 'white', fontSize: 17 },
        },
    },
});

export default createAppContainer(AppNavigator);