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
import notificationsSettings from '../sideDrawer/notificationsSettings'
import search from '../topTabHomeFeed/search';
import Settings from "../sideDrawer/settings";

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
            headerTintColor: "#fff", headerStyle: { backgroundColor: '#EE6E3D' }, headerTitleStyle: { color: 'white', fontSize: 17 },
        }
    },
    accountSettings: {
        screen: accountSettings,
        navigationOptions: {
            headerTitle: 'Account',
            headerTintColor: "#fff", headerStyle: { backgroundColor: '#EE6E3D' }, headerTitleStyle: { color: 'white', fontSize: 17 },
        }
    },
    notificationsSettings: {
        screen: notificationsSettings,
        navigationOptions: {
            headerTitle: 'Notifications',
            headerTintColor: "#fff", headerStyle: { backgroundColor: '#EE6E3D' }, headerTitleStyle: { color: 'white', fontSize: 17 },
        }
    },
    editProfile: {
        screen: editProfile,
        navigationOptions: {
            headerTitle: 'Edit Profile',
            headerTintColor: "#fff", headerStyle: { backgroundColor: '#EE6E3D' }, headerTitleStyle: { color: 'white', fontSize: 17 },
        }
    },
    search: {
        screen: search,
        navigationOptions: { header: null },
    },
    updatePassword: {
        screen: updatePassword,
        navigationOptions: {
            headerTitle: 'Update Password',
            headerTintColor: "#fff", headerStyle: { backgroundColor: '#EE6E3D' }, headerTitleStyle: { color: 'white', fontSize: 17 },
        }
    },
    signup: {
        screen: signup,
        navigationOptions: {
            header: null
            // headerTitle: 'Create Account',
            // headerTintColor: "#fff", headerStyle: { backgroundColor: '#EE6E3D' }, headerTitleStyle: { color: 'white' },
        }
    },
    forgotPassword: {
        screen: forgotPassword,
        navigationOptions: {
            header: null
            // headerTitle: 'Forgot Password',
            // headerTintColor: "#fff", headerStyle: { backgroundColor: '#EE6E3D' }, headerTitleStyle: { color: 'white' }
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
        navigationOptions: {
            headerTitle: 'Whispers',
            headerTintColor: "#fff", headerStyle: { backgroundColor: '#EE6E3D' }, headerTitleStyle: { color: 'white', fontSize: 17, fontWeight: 'bold' },
        }
    },
    chatScreen: {
        screen: chatScreen,
        navigationOptions: {
            headerTitle: 'Whispers',
            headerTintColor: "#fff", headerStyle: { backgroundColor: '#EE6E3D' }, headerTitleStyle: { color: 'white', fontSize: 17, fontWeight: 'bold' },
        }
    },
    comments: {
        screen: Comments,
        navigationOptions: { header: null },
    },
    settings: {
        screen: Settings,
        navigationOptions: {
            headerTitle: 'Settings',
            headerTintColor: "#fff", headerStyle: { backgroundColor: '#EE6E3D' }, headerTitleStyle: { color: 'white', fontSize: 17 },
        },
    },
    sideNavigator: {
        screen: sideNavigator,
        navigationOptions: {
            headerTitle: 'Settings',
            headerTintColor: "#fff", headerStyle: { backgroundColor: '#EE6E3D' }, headerTitleStyle: { color: 'white', fontSize: 17 },
        },
    },
});

export default createAppContainer(AppNavigator);