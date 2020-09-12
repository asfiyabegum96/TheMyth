import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  BackHandler
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import UserAvatar from 'react-native-user-avatar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
}
  from 'react-native-responsive-screen';
import MasonryList from "react-native-masonry-list";
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native"
import firebase from 'react-native-firebase';
import { SearchBar } from 'react-native-elements';
import main from "../authentication/styles/main";
import PostTab from './postTab';
import OtherPostTab from './otherPostTab';



export default class profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: '',
      images: [],
      loading: true,
      navProps: props.navigation.state.params,
      followText: 'Follow',
      whisperText: 'Whisper',
      followersCount: 0,
      followingCount: 0
    }
    this.baseState = this.state;
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    loc(this);
    this._unsubscribe = this.props.navigation.addListener('willFocus', () => {
      this.setState(this.baseState)
      this.fetchUserDetails();
    });
  }

  fetchUserDetails() {
    const context = this;
    let email;
    let params = context.props.navigation.state.params;
    let db = firebase.firestore();
    let photosRef = db.collection('signup');
    if (params.isSameProfile === true) {
      email = params.email;
    } else {
      email = params.searchedEmail
      if (params.isFollowed === true) {
        this.setState({ followText: 'Following' });
      }
    }
    photosRef.where('email', '==', email).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        let data;
        const docNotEmpty = (doc.id, " => ", doc.data() != null);
        if (docNotEmpty) data = (doc.id, " => ", doc.data());
        context.setState({ user: doc.data() })
        context.fetchImages();
      })
    })
  }

  fetchImages() {
    const context = this;
    const image = [];
    let email;
    let db = firebase.firestore();
    let photosRef = db.collection('photos');
    let params = context.props.navigation.state.params;
    if (params.isSameProfile === true) {
      email = params.email;
    } else {
      email = params.searchedEmail
    }
    if (email) {
      photosRef.where('email', '==', email).where('isDeleted', '==', false).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          let data;
          const docNotEmpty = (doc.id, " => ", doc.data() != null);
          if (docNotEmpty) data = (doc.id, " => ", doc.data());
          image.push({
            URL: doc.data().url,
            dimensions: { width: 900, height: 1050 },
            item: doc.data()
          });
        })
        context.setState({ images: image, loading: false });
        context.fetchFollowersDetails()
      })
    } else {
      context.setState({ images: [], loading: false })
    }
  }

  fetchFollowersDetails() {
    const context = this;
    let followerCount = 0;
    let followingCount = 0;
    let db = firebase.firestore();
    db.collection("signup").doc(this.state.user.docRef).collection('following').get().then(function (followingSnapshot) {
      followingSnapshot.forEach(function (doc) {
        let data;
        const docNotEmpty = (doc.id, " => ", doc.data() != null);
        if (docNotEmpty) data = (doc.id, " => ", doc.data());
        if (!data.email.includes('removed') && !data.email.includes('cancelled')) {
          context.setState({ followingCount: ++followingCount })
        }
      })
    })
    db.collection("signup").doc(this.state.user.docRef).collection('followers').get().then(function (followerSnapshot) {
      followerSnapshot.forEach(function (doc) {
        let data;
        const docNotEmpty = (doc.id, " => ", doc.data() != null);
        if (docNotEmpty) data = (doc.id, " => ", doc.data());
        if (!data.email.includes('removed') && !data.email.includes('cancelled')) {
          context.setState({ followersCount: ++followerCount })
        }
      })
    })
  }

  componentDidUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    rol();
    this._unsubscribe();
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    return true;
  }

  confirmDelete(item, index) {
    if (this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.isSameProfile === true) {
      Alert.alert(
        //title
        'Confirmation',
        //body
        'Are you sure to delete this post?',
        [
          { text: 'Yes', onPress: () => this.deletePost(item) },
          { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
        ],
        { cancelable: false }
        //clicking out side of alert will not cancel
      );
    }
  }

  deletePost(selectedItem) {
    this.setState({ loading: true })
    let db = firebase.firestore();
    db.collection("savedCollections").doc(selectedItem.item.docRef).update({
      isDeleted: true
    })
    db.collection("photos").doc(selectedItem.item.docRef).update({
      isDeleted: true
    }).then(() => {
      this.fetchImages();
    })
  }


  updateSearch() {
    this.props.navigation.navigate('search', { navigation: this.props.navigation, email: this.props.navigation.state.params.email.trim() })
  };

  followPressed = () => {
    this.setState({ navProps: this.props.navigation.state.params });
    this.fetchCurrentUserDetails();
  }

  fetchCurrentUserDetails() {
    const context = this;
    let db = firebase.firestore();
    let userData;
    db.collection("signup").where('email', '==', this.state.navProps.email.trim()).get().then(function (userQuerySnapshot) {
      userQuerySnapshot.forEach(function (doc) {
        const docNotEmpty = (doc.id, " => ", doc.data() != null);
        if (docNotEmpty) {
          userData = (doc.id, " => ", doc.data());
          context.fetchSeachedUser(userData);
        }
      });
    });
  }

  fetchSeachedUser(userData) {
    const context = this;
    let db = firebase.firestore();
    let searchedUserData;
    db.collection("signup").where('email', '==', this.state.navProps.searchedEmail.trim()).get().then(function (searchedQuerySnapshot) {
      searchedQuerySnapshot.forEach(function (doc) {
        const docNotEmpty = (doc.id, " => ", doc.data() != null);
        if (docNotEmpty) {
          searchedUserData = (doc.id, " => ", doc.data());
          context.updateFollowers(userData, searchedUserData)
        }
      });
    });

  }

  updateFollowers(userData, searchedUserData) {
    let db = firebase.firestore();
    if (this.state.followText === 'Follow') {
      this.setState({ followText: 'Following' });
      this.setState({ whisperText: 'Request Pending' });
      db.collection("signup").doc(userData.docRef).collection('following').doc(searchedUserData.email.trim()).set({ email: searchedUserData.email.trim() }).then((dat) => console.log('done'))
      db.collection("signup").doc(searchedUserData.docRef).collection('followers').doc(userData.email.trim()).set({ email: userData.email.trim() })
    } else {
      this.setState({ followText: 'Follow' });
      this.setState({ whisperText: 'Whisper' });
      db.collection("signup").doc(userData.docRef).collection('following').doc(searchedUserData.email.trim()).update({ email: searchedUserData.email.trim() + '_removed' }).then((dat) => console.log('done'))
      db.collection("signup").doc(searchedUserData.docRef).collection('followers').doc(userData.email.trim()).update({ email: userData.email.trim() + '_removed' })
    }
  }

  handleWhisper() {
    const searchedUserData = this.props.navigation.state.params;
    if (searchedUserData.isPrivateAccount === true) {
      const saveObj = {
        email: userData.email.trim(),
        fullName: userData.fullName,
        profilePicture: userData.profilePicture,
        docRef: searchedUserData.docRef
      }
      db.collection("signup").doc(userData.docRef).collection('pendingFollowers').doc(userData.email.trim()).set(saveObj);
      this.props.navigation.navigate('chatScreen', { selectedItem: this.state.user, userDetails: this.state.user, email: this.props.navigation.state.params.email })
    } else {
      this.props.navigation.navigate('chatScreen', { selectedItem: this.state.user, userDetails: this.state.user, email: this.props.navigation.state.params.email })
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff6f2' }}>
        {/* {this.props.navigation.state.params.isSameProfile === true ? <View></View> : (
          <TouchableOpacity onPress={() => this.props.navigation.navigate('chatScreen', { selectedItem: this.state.user, userDetails: this.state.user, email: this.props.navigation.state.params.email })}
            style={styles.fabDiv}>
            <View style={styles.fab}>
              <FontAwesome5 style={styles.fabIcon} name='telegram-plane' size={35} />
            </View>
          </TouchableOpacity>)} */}
        <View style={styles.header}>
          <Text style={styles.inputSearch}
          >myth</Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('homeFixed', { email: this.props.navigation.state.params.email })} >
            <Icon name={'home'} size={30} color="#fff" />
          </TouchableOpacity>
          {/* <SearchBar searchIcon={{ color: 'white' }} containerStyle={{ backgroundColor: '#EE6E3D', height: hp('6%'), borderBottomWidth: 0, borderTopWidth: 0 }} inputContainerStyle={styles.inputSearch}
            placeholderTextColor="#fff"
            inputStyle={{ color: '#fff' }}
            onFocus={() => this.updateSearch()}
          /> */}
        </View>
        <ScrollView>
          <View style={{ backgroundColor: '#fff6f2', paddingBottom: wp('3%') }}>
            <View style={{ flexDirection: 'row', marginLeft: wp('40%'), alignItems: 'center', marginTop: wp('-10%') }}>
              <Image
                source={{ uri: this.state.user.profilePicture }}
                style={{
                  width: wp('20%'),
                  height: hp('10%'),
                  resizeMode: 'cover',
                  borderRadius: wp('5%'), borderWidth: 1.5
                }}
              />
              <Text style={styles.profileName}>{this.state.user.fullName}</Text>
              <Text style={styles.description}>{this.state.user.description}</Text>
            </View>
            {this.props.navigation.state.params.isSameProfile === true ?
              <View style={{ marginLeft: wp('70%') }}>
                <TouchableOpacity style={{ marginBottom: wp('5%'), marginTop: wp('-15%'), marginLeft: wp('-10%') }} onPress={() => this.props.navigation.navigate('editProfile', { email: this.props.navigation.state.params.email })}>

                </TouchableOpacity></View> : <></>}



          </View>
          {this.props.navigation.state.params.isSameProfile === false ?
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.following}>
                <TouchableOpacity onPress={() => this.followPressed()}>
                  <Text style={styles.followingtext}>{this.state.followText}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.following}>
                <TouchableOpacity onPress={() => this.handleWhisper()}>
                  <Text style={styles.followingtext1}>{this.state.whisperText}</Text>
                </TouchableOpacity>
              </View>
            </View> : <View></View>}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => this.this.props.navigation.navigate('editProfile', { email: this.props.navigation.state.params.email })}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', marginBottom: '-15%', justifyContent: 'center', alignItems: 'center' }}>

            <Text style={styles.followBox1}>{this.state.followersCount}</Text>
            <Text style={styles.followBox2}>{this.state.followingCount}</Text>
            <Text style={styles.followBox3}>{this.state.images.length}</Text>

          </View>

          <View style={{ flexDirection: 'row', marginBottom: '-20%' }}>
            <Text style={styles.followBox4}>Followers</Text>
            <Text style={styles.followBox5}>Following</Text>
            <Text style={styles.followBox6}>Posts</Text>
          </View>

          <View style={{ padding: 10, marginTop: wp('20%'), }}>
            {this.state.loading == true ? (
              <View style={{ flex: 1, marginBottom: '40%', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color='red' />
              </View>
            ) : (
                this.props.navigation.state.params.isSameProfile === true ?
                  <PostTab screenProps={{ navigation: this.props.navigation, email: this.state.user.email.trim() }}></PostTab> :
                  <OtherPostTab screenProps={{ navigation: this.props.navigation, email: this.state.user.email.trim() }}>/</OtherPostTab>
              )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: wp('80%'),
    marginLeft: wp('10%'),
    alignItems: 'center',
    marginTop: wp('3%'),
    marginBottom: wp('-5%'),
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: '#EE6E3D',
  },
  buttonText: {
    color: '#EE6E3D',
    width: wp('80%'),
    alignItems: 'center',
    fontSize: hp('2%'),
    marginLeft: wp('55%'),
    paddingVertical: 8,
    paddingHorizontal: 15,
    fontWeight: 'bold',
  },
  fabDiv: {
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    right: 0,
    margin: 15,
  },
  fab: {
    backgroundColor: '#EE6E3D',
    alignItems: 'center',
    width: wp('15%'),
    borderRadius: wp('10%'),
    justifyContent: 'center'
  },
  fabIcon: {
    color: '#fff',
    padding: wp('3%'),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EE6E3D',
    padding: 10,
  },
  backArrow: {
    color: '#EE6E3D',
    fontSize: hp('3%'),
    marginTop: 5,
  },
  inputSearch: {
    width: wp('70%'),
    paddingVertical: 2,
    borderBottomWidth: wp('0.1%'),
    borderBottomColor: '#fff',
    backgroundColor: '#EE6E3D',
    fontSize: 20,
    color: '#fff',
    height: hp('4%'),
    fontStyle: 'italic',
    paddingLeft: wp('40%'),
    backgroundColor: '#EE6E3D', height: hp('4%'), borderBottomWidth: 0, borderTopWidth: 0
  },
  profileName: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: '#EE6E3D',
    marginLeft: wp('-18%'),
    alignItems: 'center',
    marginTop: wp('10%'),
    marginBottom: wp('-20%'),
  },
  description: {
    fontSize: hp('2%'),

    color: 'black',
    marginLeft: wp('-37%'),
    marginTop: wp('45%'),

  },
  followBox1: {

    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#EE6E3D',
    marginLeft: wp('5%'),
    justifyContent: 'space-between',
    marginBottom: wp('-10%'),
  },
  followBox2: {

    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#EE6E3D',
    marginLeft: wp('30%'),
    justifyContent: 'space-between',
    marginBottom: wp('-10%'),
  },
  followBox3: {

    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#EE6E3D',
    marginLeft: wp('30%'),
    justifyContent: 'space-between',
    marginBottom: wp('-8%'),
    marginTop: wp('2%'),
  },
  followBox4: {

    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#EE6E3D',
    marginLeft: wp('12%'),
    justifyContent: 'space-between',
    marginTop: wp('35%'),
  },
  followBox5: {

    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#EE6E3D',
    marginLeft: wp('15%'),
    justifyContent: 'space-between',
    marginTop: wp('35%'),
  },
  followBox6: {

    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#EE6E3D',
    marginLeft: wp('17%'),
    justifyContent: 'space-between',
    marginTop: wp('35%'),
  },
  posts: {

    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: 'black',
    marginLeft: wp('15%'),
    justifyContent: 'space-between',
    marginTop: wp('30%'),
  },
  diary: {

    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: 'black',
    marginLeft: wp('50%'),
    justifyContent: 'space-between',
    marginTop: wp('30%'),
  },
  following: {
    width: wp('35%'),
    backgroundColor: '#EE6E3D',
    marginLeft: wp('10%'),
    alignItems: 'center',
    marginTop: wp('1%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#EE6E3D',
  },
  followingtext: {
    color: 'white',
    width: wp('80%'),
    alignItems: 'center',
    fontSize: hp('2%'),
    marginLeft: wp('50%'),
    paddingVertical: 8,
    paddingHorizontal: 25,
    fontWeight: 'bold',
  },
  followingtext1: {
    color: 'white',
    width: wp('80%'),
    alignItems: 'center',
    fontSize: hp('2%'),
    marginLeft: wp('50%'),
    paddingVertical: 8,
    paddingHorizontal: 25,
    fontWeight: 'bold',
  },
  follow: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  countDiv: {
    position: 'absolute',
    paddingLeft: wp('32%'),
    paddingRight: wp('20%'),
    top: wp('20%'),
    zIndex: 1,
    flexDirection: 'row',
    backgroundColor: '#EE6E3D',
  },
  countDivs: {
    position: 'absolute',
    marginLeft: wp('56%'),
    zIndex: 1,
    marginTop: wp('27.5%'),

  },
  followTextStyle: {
    marginTop: wp('6%'),
    color: '#EE6E3D',
  },
  but: {
    width: wp('30%'),
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 35,
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom: wp('2%')
  },
  butFollow: {
    width: wp('30%'),
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 35,
    borderWidth: 1,
    borderColor: '#fff',
    marginLeft: wp('2%'),
    marginBottom: wp('2%')
  },
  butText: {
    color: '#EE6E3D',
    width: wp('50%'),
    alignItems: 'center',
    fontSize: hp('3%'),
    marginLeft: wp('28%'),
    paddingVertical: wp('7%'),
    paddingHorizontal: 40,

  },
  circle: {
    width: wp('14%'),
    height: hp('7%'),
    borderRadius: 50,
    backgroundColor: '#fff',
    zIndex: 1,
    alignItems: 'center',
    borderWidth: wp('1.5%'),
    borderColor: '#EE6E3D',
    bottom: wp('5%'),
  },
  circleFirst: {
    width: wp('14%'),
    top: wp('3%'),
    height: hp('7%'),
    borderRadius: 50,
    backgroundColor: '#fff',
    zIndex: 1,
    alignItems: 'center',
    borderWidth: wp('1.5%'),
    borderColor: '#EE6E3D'
  }
});
