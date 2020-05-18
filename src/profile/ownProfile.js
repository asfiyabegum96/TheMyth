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
  Alert,
  ActivityIndicator
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

const Jaguar = '#22222C';

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
        this.setState({ followText: 'Unfollow' })
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
        context.setState({ followingCount: ++followingCount })
      })
    })
    db.collection("signup").doc(this.state.user.docRef).collection('followers').get().then(function (followerSnapshot) {
      followerSnapshot.forEach(function (doc) {
        let data;
        const docNotEmpty = (doc.id, " => ", doc.data() != null);
        if (docNotEmpty) data = (doc.id, " => ", doc.data());
        context.setState({ followersCount: ++followerCount })
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
      this.setState({ followText: 'Unfollow' });
      if (searchedUserData.isPrivateAccount === true) {
        const saveObj = {
          email: userData.email.trim(),
          fullName: userData.fullName,
          profilePicture: userData.profilePicture,
          docRef: searchedUserData.docRef
        }
        db.collection("signup").doc(searchedUserData.docRef).collection('pendingFollowers').doc(userData.email.trim()).set(saveObj)
      }
      db.collection("signup").doc(userData.docRef).collection('following').doc(searchedUserData.email.trim()).set({ email: searchedUserData.email.trim() }).then((dat) => alert('done'))
      db.collection("signup").doc(searchedUserData.docRef).collection('followers').doc(userData.email.trim()).set({ email: userData.email.trim() })

    } else {
      this.setState({ followText: 'Follow' })
      db.collection("signup").doc(userData.docRef).collection('following').doc(searchedUserData.email.trim()).update({ email: searchedUserData.email.trim() + '_removed' }).then((dat) => alert('done'))
      db.collection("signup").doc(searchedUserData.docRef).collection('followers').doc(userData.email.trim()).update({ email: userData.email.trim() + '_removed' })

    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff2e7' }}>
        {this.props.navigation.state.params.isSameProfile === true ? <View></View> : (
          <TouchableOpacity onPress={() => this.props.navigation.navigate('chatScreen', { selectedItem: this.state.user, userDetails: this.state.user, email: this.props.navigation.state.params.email })}
            style={styles.fabDiv}>
            <View style={styles.fab}>
              <FontAwesome5 style={styles.fabIcon} name='telegram-plane' size={35} />
            </View>
          </TouchableOpacity>)}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('homeFixed', { email: this.props.navigation.state.params.email })} >
            <Icon name={'home'} size={30} color="#FF7200" />
          </TouchableOpacity>
          <SearchBar containerStyle={{ backgroundColor: 'fff2e7', height: hp('6%'), borderBottomWidth: 0, borderTopWidth: 0 }} inputContainerStyle={styles.inputSearch}
            placeholder="Search"
            placeholderTextColor="#FF7200"
            inputStyle={{ color: '#FF7200' }}
            onFocus={() => this.updateSearch()}
          />
          <TouchableOpacity onPress={() => this.props.navigation.navigate('sideNavigator', { email: this.props.navigation.state.params.email })}>
            <MaterialCommunityIcons name="settings" size={35} color="#FF7200" />
          </TouchableOpacity>
        </View>
        <View style={styles.countDiv}>
          <CollapseBody>

          </CollapseBody>
          <Collapse style={{ flexDirection: 'row' }}>
            <CollapseHeader>
              <View style={styles.countDesign}>
                <Text style={{
                  fontSize: wp('5%'),
                  color: '#FF7200'
                }}>{this.state.images.length}</Text>
              </View>
            </CollapseHeader>
            <CollapseBody style={{ alignItems: 'center', justifyContent: 'center', }}>
              <View style={styles.countTextDesign}>
                <Text style={{
                  fontSize: wp('5%'),
                  color: '#FF7200'
                }}>Posts</Text>
              </View>
            </CollapseBody>
          </Collapse>
          <Collapse style={{ flexDirection: 'row' }}>
            <CollapseHeader>
              <View style={styles.countDesign}>
                <Text style={{
                  fontSize: wp('5%'),
                  color: '#FF7200'
                }}>{this.state.followersCount}</Text>
              </View>
            </CollapseHeader>
            <CollapseBody style={{ alignItems: 'center', justifyContent: 'center', }}>
              <View style={styles.countTextDesign}>
                <Text style={{
                  fontSize: wp('5%'),
                  color: '#FF7200'
                }}>Followers</Text>
              </View>
            </CollapseBody>
          </Collapse>
          <Collapse style={{ flexDirection: 'row' }}>
            <CollapseHeader>
              <View style={styles.countDesign}>
                <Text style={{
                  fontSize: wp('5%'),
                  color: '#FF7200'
                }}>{this.state.followingCount}</Text>
              </View>
            </CollapseHeader>
            <CollapseBody style={{ alignItems: 'center', justifyContent: 'center', }}>
              <View style={styles.countTextDesign}>
                <Text style={{
                  fontSize: wp('5%'),
                  color: '#FF7200'
                }}>Following</Text>
              </View>
            </CollapseBody>
          </Collapse>
        </View>
        <ScrollView>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ padding: 20, }}>
              <UserAvatar size="100" name="Avishay Bar"
                src={this.state.user.profilePicture} />
            </View>
            <View style={{ padding: 20 }} >
              <Text style={styles.profileName}>{this.state.user.fullName}</Text>
              <Text style={{
                fontSize: hp('2.5%'),
                marginLeft: 4,
              }}>{this.state.user.description}</Text>
              {this.props.navigation.state.params.isSameProfile === true ? <View></View> :
                <TouchableOpacity onPress={() => { this.followPressed() }}>
                  <View style={styles.follow}>
                    <Text style={{
                      color: '#FF7200',
                      fontSize: 17,
                    }}>{this.state.followText}</Text>
                  </View>
                </TouchableOpacity>
              }
            </View>
          </View>
          <View style={{ padding: 10 }}>
            {this.state.loading == true ? (
              <View style={{ flex: 1, marginBottom: '40%', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color='red' />
              </View>
            ) : (
                <MasonryList
                  backgroundColor={'#fff2e7'}
                  onRefresh={this.fetchImages}
                  columns={3}
                  images={this.state.images}
                  onLongPressImage={(item, index) => this.confirmDelete(item, index)}
                  onPressImage={(item) => this.props.navigation.navigate('mainFeed', { selectedItem: item, email: this.props.navigation.state.params.email.trim(), viewSpecificPhotos: true })}
                />)}
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
    backgroundColor: '#fff',
    alignItems: 'center',
    width: wp('15%'),
    borderRadius: wp('10%'),
    justifyContent: 'center'
  },
  fabIcon: {
    color: '#FF7200',
    padding: wp('3%'),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff2e7',
    padding: 10,
  },
  backArrow: {
    color: '#FF7200',
    fontSize: hp('3%'),
    marginTop: 5,
  },
  inputSearch: {
    width: wp('70%'),
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#FF7200',
    backgroundColor: '#fff2e7',
    fontSize: 20,
    color: '#FF7200',
    height: hp('4%')
  },
  profileName: {
    fontSize: hp('4%'),
    fontWeight: 'bold',
  },
  follow: {
    marginTop: 10,
    width: wp('30%'),
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  countDiv: {
    position: 'absolute',
    right: 0,
    top: 70,
    zIndex: 1
  },
  countDesign: {
    backgroundColor: '#fff2e7',
    paddingLeft: wp('3%'),
    paddingVertical: wp('1%'),
    borderTopLeftRadius: wp('2%'),
    borderBottomLeftRadius: wp('2%')
  },
  countTextDesign: {
    backgroundColor: '#fff2e7',
    paddingLeft: wp('1.5%'),
    paddingRight: wp('2%'),
    paddingVertical: wp('1%'),
    borderTopRightRadius: wp('2%'),
    borderBottomRightRadius: wp('2%')
  },
  coutnText: {
    fontSize: hp('2%'),
  },
  ZigZagContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: hp('35%'),
  },
  zigZagImage2: {
    position: 'relative',
    top: 30,
  },
  InlineImg: {
    width: wp('40%'),
    height: hp('30%'),
    borderWidth: 1,
    borderColor: '#FF7200',
    borderRadius: 20,
  },

});

