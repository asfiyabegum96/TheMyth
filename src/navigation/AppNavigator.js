import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from '../authentication/signIn';
import signup from '../authentication/signUp';
import profile from '../profile/ownProfile';
import TabNavigator from '../camera/cameraBottomTab';
import homeFixed from '../homeFeed/homeFixed';
import chat from '../chat/chat';
import mainFeed from '../topTabHomeFeed/mainFeed'
import forgotPassword from '../authentication/forgotPassword';
import Comments from '../topTabHomeFeed/comments';
import sideNavigator from './sideDrawerNavigator'
import editProfile from '../sideDrawer/editProfile'
const AppNavigator = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: { header: null },
    },
    editProfile: {
        screen: editProfile,
        navigationOptions: { header: null },
    },
    signup: {
        screen: signup,
        navigationOptions: { header: null },
    },
    forgotPassword: {
        screen: forgotPassword,
        navigationOptions: { header: null }
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
        navigationOptions: { header: null },
    },
    chat: {
        screen: chat,
    },
    comments: {
        screen: Comments,
        navigationOptions: { header: null }
    },
    sideNavigator: {
        screen: sideNavigator,
        navigationOptions: { header: null },
    }
});

export default createAppContainer(AppNavigator);