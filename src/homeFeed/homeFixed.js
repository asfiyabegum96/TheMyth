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
} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
}
  from 'react-native-responsive-screen';
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
  }

  componentDidMount() {
    this.fetchUserDetails();
    loc(this);
  }

  fetchUserDetails() {
    const context = this;
    let db = firebase.firestore();
    let photosRef = db.collection('signup');
    photosRef.where('email', '==', context.props.navigation.state.params.email).get().then(function (querySnapshot) {
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

  componentWillUnMount() {
    rol();
  }

  navigateToPage = (item, isComment, isSavedCollection) => {
    if (isComment) {
      this.props.navigation.navigate('comments', { selectedItem: item, email: this.props.navigation.state.params.email.trim() })
    } else if (isSavedCollection) {
      this.props.navigation.navigate('mainFeed', { selectedItem: item, email: this.props.navigation.state.params.email.trim(), isSavedCollection: true })
    }
    else {
      this.addToSaveCollection(item)
    }
  }

  //uploading feed data in cloud firestore
  addToSaveCollection = (selectedItem) => {
    //Set variable for feed
    let author = selectedItem.item.author;
    let authorDescription = selectedItem.item.authorDescription;
    let caption = selectedItem.item.caption;
    let likes = selectedItem.item.likes;
    let location = selectedItem.item.location;
    let dateTime = Date.now();
    let timestamp = Math.floor(dateTime / 1000);
    let isDeleted = false;
    let userAvatar = selectedItem.item.userAvatar
    // Create object for firestore
    let photoObj = {
      author: author,
      authorDescription: authorDescription,
      caption: caption,
      likes: likes,
      location: location,
      postedTime: timestamp,
      url: selectedItem.item.url,
      userAvatar: userAvatar,
      docRef: selectedItem.item.docRef,
      isDeleted: isDeleted,
      email: this.props.navigation.state.params.email.trim()
    }
    firebase.firestore().collection('savedCollections').doc(photoObj.docRef).set(photoObj).then(function (docRef) {
      alert('Added to your collections!');
    });

  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <NavigationEvents
          onDidFocus={() => loc(this)}
        />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('bottomTab', { email: this.props.navigation.state.params.email.trim() })}>
            <FontAwesome5 style={styles.camera} name={'camera'} />
          </TouchableOpacity>
          <TextInput style={styles.inputSearch}
            selectionColor={orange}
            placeholder="Search"
            placeholderTextColor='#FF7200'
          />
          <TouchableOpacity onPress={() => this.props.navigation.navigate('profile', { email: this.props.navigation.state.params.email.trim() })}>
            <FontAwesome5 style={styles.profile} name={'user-alt'} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => this.props.navigation.navigate("chat")}
          style={styles.fabDiv}>
          <View style={styles.fab}>
            <FontAwesome5 style={styles.fabIcon} name='telegram-plane' size={35} />
          </View>
        </TouchableOpacity>
        <AppIndex screenProps={{ navigation: this.navigateToPage, email: this.props.navigation.state.params.email.trim() }} />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1.0,
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
  },
  camera: {
    color: '#FF7200',
    fontSize: hp('3.5%'),
    paddingLeft: 8,
    marginTop: 5,
  },
  profile: {
    color: '#FF7200',
    fontSize: hp('3.5%'),
    marginTop: 5,
  },
  inputSearch: {
    width: wp('70%'),
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#FF7200',
    fontSize: 20,
    backgroundColor: 'transparent',
    color: '#FF7200'
  },
  fabDiv: {
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    right: 0,
    margin: 15,
  },
  fab: {
    backgroundColor: '#fff',
    alignItems: 'center',
    width: wp('15%'),
    borderRadius: wp('10%'),
    justifyContent: 'center'
  },
  fabIcon: {
    color: '#FF7200',
    padding: wp('3%'),
    marginRight: wp('1%')
  },
});

