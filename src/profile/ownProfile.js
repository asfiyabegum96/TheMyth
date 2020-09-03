import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image
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



export default class profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: '',
      images: [],
      loading: true,
      navProps: props.navigation.state.params,
      followText: 'Follow',
      followersCount: 0,
      followingCount: 0
    }
    this.baseState = this.state;
  }

  componentDidMount() {
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
        this.setState({ followText: 'Following' })
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

  componentWillUnMount() {
    rol();
    this._unsubscribe();
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
      db.collection("signup").doc(userData.docRef).collection('following').doc(searchedUserData.email.trim()).set({ email: searchedUserData.email.trim() }).then((dat) => console.log('done'))
      db.collection("signup").doc(searchedUserData.docRef).collection('followers').doc(userData.email.trim()).set({ email: userData.email.trim() })

    } else {
      this.setState({ followText: 'Follow' })
      db.collection("signup").doc(userData.docRef).collection('following').doc(searchedUserData.email.trim()).update({ email: searchedUserData.email.trim() + '_removed' }).then((dat) => console.log('done'))
      db.collection("signup").doc(searchedUserData.docRef).collection('followers').doc(userData.email.trim()).update({ email: userData.email.trim() + '_removed' })

    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff6f2' }}>
        {this.props.navigation.state.params.isSameProfile === true ? <View></View> : (
          <TouchableOpacity onPress={() => this.props.navigation.navigate('chatScreen', { selectedItem: this.state.user, userDetails: this.state.user, email: this.props.navigation.state.params.email })}
            style={styles.fabDiv}>
            <View style={styles.fab}>
              <FontAwesome5 style={styles.fabIcon} name='telegram-plane' size={35} />
            </View>
          </TouchableOpacity>)}
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
            <View style={{ flexDirection: 'row', marginLeft: wp('37%'), alignItems: 'center', marginTop: wp('10%') }}>
              <Image
                source={{ uri: this.state.user.profilePicture }}
                style={{
                  width: wp('30%'),
                  height: hp('15%'),
                  resizeMode: 'cover',
                  borderRadius: wp('5%'), borderWidth: 1.5, borderColor: 'white'
                }}
              />
              <Text style={styles.profileName}>{this.state.user.fullName}</Text>
            </View>
            {this.props.navigation.state.params.isSameProfile === true ?
              <View style={{ marginLeft: wp('70%') }}>
                <TouchableOpacity style={{ marginBottom: wp('5%'), marginTop: wp('-15%'), marginLeft: wp('-10%') }} onPress={() => this.props.navigation.navigate('editProfile', { email: this.props.navigation.state.params.email })}>
                  <Image
                    source={require('../images/person.png')}
                    style={{
                      width: wp('15%'),
                      height: wp('15%'),

                      resizeMode: 'cover',
                    }} />
                </TouchableOpacity></View> : <></>}
              <View style={{ flexDirection: 'row', marginLeft: wp('40%'), marginTop: wp('10%') }}>
                <Text style={{
                  fontSize: hp('2%'),
                  color: 'black',
                }} >{this.state.user.description}</Text>
              </View>
          </View>
          {this.props.navigation.state.params.isSameProfile === false ?
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.following}>
                <TouchableOpacity onPress={() => this.followPressed()}>
                  <Text style={styles.followingtext}>{this.state.followText}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.following}>
                <TouchableOpacity >
                  <Text style={styles.followingtext1}>Whisper</Text>
                </TouchableOpacity>
              </View>
            </View> : <View></View>}
          <View style={{ flex: 1, flexDirection: 'row', marginBottom: '-15%', justifyContent: 'center', alignItems: 'center' }}>

            <Text style={styles.followBox1}>{this.state.followersCount}</Text>
            <Text style={styles.followBox2}>{this.state.followingCount}</Text>
            <Text style={styles.followBox3}>{this.state.images.length}</Text>

          </View>

          <View style={{ flexDirection: 'row', marginBottom: '-20%' }}>
            <Text style={styles.followBox4}>Followers</Text>
            <Text style={styles.followBox5}>Following</Text>
            <Text style={styles.followBox6}>Post</Text>
          </View>

          <View style={{ padding: 10, marginTop: wp('32%'), }}>
            {this.state.loading == true ? (
              <View style={{ flex: 1, marginBottom: '40%', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color='red' />
              </View>
            ) : (
                <PostTab screenProps={{ navigation: this.props.navigation, email: this.state.user.email.trim() }}></PostTab>
              )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    marginLeft: wp('-23%'),
    marginTop: wp('20%'),
    marginBottom: wp('-20%'),

  },

  followBox1: {

    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#EE6E3D',
    marginLeft: wp('3%'),
    justifyContent: 'space-between',
    marginBottom: wp('-10%'),
  },
  followBox2: {

    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#EE6E3D',
    marginLeft: wp('21%'),
    justifyContent: 'space-between',
    marginBottom: wp('-10%'),
  },
  followBox3: {

    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#EE6E3D',
    marginLeft: wp('20%'),
    justifyContent: 'space-between',
    marginBottom: wp('-10%'),
  },
  followBox4: {

    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#EE6E3D',
    marginLeft: wp('15%'),
    justifyContent: 'space-between',
    marginTop: wp('35%'),
  },
  followBox5: {

    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#EE6E3D',
    marginLeft: wp('11%'),
    justifyContent: 'space-between',
    marginTop: wp('35%'),
  },
  followBox6: {

    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#EE6E3D',
    marginLeft: wp('14%'),
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
    width: wp('40%'),
    backgroundColor: '#EE6E3D',
    marginLeft: wp('7%'),
    alignItems: 'center',
    marginTop: wp('1%'),
    borderRadius: wp('2%'),
    borderWidth: 2,
    borderColor: '#EE6E3D',
  },
  followingtext: {
    color: 'white',
    width: wp('80%'),
    alignItems: 'center',
    fontSize: hp('2%'),
    marginLeft: wp('48%'),
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
