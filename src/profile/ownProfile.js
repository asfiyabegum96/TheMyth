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
  BackHandler,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { GoogleSignin } from '@react-native-community/google-signin';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import UserAvatar from 'react-native-user-avatar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import MasonryList from 'react-native-masonry-list';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import firebase from 'react-native-firebase';
import {SearchBar} from 'react-native-elements';
import main from '../authentication/styles/main';
import PostTab from './postTab';
import OtherPostTab from './otherPostTab';
import {Header} from 'react-native-elements';

export default class profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      images: [],
      loading: true,
      navProps: props.navigation.state.params,
      followText: 'Follow',
      whisperText: 'Whisper',
      followersCount: 0,
      followingCount: 0,
    };
    this.baseState = this.state;
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    loc(this);
    this._unsubscribe = this.props.navigation.addListener('willFocus', () => {
      this.setState(this.baseState);
      this.fetchUserDetails();
    });
    this.fetchUserDetails();

    GoogleSignin.configure({
      webClientId:
        '119026447603-caakapp6njtis28ujb4qs7b5dgqkh9el.apps.googleusercontent.com',
    });
  }

  async fetchUserDetails() {
    const context = this;
    //check google user
    const userInfo = await GoogleSignin.getCurrentUser();
    console.log('userInfo', userInfo.user);
    let profilePicture = '',
    if(userInfo.user) {
      profilePicture = userInfo.user.photo;
    }

    let email;
    let params = this.props.navigation.state.params;
    let db = firebase.firestore();
    let photosRef = db.collection('signup');
    if (params.isSameProfile === true) {
      email = params.email;
    } else {
      email = params.searchedEmail;
      if (params.isFollowed === true) {
        this.setState({followText: 'Following'});
      }
      if (params.isPending === true) {
        this.setState({whisperText: 'Pending'});
      }
    }
    photosRef
      .where('email', '==', email)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          let data;
          const docNotEmpty = (doc.id, ' => ', doc.data() != null);
          if (docNotEmpty) data = (doc.id, ' => ', doc.data());
          console.log('this.state.navProps', context.state.navProps)
          console.log('user', doc.data())
          let user = doc.data();
          if(profilePicture) {
            user.profilePicture = profilePicture;
          }
          context.setState({user});
          context.fetchImages();
        });
      });
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
      email = params.searchedEmail;
    }
    if (email) {
      photosRef
        .where('email', '==', email)
        .where('isDeleted', '==', false)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            let data;
            const docNotEmpty = (doc.id, ' => ', doc.data() != null);
            if (docNotEmpty) data = (doc.id, ' => ', doc.data());
            image.push({
              URL: doc.data().url,
              dimensions: {
                width: 900,
                height: 1050,
              },
              item: doc.data(),
            });
          });
          context.setState({
            images: image,
            loading: false,
          });
          context.fetchFollowersDetails();
        });
    } else {
      context.setState({
        images: [],
        loading: false,
      });
    }
  }

  fetchFollowersDetails() {
    const context = this;
    let followerCount = 0;
    let followingCount = 0;
    let db = firebase.firestore();
    db.collection('signup')
      .doc(this.state.user.docRef)
      .collection('following')
      .get()
      .then(function(followingSnapshot) {
        followingSnapshot.forEach(function(doc) {
          let data;
          const docNotEmpty = (doc.id, ' => ', doc.data() != null);
          if (docNotEmpty) data = (doc.id, ' => ', doc.data());
          if (
            !data.email.includes('removed') &&
            !data.email.includes('cancelled')
          ) {
            context.setState({
              followingCount: ++followingCount,
            });
          }
        });
      });
    db.collection('signup')
      .doc(this.state.user.docRef)
      .collection('followers')
      .get()
      .then(function(followerSnapshot) {
        followerSnapshot.forEach(function(doc) {
          let data;
          const docNotEmpty = (doc.id, ' => ', doc.data() != null);
          if (docNotEmpty) data = (doc.id, ' => ', doc.data());
          if (
            !data.email.includes('removed') &&
            !data.email.includes('cancelled')
          ) {
            context.setState({
              followersCount: ++followerCount,
            });
          }
        });
      });
  }

  componentDidUnMount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    rol();
    this._unsubscribe();
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    return true;
  }

  confirmDelete(item, index) {
    if (
      this.props.navigation.state &&
      this.props.navigation.state.params &&
      this.props.navigation.state.params.isSameProfile === true
    ) {
      Alert.alert(
        //title
        'Confirmation',
        //body
        'Are you sure to delete this post?',
        [
          {
            text: 'Yes',
            onPress: () => this.deletePost(item),
          },
          {
            text: 'No',
            onPress: () => console.log('No Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: false},
        //clicking out side of alert will not cancel
      );
    }
  }

  deletePost(selectedItem) {
    this.setState({loading: true});
    let db = firebase.firestore();
    db.collection('savedCollections')
      .doc(selectedItem.item.docRef)
      .update({
        isDeleted: true,
      });
    db.collection('photos')
      .doc(selectedItem.item.docRef)
      .update({
        isDeleted: true,
      })
      .then(() => {
        this.fetchImages();
      });
  }

  updateSearch() {
    this.props.navigation.navigate('search', {
      navigation: this.props.navigation,
      email: this.props.navigation.state.params.email.trim(),
    });
  }

  followPressed = () => {
    this.setState({
      navProps: this.props.navigation.state.params,
    });
    this.fetchCurrentUserDetails(true);
  };

  fetchCurrentUserDetails(followPressed) {
    const context = this;
    let db = firebase.firestore();
    let userData;
    db.collection('signup')
      .where('email', '==', this.state.navProps.email.trim())
      .get()
      .then(function(userQuerySnapshot) {
        userQuerySnapshot.forEach(function(doc) {
          const docNotEmpty = (doc.id, ' => ', doc.data() != null);
          if (docNotEmpty) {
            userData = (doc.id, ' => ', doc.data());
            context.fetchSeachedUser(userData, followPressed);
          }
        });
      });
  }

  fetchSeachedUser(userData, followPressed) {
    const context = this;
    let db = firebase.firestore();
    let searchedUserData;
    db.collection('signup')
      .where('email', '==', this.state.navProps.searchedEmail.trim())
      .get()
      .then(function(searchedQuerySnapshot) {
        searchedQuerySnapshot.forEach(function(doc) {
          const docNotEmpty = (doc.id, ' => ', doc.data() != null);
          if (docNotEmpty) {
            searchedUserData = (doc.id, ' => ', doc.data());
            if (followPressed) {
              context.updateFollowers(userData, searchedUserData);
            } else {
              context.fetchFollowing(userData, searchedUserData);
            }
          }
        });
      });
  }

  fetchFollowing(userData, searchedUserData) {
    const context = this;
    let db = firebase.firestore();
    let photosRef = db.collection('signup');
    photosRef
      .doc(userData.docRef)
      .collection('following')
      .get()
      .then(function(followerSnapshot) {
        followerSnapshot.forEach(function(followerDoc) {
          const docNotEmpty = (followerDoc.id,
          ' => ',
          followerDoc.data() != null);
          if (docNotEmpty) {
            if (searchedUserData) {
              if (
                searchedUserData.email.trim() ===
                followerDoc.data().email.trim()
              ) {
                searchedUserData.isFollowing = true;
              }
            }
          }
        });
        context.updateWhisper(userData, searchedUserData);
      });
  }

  updateFollowers(userData, searchedUserData) {
    let db = firebase.firestore();
    if (this.state.followText === 'Follow') {
      const followerCount = this.state.followersCount + 1;
      this.setState({
        followText: 'Following',
        followersCount: followerCount,
      });
      if (searchedUserData.isPrivateAccount === true) {
        this.setState({whisperText: 'Pending'});
        const saveObj = {
          email: userData.email.trim(),
          fullName: userData.fullName,
          profilePicture: userData.profilePicture,
          docRef: searchedUserData.docRef,
        };
        db.collection('signup')
          .doc(searchedUserData.docRef)
          .collection('pendingFollowers')
          .doc(userData.email.trim())
          .set(saveObj);
      }
      db.collection('signup')
        .doc(userData.docRef)
        .collection('following')
        .doc(searchedUserData.email.trim())
        .set({
          email: searchedUserData.email.trim(),
        })
        .then(dat => console.log('done'));
      db.collection('signup')
        .doc(searchedUserData.docRef)
        .collection('followers')
        .doc(userData.email.trim())
        .set({email: userData.email.trim()});
    } else {
      if (this.state.whisperText === 'Pending') {
        const saveObj = {
          email: userData.email.trim() + '_removed',
          fullName: userData.fullName,
          profilePicture: userData.profilePicture,
          docRef: searchedUserData.docRef,
        };
        this.setState({followText: 'Follow'});
        db.collection('signup')
          .doc(searchedUserData.docRef)
          .collection('pendingFollowers')
          .doc(userData.email.trim())
          .update(saveObj);
      }
      const followerCount = this.state.followersCount - 1;
      this.setState({
        followText: 'Follow',
        followersCount: followerCount,
      });
      this.setState({whisperText: 'Whisper'});
      db.collection('signup')
        .doc(userData.docRef)
        .collection('following')
        .doc(searchedUserData.email.trim())
        .update({
          email: searchedUserData.email.trim() + '_removed',
        })
        .then(dat => console.log('done'));
      db.collection('signup')
        .doc(searchedUserData.docRef)
        .collection('followers')
        .doc(userData.email.trim())
        .update({
          email: userData.email.trim() + '_removed',
        });
    }
  }

  updateWhisper(userData, searchedUserData) {
    let db = firebase.firestore();
    if (searchedUserData.isPrivateAccount === true) {
      const saveObj = {
        email: userData.email.trim(),
        fullName: userData.fullName,
        profilePicture: userData.profilePicture,
        docRef: searchedUserData.docRef,
      };
      db.collection('signup')
        .doc(userData.docRef)
        .collection('pendingFollowers')
        .doc(userData.email.trim())
        .set(saveObj);
      this.props.navigation.navigate('chatScreen', {
        selectedItem: searchedUserData,
        userDetails: userData,
        email: this.props.navigation.state.params.email,
      });
    } else {
      this.props.navigation.navigate('chatScreen', {
        selectedItem: searchedUserData,
        userDetails: userData,
        email: this.props.navigation.state.params.email,
      });
    }
  }

  handleWhisper() {
    this.setState({
      navProps: this.props.navigation.state.params,
    });
    this.fetchCurrentUserDetails(false);
  }

  MyCustomLeftComponent = () => {
    return (
      <View style={{bottom: 12.5, flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('homeFixed', {
              email: this.props.navigation.state.params.email,
            })
          }>
          <FontAwesome5 name={'arrow-left'} size={25} color="#fff" />
        </TouchableOpacity>
        <Text
          style={{
            color: '#fff',
            fontWeight: '700',
            fontSize: 20,
            width: 200,
            paddingHorizontal: 15,
          }}>
          Your Profile
        </Text>
      </View>
    );
  };

  MyCustomCenterComponent = () => {
    return (
      <View style={{bottom: 12.5}}>
        <Text
          style={{
            color: '#fff',
            fontWeight: '700',
            fontSize: 20,
          }}>
          Your Profile
        </Text>
      </View>
    );
  };

  MyCustomRightComponent = () => {
    return (
      <TouchableOpacity
        style={{bottom: 12.5}}
        onPress={() =>
          this.props.navigation.navigate('settings', {
            email: this.props.navigation.state.params.email,
          })
        }>
        <Icon name={'cog'} size={30} color="#fff" />
      </TouchableOpacity>
    );
  };

  MyCustomLeftComponentOne = () => {
    return (
      <View style={{bottom: 15}}>
        <Text
          style={{
            color: '#fff',
            fontWeight: '700',
            fontSize: 20,
          }}>
          {this.state.user.fullName}
        </Text>
      </View>
    );
  };

  MyCustomRightComponentOne = () => {
    return (
      <TouchableOpacity
        style={{bottom: 15}}
        onPress={() =>
          this.props.navigation.navigate('settings', {
            email: this.props.navigation.state.params.email,
          })
        }>
        <Icon name={'cog'} size={30} color="#fff" />
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff6f2',
        }}>
        {/* {this.props.navigation.state.params.isSameProfile === true ? <View></View> : (
          <TouchableOpacity onPress={() => this.props.navigation.navigate('chatScreen', { selectedItem: this.state.user, userDetails: this.state.user, email: this.props.navigation.state.params.email })}
            style={styles.fabDiv}>
            <View style={styles.fab}>
              <FontAwesome5 style={styles.fabIcon} name='telegram-plane' size={35} />
            </View>
          </TouchableOpacity>)} */}
        {this.props.navigation.state &&
        this.props.navigation.state.params &&
        this.props.navigation.state.params.isSameProfile === true ? (
          <View style={styles.header}>
            <TouchableOpacity
              style={{
                marginLeft: wp('2%'),
                marginTop: wp('5%'),
                marginRight: wp('2%'),
              }}
              onPress={() =>
                this.props.navigation.navigate('homeFixed', {
                  email: this.props.navigation.state.params.email,
                })
              }>
              <FontAwesome5 name={'arrow-left'} size={25} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.inputText}>Your Profile</Text>
            <TouchableOpacity
              style={{marginTop: wp('5%'), marginRight: wp('5%')}}
              onPress={() =>
                this.props.navigation.navigate('settings', {
                  email: this.props.navigation.state.params.email,
                })
              }>
              <Icon name={'cog'} size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          // <Header
          //   leftComponent={<this.MyCustomLeftComponent />}
          //   // centerComponent={<this.MyCustomCenterComponent />}
          //   rightComponent={<this.MyCustomRightComponent />}
          //   containerStyle={{
          //     backgroundColor: '#EE6E3D',
          //     borderColor: '#EE6E3D',
          //     justifyContent: 'center',
          //     alignItems: 'center',
          //     height: 55,
          //   }}
          //   statusBarProps={{
          //     backgroundColor: '#000',
          //   }}
          // />
          // <View style={styles.header}>
          //   <Text style={styles.inputText}>{this.state.user.fullName}</Text>
          //   <TouchableOpacity
          //     style={{
          //       marginTop: wp('5%'),
          //       marginRight: wp('5%'),
          //     }}
          //     onPress={() =>
          //       this.props.navigation.navigate('settings', {
          //         email: this.props.navigation.state.params.email,
          //       })
          //     }>
          //     <Icon name={'cog'} size={30} color="#fff" />
          //   </TouchableOpacity>
          // </View>
          <Header
            leftComponent={<this.MyCustomLeftComponentOne />}
            rightComponent={<this.MyCustomRightComponentOne />}
            containerStyle={{
              backgroundColor: '#EE6E3D',
              borderColor: '#EE6E3D',
              justifyContent: 'center',
              alignItems: 'center',
              height: 55,
            }}
            statusBarProps={{
              backgroundColor: '#000',
            }}
          />
        )}
        {this.state.loading == true ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color="red" />
          </View>
        ) : (
          <ScrollView>
            <View
              style={{
                backgroundColor: '#fff6f2',
                paddingBottom: wp('3%'),
              }}>
              <View
                style={{
                  alignItems: 'center',
                  marginTop: wp('2%'),
                }}>
                <Image
                  source={{
                    uri: this.state.user.profilePicture,
                  }}
                  style={{
                    width: wp('20%'),
                    height: hp('10%'),
                    resizeMode: 'cover',
                    borderRadius: wp('5%'),
                    borderWidth: 1.5,
                  }}
                />
              </View>
              <View
                style={{
                  alignItems: 'center',
                  marginTop: wp('2%'),
                }}>
                <Text style={styles.profileName}>
                  {this.state.user.fullName}
                </Text>
                <Text style={styles.description}>
                  {this.state.user.description}
                </Text>
              </View>
              {this.props.navigation.state.params.isSameProfile === true ? (
                <View style={{marginLeft: wp('70%')}}>
                  <TouchableOpacity
                    style={{
                      marginBottom: wp('5%'),
                      marginTop: wp('-15%'),
                      marginLeft: wp('-10%'),
                    }}
                    onPress={() =>
                      this.props.navigation.navigate('editProfile', {
                        email: this.props.navigation.state.params.email,
                      })
                    }
                  />
                </View>
              ) : (
                <></>
              )}
            </View>
            {this.props.navigation.state.params.isSameProfile === false ? (
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: wp('-8%'),
                }}>
                <View style={styles.following}>
                  <TouchableOpacity onPress={() => this.followPressed()}>
                    <Text style={styles.followingtext}>
                      {this.state.followText}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.following}>
                  <TouchableOpacity onPress={() => this.handleWhisper()}>
                    <Text style={styles.followingtext1}>
                      {this.state.whisperText}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('editProfile', {
                      email: this.props.navigation.state.params.email,
                    })
                  }>
                  <Text style={styles.buttonText1}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
            )}
            {/* <View style={{ flex: 1, flexDirection: 'row', marginBottom: '-18%', justifyContent: 'center', alignItems: 'center' }}>

                <Text style={styles.followBox1}>{this.state.followersCount}</Text>
                <Text style={styles.followBox2}>{this.state.followingCount}</Text>
                <Text style={styles.followBox3}>{this.state.images.length}</Text>

              </View>

              <View style={{ flexDirection: 'row', height: wp('10%'), marginBottom: '-20%' }}>
                <Text style={styles.followBox4}>Followers</Text>
                <Text style={styles.followBox5}>Following</Text>
                <Text style={styles.followBox6}>Posts</Text>
              </View> */}
            {/* <View
              style={{
                alignItems: 'center',
                marginTop: wp('11%'),
                marginLeft: wp('5%'),
                width: wp('30%'),
              }}>
              <Text style={styles.followText}>Followers</Text>
              <Text style={styles.count}>{this.state.followersCount}</Text>
            </View>
            <View
              style={{
                marginTop: wp('-9%'),
                alignItems: 'center',
                marginLeft: wp('35%'),
                width: wp('30%'),
              }}>
              <Text style={styles.followText}>Following</Text>
              <Text style={styles.count}>{this.state.followingCount}</Text>
            </View>count
            <View
              style={{
                alignItems: 'center',
                marginTop: wp('-9%'),
                width: wp('30%'),
                marginLeft: wp('67%'),
              }}>
              <Text style={styles.followText}>Posts</Text>
              <Text style={styles.count}>{this.state.images.length}</Text>
            </View> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                paddingTop: 50,
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'column',
                }}>
                <Text style={styles.followText}>Followers</Text>
                <Text style={styles.count}>{this.state.followersCount}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'column',
                  marginHorizontal: 75,
                  right: 10,
                }}>
                <Text style={styles.followText}>Following</Text>
                <Text style={styles.count}>{this.state.followingCount}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flexDirection: 'column'}}>
                <Text style={styles.followText}>Posts</Text>
                <Text style={styles.count}>{this.state.images.length}</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                borderWidth: 0.5,
                borderColor: '#EE6E3D',
                width: '95%',
                alignSelf: 'center',
                top: 10,
              }}
            />
            <View
              style={{
                padding: 10,
              }}>
              {this.state.loading == true ? (
                <View
                  style={{
                    flex: 1,
                    marginBottom: '40%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator size="large" color="red" />
                </View>
              ) : this.props.navigation.state.params.isSameProfile === true ? (
                <PostTab
                  screenProps={{
                    navigation: this.props.navigation,
                    email: this.state.user.email.trim(),
                  }}
                />
              ) : (
                <OtherPostTab
                  screenProps={{
                    navigation: this.props.navigation,
                    email: this.state.user.email.trim(),
                  }}
                />
              )}
            </View>
          </ScrollView>
        )}
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
    marginBottom: wp('-8%'),
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
  buttonText1: {
    color: '#EE6E3D',
    alignSelf: 'center',
    fontSize: hp('2%'),
    paddingVertical: 8,
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
    justifyContent: 'center',
  },
  fabIcon: {
    color: '#fff',
    padding: wp('3%'),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EE6E3D',
    marginTop: wp('-2%'),
    padding: 1.5,
  },
  backArrow: {
    color: '#EE6E3D',
    fontSize: hp('3%'),
    marginTop: 5,
  },
  inputText: {
    width: wp('70%'),
    paddingVertical: 2,
    borderBottomWidth: wp('0.1%'),
    borderBottomColor: '#fff',
    fontSize: 17,
    color: '#fff',
    height: hp('7%'),
    paddingLeft: wp('5%'),
    paddingTop: wp('3.5%'),
    fontWeight: 'bold',
    marginTop: wp('2%'),
    backgroundColor: '#EE6E3D',
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  profileName: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: '#EE6E3D',
    textAlign: 'center',
    width: wp('80%'),
  },
  description: {
    fontSize: hp('2%'),
    width: wp('80%'),
    color: 'black',
    textAlign: 'center',
  },
  count: {
    fontSize: hp('1.5%'),
    fontWeight: 'bold',
    color: '#EE6E3D',
    textAlign: 'center',
  },
  followText: {
    fontSize: hp('1.5%'),
    fontWeight: 'bold',
    color: '#EE6E3D',
    textAlign: 'center',
    justifyContent: 'space-between',
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
    marginLeft: wp('28%'),
    justifyContent: 'space-between',
    marginBottom: wp('-8%'),
    marginTop: wp('2%'),
  },
  followBox4: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#EE6E3D',
    marginLeft: wp('10%'),
    justifyContent: 'space-between',
    marginTop: wp('35%'),
    height: wp('10%'),
  },
  followBox5: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#EE6E3D',
    marginLeft: wp('14%'),
    justifyContent: 'space-between',
    marginTop: wp('35%'),
    height: wp('10%'),
  },
  followBox6: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#EE6E3D',
    marginLeft: wp('17%'),
    justifyContent: 'space-between',
    marginTop: wp('35%'),
    height: wp('10%'),
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
    marginBottom: wp('2%'),
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
    marginBottom: wp('2%'),
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
    borderColor: '#EE6E3D',
  },
});
