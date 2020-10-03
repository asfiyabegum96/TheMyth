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
  YellowBox,
  BackHandler
} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
}
  from 'react-native-responsive-screen';
import { SearchBar } from 'react-native-elements';
import { createAppContainer, NavigationEvents } from 'react-navigation';
import TopNavigator from '../navigation/topNavigatorHomeFeed.js';
import firebase from 'react-native-firebase';
console.disableYellowBox = true;



YellowBox.ignoreWarnings(['ViewPagerAndroid']);

const AppIndex = createAppContainer(TopNavigator);

const orange = '#FF7200';

export default class homeFixed extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      path: '',
      imageUri: null,
      uploading: false,
      progress: 0,
      caption: '',
      location: '',
      user: '',
      fieldNotEmpty: false
    }
    this.baseState = this.state;
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    this.fetchUserDetails();
    loc(this);
  }

  fetchUserDetails() {
    const context = this;
    let db = firebase.firestore();
    let photosRef = db.collection('signup');
    photosRef.where('email', '==', context.props.navigation.state.params.email.trim()).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        let data;
        const docNotEmpty = (doc.id, " => ", doc.data() != null);
        if (docNotEmpty) data = (doc.id, " => ", doc.data());
        context.setState({ user: doc.data() })
      })
    })
  }

  componentDidUpdate() {
    console.log('inside')
  }

  componentDidUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    rol();
  }

  handleBackButtonClick() {
    BackHandler.exitApp();
    return true;
  }

  navigateToPage = (item, isComment, isSavedCollection, viewOthers, notification) => {
    if (isComment === 'send') {
      this.props.navigation.navigate('chat', { selectedItem: item, email: item.item.email.trim() })
    } else if (isComment) {
      this.props.navigation.navigate('comments', { selectedItem: item, email: this.props.navigation.state.params.email.trim() })
    } else if (isSavedCollection) {
      this.props.navigation.navigate('mainFeed', { selectedItem: item, email: this.props.navigation.state.params.email.trim(), isSavedCollection: true })
    } else if (viewOthers) {
      this.props.navigation.navigate('profile', { email: item.email, searchedEmail: item.item.email.trim(), privateAccount: item.item.isPrivateAccount, isSameProfile: item.isSameProfile, isFollowed: item.item.isFollowed, isPending: false })
    } else if (notification) {
      this.props.navigation.navigate('mainFeed', { selectedItem: item, email: item.item.email.trim(), notification: true })
    }
    else {
      this.addToSaveCollection(item)
    }
  }

  //uploading feed data in cloud firestore
  addToSaveCollection = (selectedItem) => {
    let db = firebase.firestore();
    //Set variable for feed
    let caption = selectedItem.item.caption;
    let likes = selectedItem.item.likes;
    let location = selectedItem.item.location;
    let dateTime = Date.now();
    let timestamp = Math.floor(dateTime / 1000);
    let isDeleted = false;
    // Create object for firestore
    let photoObj = {
      caption: caption,
      likes: likes,
      location: location,
      postedTime: timestamp,
      url: selectedItem.item.url,
      docRef: selectedItem.item.docRef,
      isDeleted: isDeleted,
      email: this.props.navigation.state.params.email.trim()
    }
    db.collection("photos").doc(photoObj.docRef).update({
      saved: true
    }).then(function (docRef) {
      selectedItem.context.state.photoFeedData[selectedItem.index].isSaved = true;
      selectedItem.context.setPhoto(selectedItem.context.state.photoFeedData);
    });

    db.collection("photos").doc(photoObj.docRef).collection('savedUsers').doc(photoObj.email).set({ email: this.props.navigation.state.params.email.trim() })

    // firebase.firestore().collection('savedCollections').doc(photoObj.docRef).set(photoObj)

  }

  updateSearch() {
    this.props.navigation.navigate('search', { navigation: this.props.navigation, email: this.props.navigation.state.params.email.trim() })
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <NavigationEvents
          onDidFocus={() => loc(this)}
        />
        <TouchableOpacity onPress={() => this.props.navigation.navigate("chat", { email: this.props.navigation.state.params.email.trim() })}
          style={styles.fabDiv}>
          <View style={styles.fab}>
            <Image
              source={require('../images/message.png')}
              style={styles.fabIcon} />
            {/* <FontAwesome5 style={styles.fabIcon} name='telegram-plane' size={30} /> */}
          </View>
        </TouchableOpacity>
        <AppIndex screenProps={{ navigation: this.navigateToPage, navigateToOther: this.props.navigation, email: this.props.navigation.state.params.email.trim(), userDetails: this.state.user }} />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1.0,
    backgroundColor: '#fff'
  },
  profile: {
    color: '#fff',
    fontSize: hp('3%'),
    paddingVertical: wp('0.5%'),
    paddingHorizontal: wp('0.8%'),
    marginTop: 5,
    marginRight: wp('1.5%'),
  },
  fabDiv: {
    position: 'absolute',
    zIndex: 1,
    bottom: wp('10%'),
    right: 0,
    margin: 15,
  },
  fab: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginBottom: wp('5%'),
    marginRight: wp('1.5%')
  },
  fabIcon: {
    color: '#fff',
    padding: wp('2%'),
  },
});

