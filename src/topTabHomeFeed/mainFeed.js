import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  Animated,
  Clipboard,
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import UserAvatar from 'react-native-user-avatar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Heart from './heart';
import firebase, {auth} from 'react-native-firebase';
import {Header} from 'react-native-elements';

export default class mainFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photoFeedData: [],
      photoFeedDataConst: [],
      lastVisible: {},
      feedRefresh: false,
      liked: false,
      loading: true,
      alreadyLiked: false,
      screenPropsPresent: false,
      ref: React.createRef(),
      scale: new Animated.Value(0),
      currentIndex: 0,
      animations: [
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
      ],
      email: '',
      // curLimit: 20
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  handleBackButtonClick() {
    BackHandler.exitApp();
    return true;
  }

  // Photo feed function
  photoFeedLoad = () => {
    this.setPhoto([]);
    this.loadFeed();
  };

  // Heart like trigger function
  onLikePost({item, index}) {
    const selectedPhoto = this.state.photoFeedData[index];
    this.updateLikes(selectedPhoto, index);
    this.setState({
      liked: !this.state.liked,
    });
    Animated.spring(this.state.scale, {
      toValue: 2,
      friction: 3,
    }).start(() => {
      this.state.scale.setValue(0);
    });
  }

  updateLikes(selectedPhoto, index) {
    if (selectedPhoto.isLiked) {
      let db = firebase.firestore();
      db.collection('photos')
        .doc(selectedPhoto.docRef)
        .update({
          likes: selectedPhoto.likes - 1,
        });
      db.collection('photos')
        .doc(selectedPhoto.docRef)
        .collection('likedUsers')
        .doc(this.state.email)
        .update({
          email: this.state.email + '_unliked',
        });
      this.state.photoFeedData[index].likes = selectedPhoto.likes - 1;
      this.state.photoFeedData[index].isLiked = false;
      this.setState({
        alreadyLiked: false,
        liked: false,
      });
    } else {
      let db = firebase.firestore();
      db.collection('photos')
        .doc(selectedPhoto.docRef)
        .update({
          likes: selectedPhoto.likes + 1,
        });
      this.state.photoFeedData[index].likes = selectedPhoto.likes + 1;
      this.state.photoFeedData[index].isLiked = true;
      db.collection('photos')
        .doc(selectedPhoto.docRef)
        .collection('likedUsers')
        .doc(this.state.email)
        .set({email: this.state.email.trim()});
      this.setState({
        alreadyLiked: true,
        liked: true,
      });
      this.getTokens(selectedPhoto);
    }
  }

  getTokens(selectedPhoto) {
    const context = this;
    let db = firebase.firestore();
    let photosRef = db.collection('signup');
    photosRef
      .where('email', '==', selectedPhoto.email)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          let data;
          const docNotEmpty = (doc.id, ' => ', doc.data() != null);
          if (docNotEmpty) data = (doc.id, ' => ', doc.data());
          if (
            context.props &&
            context.props.screenProps &&
            context.props.screenProps.userDetails &&
            context.props.screenProps.userDetails.token !== doc.data().token
          ) {
            context.sendNotifications(selectedPhoto, doc.data().token);
          }
        });
      });
  }

  async sendNotifications(selectedPhoto, token) {
    token = token && token.length ? token : [token];
    if (token.length) {
      const FIREBASE_API_KEY =
        'AAAAG7aHdPM:APA91bF4Yc6qbYxvK90mhU1XheWJbYFnCjVQ13RRUGoUT6oDcI5xiqgUZXsNzxuB0CFuflonomJbDoNtFm1hFyPSLWyAi1LGMAVJpUV_HOjN_xvYRzwrN4U7vw5TZU9x2PMRvcZoaBQ_';
      const message = {
        registration_ids: token,
        notification: {
          title: 'Myth',
          body: `One of your friend likes your photo!`,
          vibrate: 1,
          sound: 1,
          show_in_foreground: true,
          priority: 'high',
          content_available: true,
        },
      };

      let headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: 'key=' + FIREBASE_API_KEY,
      });

      let response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers,
        body: JSON.stringify(message),
      });
      response = await response.json();
      if (response.success) {
        let dateTime = Date.now();
        let timestamp = Math.floor(dateTime / 1000);
        const photoObj = this.props.screenProps.userDetails;
        const notificationObj = {
          docRef: selectedPhoto.docRef,
          title: 'Liked your post',
          body: `${photoObj.author} likes your photo!`,
          userAvatar: photoObj.userAvatar,
          postedTime: timestamp,
          email: photoObj.email,
        };
        firebase
          .firestore()
          .collection('notifications')
          .doc(selectedPhoto.docRef)
          .set(notificationObj)
          .then(function(docRef) {});
      }
    }
  }

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    loc(this);
    this.loadFeed();
  }

  componentWillUnMount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    rol();
  }

  // componentDidUpdate() {
  //   if(this.state.photoFeedData) {
  //     console.log('photofeed data', this.state.photoFeedData)
  //   }
  // }

  // Cover the timestamp to show in real minutes
  pluralCheck = s => {
    if (s == 1) {
      return ' ago';
    } else {
      return 's ago';
    }
  };
  timeConverter = timestamp => {
    let a = new Date(timestamp * 1000);
    let seconds = Math.floor((new Date() - a) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + ' year' + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + ' month' + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + ' day' + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + ' hour' + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + ' minute' + this.pluralCheck(interval);
    }
    return Math.floor(seconds) + ' second' + this.pluralCheck(seconds);
  };

  // Fetch data from the database and display in the view

  loadFeed = () => {
    this.setState({
      feedRefresh: true,
<<<<<<< HEAD
      photoFeedData: []
=======
      photoFeedLoad: [],
>>>>>>> 621082db57fc895e46c024a53e035e3f1501ea84
    });
    let viewSpecificPhotos = false;
    let url = 'photos';
    let email, selectedEmail;
    if (
      this.props.navigation &&
      this.props.navigation.state &&
      this.props.navigation.state.params.email
    ) {
      email = this.props.navigation.state.params.email;
      selectedEmail = this.props.navigation.state.params.selectedItem.item
        .email;
      url =
        this.props.navigation.state.params.isSavedCollection === true
          ? 'savedCollections'
          : 'photos';
      if (url !== 'savedCollections') {
        url =
          this.props.navigation.state.params.isDiary === true
            ? 'diary'
            : 'photos';
      }
      viewSpecificPhotos = this.props.navigation.state.params
        .viewSpecificPhotos;
    } else {
      email = this.props.screenProps.property.screenProps.email;
    }
    this.setState({email: email});
    let that = this;
    if (url === 'photos') {
      let db = firebase.firestore();
      let photosRef = db.collection(url);
      photosRef
        .orderBy('postedTime', 'desc')
        .limit(10)
        .get()
        .then(function(querySnapshot) {
          if (querySnapshot._docs && querySnapshot._docs.length) {
            console.log('total', querySnapshot._docs.length);
            //randmoized posts
            const snapshot = querySnapshot._docs
              .map(e => ({val: e, r: Math.random()}))
              .sort((a, b) => b.r - a.r)
              .map(e => e.val);
            that.setState({
              lastVisible: snapshot[snapshot.length - 1],
            });
            console.log(
              'random loadFeed => ',
              snapshot.map(e => e.data().caption),
            );

            snapshot.forEach(function(doc) {
              let data;
              const docNotEmpty = (doc.id, ' => ', doc.data() != null);
              if (docNotEmpty) data = (doc.id, ' => ', doc.data());
              if (viewSpecificPhotos === true) {
                if (
                  doc.data().isDeleted === false &&
                  data.email === selectedEmail
                ) {
                  that.fetchUserFeed(email, data, that);
                }
              } else {
                if (doc.data().isDeleted === false) {
                  that.fetchUserFeed(email, data, that);
                } else {
                  if (
                    that.props &&
                    that.props.screenProps &&
                    that.props.screenProps.navigateToOther
                  ) {
                    that.setState({
                      screenPropsPresent: true,
                    });
                  }
                  that.setState({
                    feedRefresh: false,
                    loading: false,
                  });
                }
              }
            });
          } else {
            if (
              that.props &&
              that.props.screenProps &&
              that.props.screenProps.navigateToOther
            ) {
              that.setState({
                screenPropsPresent: true,
              });
            }
            that.setState({
              feedRefresh: false,
              loading: false,
            });
            that.setPhoto([]);
          }
        });
    } else if (url === 'savedCollections') {
      that.fetchImages();
    } else {
      that.fetchDiary();
    }
  };

  loadMoreFeed = () => {
    this.setState({
      feedRefresh: true,
    });
    let viewSpecificPhotos = false;
    let url = 'photos';
    let email, selectedEmail;
    if (
      this.props.navigation &&
      this.props.navigation.state &&
      this.props.navigation.state.params.email
    ) {
      email = this.props.navigation.state.params.email;
      selectedEmail = this.props.navigation.state.params.selectedItem.item
        .email;
      url =
        this.props.navigation.state.params.isSavedCollection === true
          ? 'savedCollections'
          : 'photos';
      if (url !== 'savedCollections') {
        url =
          this.props.navigation.state.params.isDiary === true
            ? 'diary'
            : 'photos';
      }
      viewSpecificPhotos = this.props.navigation.state.params
        .viewSpecificPhotos;
    } else {
      email = this.props.screenProps.property.screenProps.email;
    }
    this.setState({email: email});
    let that = this;
    console.log('last visible', this.state.lastVisible);
    if (url === 'photos') {
      let db = firebase.firestore();
      let photosRef = db.collection(url);
      photosRef
        .orderBy('postedTime', 'desc')
        .startAfter(that.state.lastVisible)
        .limit(10)
        .get()
        .then(function(querySnapshot) {
          if (querySnapshot._docs && querySnapshot._docs.length) {
            //removed duplicates
            const feed = that.state.photoFeedData.map(e => e.docRef);

            //randmoized posts
            const snapshot = querySnapshot._docs
              .map(e => ({
                val: e,
                r: Math.random() * querySnapshot._docs.length,
              }))
              .sort((a, b) => b.r - a.r)
              .map(e => e.val)
              .filter(e => !feed.includes(e.data().docRef));
            console.log(
              'random loadMoreFeed => ',
              snapshot.map(e => e.data().caption),
            );

            snapshot.forEach(function(doc) {
              let data;
              const docNotEmpty = (doc.id, ' => ', doc.data() != null);
              if (docNotEmpty) data = (doc.id, ' => ', doc.data());
              if (viewSpecificPhotos === true) {
                if (
                  doc.data().isDeleted === false &&
                  data.email === selectedEmail
                ) {
                  // that.fetchUserFeed(email, data, that);
                  that.fetchUserFeed(email, data, that, doc);
                }
              } else {
                if (doc.data().isDeleted === false) {
                  // that.fetchUserFeed(email, data, that);
                  that.fetchUserFeed(email, data, that, doc);
                } else {
                  if (
                    that.props &&
                    that.props.screenProps &&
                    that.props.screenProps.navigateToOther
                  ) {
                    that.setState({
                      screenPropsPresent: true,
                    });
                  }
                  that.setState({
                    feedRefresh: false,
                    loading: false,
                  });
                }
              }
            });
            that.setState({
              lastVisible: snapshot[snapshot.length - 1],
<<<<<<< HEAD
            })
=======
            });
>>>>>>> 621082db57fc895e46c024a53e035e3f1501ea84
          } else {
            if (
              that.props &&
              that.props.screenProps &&
              that.props.screenProps.navigateToOther
            ) {
              that.setState({
                screenPropsPresent: true,
              });
            }
            that.setState({
              feedRefresh: false,
              loading: false,
            });
            // that.setPhoto([]);
          }
        });
    } else if (url === 'savedCollections') {
      that.fetchImages();
    } else {
      that.fetchDiary();
    }
  };

  fetchDiary() {
    const context = this;
    context.setState({
      feedRefresh: true,
      images: [],
      isListView: false,
    });
    const image = [];
    const fetchData = [];
    let db = firebase.firestore();
    let photosRef = db.collection('diary');
    photosRef
      .where('email', '==', context.props.navigation.state.params.email)
      .where('isDeleted', '==', false)
      .get()
      .then(function(querySnapshot) {
        let data;
        querySnapshot.forEach(function(doc) {
          const docNotEmpty = (doc.id, ' => ', doc.data() != null);
          if (docNotEmpty) data = (doc.id, ' => ', doc.data());
          fetchData.push(doc.data());
          doc.data().postedTime = context.timeConverter(data.postedTime);
          image.push(doc.data());
          context.setState({
            photoFeedData: image,
          });
          context.setState({
            feedRefresh: false,
            loading: false,
          });
        });
        context.setState({
          images: image,
          data: fetchData,
          loading: false,
          feedRefresh: false,
          isListView: false,
        });
      });
  }

  fetchImages() {
    const context = this;
    context.setState({
      feedRefresh: true,
      images: [],
    });
    const image = [];
    let db = firebase.firestore();
    let photosRef = db.collection('photos');
    photosRef
      .where('isDeleted', '==', false)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          let data;
          const docNotEmpty = (doc.id, ' => ', doc.data() != null);
          if (docNotEmpty) {
            data = (doc.id, ' => ', doc.data());
            photosRef
              .doc(data.docRef)
              .collection('savedUsers')
              .get()
              .then(function(savedSnapshot) {
                savedSnapshot.forEach(function(savedDoc) {
                  let savedData;
                  const docNotEmpty = (savedDoc.id,
                  ' => ',
                  savedDoc.data() != null);
                  if (docNotEmpty) {
                    savedData = (savedDoc.id, ' => ', savedDoc.data());
                    if (savedData.email === context.state.email) {
                      doc.data().postedTime = context.timeConverter(
                        data.postedTime,
                      );
                      image.push(doc.data());
                    }
                    context.setState({
                      photoFeedData: image,
                    });
                    context.setState({
                      feedRefresh: false,
                      loading: false,
                    });
                  } else {
                    if (
                      context.props &&
                      context.props.screenProps &&
                      context.props.screenProps.navigateToOther
                    ) {
                      context.setState({
                        screenPropsPresent: true,
                      });
                    }
                    context.setPhoto([]);
                  }
                });
              });
          } else {
            if (
              context.props &&
              context.props.screenProps &&
              context.props.screenProps.navigateToOther
            ) {
              context.setState({
                screenPropsPresent: true,
              });
            }
            context.setPhoto([]);
          }
        });
      });
  }

  fetchUserFeed = (email, data, that) => {
    if (
      that.props.navigation &&
      that.props.navigation.state &&
      that.props.navigation.state.params &&
      that.props.navigation.state.params.notification === true
    ) {
      if (
        data.docRef ===
        that.props.navigation.state.params.selectedItem.item.docRef
      ) {
        that.userRefFeed(email, data, that);
      }
    } else {
      that.userRefFeed(email, data, that);
    }
  };

  userRefFeed = (email, data, that) => {
    let db = firebase.firestore();
    let photoFeedData = that.state.photoFeedData;
    let userRef = db.collection('signup');
    userRef
      .where('email', '==', email.trim())
      .get()
      .then(function(userQuerySnapshot) {
        userQuerySnapshot.forEach(function(doc) {
          let userData;
          const docNotEmpty = (doc.id, ' => ', doc.data() != null);
          if (docNotEmpty) {
            userData = (doc.id, ' => ', doc.data());
            if (userData.email.trim() === data.email.trim()) {
              that.addToFlatlist(photoFeedData, data, userData, email);
            } else {
              userRef
                .where('email', '==', data.email.trim())
                .get()
                .then(function(otheruserSnapshot) {
                  otheruserSnapshot.forEach(function(otherDoc) {
                    const docNotEmpty = (otherDoc.id,
                    ' => ',
                    otherDoc.data() != null);
                    if (docNotEmpty) {
                      let otherUserData;
                      otherUserData = (otherDoc.id, ' => ', otherDoc.data());
                      if (
                        that.props &&
                        that.props.navigation &&
                        that.props.navigation.state &&
                        that.props.navigation.state.params &&
                        that.props.navigation.state.params.viewOtherPhotos ===
                          true
                      ) {
                        that.addToFlatlist(
                          photoFeedData,
                          data,
                          otherUserData,
                          email,
                        );
                      } else {
                        userRef
                          .doc(otherUserData.docRef)
                          .collection('followers')
                          .get()
                          .then(function(followerSnapshot) {
                            if (
                              followerSnapshot._docs &&
                              followerSnapshot._docs.length
                            ) {
                              followerSnapshot.forEach(function(followerDoc) {
                                const docNotEmpty = (followerDoc.id,
                                ' => ',
                                followerDoc.data() != null);
                                if (docNotEmpty) {
                                  otherUserData.isFollowed = false;
                                  if (
                                    email.trim() ===
                                    followerDoc.data().email.trim()
                                  ) {
                                    otherUserData.isFollowed = true;
                                    that.addToFlatlist(
                                      photoFeedData,
                                      data,
                                      otherUserData,
                                      email,
                                    );
                                  } else {
                                    if (
                                      that.props &&
                                      that.props.screenProps &&
                                      that.props.screenProps.navigateToOther
                                    ) {
                                      that.setState({
                                        screenPropsPresent: true,
                                      });
                                    }
                                    console.log('in');
                                    that.setState({
                                      feedRefresh: false,
                                      loading: false,
                                    });
                                    that.setPhoto(that.state.photoFeedData);
                                  }
                                }
                              });
                            } else {
                              if (
                                that.props &&
                                that.props.screenProps &&
                                that.props.screenProps.navigateToOther
                              ) {
                                that.setState({
                                  screenPropsPresent: true,
                                });
                              }
                              if (that.state.loading !== false) {
                                that.setState({
                                  feedRefresh: false,
                                  loading: false,
                                });
                                that.setPhoto([]);
                              }
                            }
                          });
                      }
                    }
                  });
                });
            }
          }
        });
      });
  };

  addToFlatlist = (photoFeedData, data, userData, email) => {
    var that = this;
    that.setState({screenPropsPresent: false});
    photoFeedData.push({
      author: userData.fullName,
      authorDescription: userData.description,
      caption: data.caption,
      comments: data.comments,
      likes: data.likes,
      isLiked: this.state.alreadyLiked,
      location: data.location,
      postedTime: that.timeConverter(data.postedTime),
      url: data.url,
      userAvatar: userData.profilePicture,
      docRef: data.docRef,
      email: data.email,
      isSaved: false,
      isFollowed: userData.isFollowed,
      isPrivateAccount: userData.isPrivateAccount,
    });
    if (
      that.props &&
      that.props.screenProps &&
      that.props.screenProps.navigateToOther
    ) {
      that.setState({screenPropsPresent: true});
    }
    that.fetchSavedUsers(photoFeedData, email);
  };

  fetchSavedUsers = (item, email) => {
    var that = this;
    let db = firebase.firestore();
    let data;
    item.forEach(element => {
      let savedUsersRef = db
        .collection('photos')
        .doc(element.docRef)
        .collection('savedUsers');
      savedUsersRef.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          const docNotEmpty = (doc.id, ' => ', doc.data() != null);
          if (docNotEmpty) {
            data = doc.data();
          }
          if (data && data.email.trim() === email.trim()) {
            element.isSaved = true;
          }
        });
      });

      let likedUsersRef = db
        .collection('photos')
        .doc(element.docRef)
        .collection('likedUsers');
      likedUsersRef.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          const docNotEmpty = (doc.id, ' => ', doc.data() != null);
          if (docNotEmpty) {
            data = doc.data();
          }
          if (data && data.email.trim() === email.trim()) {
            element.isLiked = true;
          }
        });
      });
    });
    setTimeout(() => {
      that.setPhoto(item);
      that.setState({
        feedRefresh: false,
        loading: false,
      });
    }, 1000);
  };

  setPhoto = (data) => {
    console.log('data', data)
    this.setState({
      photoFeedData: data,
    });
  };

  navigateToComment = ({ item, index }, isComment) => {
    // if (this.props.screenProps) {
    //   this.setState({ screenPropsPresent: true });
    //   this.props.screenProps.navigateToOther.navigate(
    //     { item, index, context: this },
    //     isComment,
    //   );
    // } else {
    //   if (isComment) {
    //     this.props.navigation.navigate('comments', {
    //       selectedItem: { item: item },
    //       email: this.props.navigation.state.params.email.trim(),
    //     });
    //   } else {
    //     this.addToSaveCollection({ item, index });
    //   }
    // }
    if(this.props.screenProps) {
      console.log('834')
      this.setState({ screenPropsPresent: true });
      if(isComment) {
        this.props.screenProps.navigateToOther.navigate('comments', {
          selectedItem: { item: item },
          email: this.props.screenProps.navigateToOther.state.params.email.trim(),
        });
      } else {
        this.addToSaveCollection({ item, index });
      }
    } else if(this.props.navigation) {
      this.setState({ screenPropsPresent: false });
      if(isComment) {
        this.props.navigation.navigate('comments', {
          selectedItem: {item: item},
          email: this.props.navigation.state.params.email.trim(),
        });
      } else {
        this.addToSaveCollection({item, index});
      }
    }
  };

  sendImage = ({item, index}) => {
    if (this.props.screenProps) {
      this.props.screenProps.navigation({item, index, context: this}, 'send');
    }
  };

  viewOtherUserProfiles = ({item}) => {
    const isSameProfile = this.state.email.trim() === item.email.trim();
    this.props.screenProps.navigation(
      {
        item,
        email: this.state.email.trim(),
        isSameProfile: isSameProfile,
      },
      false,
      false,
      true,
    );
  };

  //uploading feed data in cloud firestore
  addToSaveCollection = (selectedItem) => {
    let db = firebase.firestore();
    const context = this;
    //Set variable for feed
    let author = selectedItem.item.author;
    let authorDescription = selectedItem.item.authorDescription;
    let caption = selectedItem.item.caption;
    let likes = selectedItem.item.likes;
    let location = selectedItem.item.location;
    let dateTime = Date.now();
    let timestamp = Math.floor(dateTime / 1000);
    let isDeleted = false;
    let userAvatar = selectedItem.item.userAvatar;
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
      email: this.props.screenProps.navigateToOther.state.params.email.trim(),
    };

    db.collection('photos')
      .doc(selectedItem.item.docRef)
      .update({
        saved: true,
      });

    db.collection('photos')
      .doc(selectedItem.item.docRef)
      .collection('savedUsers')
      .doc(selectedItem.item.email)
      .set({
        email: this.props.screenProps.navigateToOther.state.params.email.trim(),
      })
      .then(function (docRef) {
        console.log(selectedItem.index , context.state.photoFeedData[selectedItem.index])
        context.state.photoFeedData[selectedItem.index].isSaved = true;
        context.setPhoto(context.state.photoFeedData);
      });

    // firebase.firestore().collection('savedCollections').doc(photoObj.email).set(photoObj)
  };

  deleteCollection(selectedItem) {
    const context = this;
    let db = firebase.firestore();

    db.collection('photos')
      .doc(selectedItem.item.docRef)
      .update({
        saved: false,
      })
      .then(() => {
        context.state.photoFeedData[selectedItem.index].isSaved = false;
        context.setPhoto(context.state.photoFeedData);
      });

    db.collection('photos')
      .doc(selectedItem.item.docRef)
      .collection('savedUsers')
      .doc(context.state.email)
      .update({
        email: context.state.email + '_deleted',
      });

    // db.collection("savedCollections").doc(selectedItem.item.docRef).update({
    //   isDeleted: true
    // })
  }

  copyUrl(selectedItem) {
    Clipboard.setString(selectedItem.url);
    alert('Photo url copied!');
  }

  _onViewableItemsChanged = ({viewableItems, changed}) => {
    console.log('Visible items', viewableItems);
    if (viewableItems && viewableItems.length > 0) {
      this.setState({ currentIndex: viewableItems[0].index });
    }
  };

  _viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 75,
  };

  MyCustomLeftComponent = () => {
    return (
      <View>
        <Text style={styles.inputSearch1}>myth</Text>
      </View>
    );
  };

  MyCustomRightComponent = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            this.props.screenProps.navigateToOther.navigate('profile', {
              email: this.state.email.trim(),
              searchedEmail: this.state.email.trim(),
              privateAccount: false,
              isSameProfile: true,
            })
          }>
          <FontAwesome5 style={styles.profile1} name={'user'} />
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    // //Heart like spring animation
    // const bouncyHeart = this.state.scale.interpolate({
    //   inputRange: [0, 1, 2],
    //   outputRange: [1, .8, 1]
    // })
    // const heartButtonStyle = {
    //   transform: [
    //     { scale: bouncyHeart }
    //   ]
    // }

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff6f2',
        }}>
        {/* <View
          style={{
            borderBottomColor: '#EE6E3D',
            borderBottomWidth: 0.5,
          }}
        /> */}
        {this.state.screenPropsPresent === true ? (
          <View style={styles.header}>
            <Text style={styles.inputSearch}>myth</Text>
            <TouchableOpacity
              onPress={() =>
                this.props.screenProps.navigateToOther.navigate('profile', {
                  email: this.state.email.trim(),
                  searchedEmail: this.state.email.trim(),
                  privateAccount: false,
                  isSameProfile: true,
                })
              }>
              <FontAwesome5 style={styles.profile} name={'user'} />
            </TouchableOpacity>
          </View>
        ) : (
          // <Header
          //   leftComponent={<this.MyCustomLeftComponent />}
          //   rightComponent={<this.MyCustomRightComponent />}
          //   containerStyle={{
          //     backgroundColor: '#EE6E3D',
          //     borderColor: '#EE6E3D',
          //     justifyContent: 'center',
          //     alignItems: 'center',
          //     // height: 55,
          //   }}
          //   statusBarProps={{
          //     backgroundColor: '#000',
          //   }}
          // />
          <></>
        )}

        {this.state.loading == true ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color="#EE6E3D" />
          </View>
        ) : (
          <FlatList
            refreshing={this.state.feedRefresh}
            onRefresh={this.photoFeedLoad}
            data={this.state.photoFeedData}
            keyExtractor={(item, index) => index.toString()}
            style={{flex: 1}}
            snapToAlignment={'start'}
            decelerationRate={'fast'}
            snapToInterval={Dimensions.get('window').height}
            onViewableItemsChanged={this._onViewableItemsChanged}
            viewabilityConfig={this._viewabilityConfig}
            onEndReached={this.loadMoreFeed}
            onEndReachedThreshold={0.5}
            renderItem={({item, index}) => {
              return (
                <View
                  key={index}
                  style={{
                    paddingHorizontal: wp('1%'),
                    marginHorizontal: hp('1%'),
                    borderRadius: wp('2%'),
                    borderWidth: 1,
                    backgroundColor: 'white',
                    borderColor: 'white',
                    height: Dimensions.get('window').height,
                    // elevation: 5
                  }}>
                  <View style={styles.feedBorder}>
                    <View style={styles.listHeader}>
                      <TouchableOpacity
                        onPress={() => this.viewOtherUserProfiles({item})}
                        style={{
                          paddingHorizontal: 10,
                        }}>
                        <Image
                          source={{
                            uri: item?.userAvatar,
                          }}
                          style={{
                            width: wp('15%'),
                            height: hp('8%'),
                            resizeMode: 'cover',
                            borderRadius: wp('3%'),
                            borderWidth: 1,
                            marginLeft: wp('2%'),
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.viewOtherUserProfiles({item})}
                        style={styles.locationDiv}>
                        <Text style={styles.listProfileName}>
                          {item.author}
                        </Text>
                        {/* <View style={styles.locationDiv}> */}
                        <Text style={styles.locationText}>{item.location}</Text>
                        {/* <TouchableOpacity onPress={() => this.copyUrl(item)} style={{ paddingLeft: wp('1%') }}>
                        <Entypo style={styles.more} name="dots-three-horizontal" size={22} color="#22222C" />
                      </TouchableOpacity> */}
                        {/* </View> */}
                      </TouchableOpacity>
                    </View>
                    <View style={styles.listViewImg}>
                      <Image
                        style={styles.listViewInlineImg}
                        source={{uri: item.url}}
                        loadingIndicatorSource={require('../images/loading.gif')}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingHorizontal: wp('2%'),
                        paddingVertical: wp('2%'),
                        marginLeft: wp('1.3%'),
                      }}>
                      {item.isLiked === true ? (
                        <TouchableOpacity
                          onPress={() =>
                            this.onLikePost({
                              item,
                              index,
                            })
                          }
                          style={{
                            paddingLeft: wp('1%'),
                          }}>
                          <FontAwesome5
                            style={styles.comment}
                            name="cookie-bite"
                            size={22}
                            color="#EE6E3D"
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            this.onLikePost({
                              item,
                              index,
                            })
                          }
                          style={{
                            paddingLeft: wp('1%'),
                          }}>
                          <FontAwesome5
                            style={styles.comment}
                            name="cookie-bite"
                            size={22}
                            color="#808080"
                          />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        onPress={() =>
                          this.navigateToComment({item, index}, true)
                        }
                        style={{
                          paddingLeft: wp('1%'),
                        }}>
                        <Fontisto
                          style={styles.comment}
                          name="commenting"
                          size={22}
                          color="#808080"
                        />
                      </TouchableOpacity>
                      {item.isSaved === true ? (
                        <TouchableOpacity
                          onPress={() => {
                            this.deleteCollection({
                              item,
                              index,
                            });
                          }}
                          style={{
                            paddingLeft: wp('3%'),
                          }}>
                          <Fontisto
                            name="bookmark-alt"
                            size={22}
                            color="#EE6E3D"
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            this.navigateToComment({item, index}, false)
                          }
                          style={{
                            paddingLeft: wp('3%'),
                          }}>
                          <Fontisto name="bookmark" size={22} color="#808080" />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles.fabIcon1}
                        onPress={() =>
                          this.sendImage({
                            item,
                            index,
                          })
                        }>
                        <Image
                          source={require('../images/message-new.png')}
                          style={styles.fabIcon}
                        />
                        {/* <FontAwesome5 style={styles.fabIcon} name="telegram-plane" size={22} color="#808080" /> */}
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'column',
                      marginLeft: wp('5%'),
                    }}>
                    <Text style={styles.likeText}>{item.likes} like(s)</Text>
                    <View style={styles.foodNameDiv}>
                      <Text style={styles.listProfileName1}>{item.author}</Text>
                      <Text style={styles.foodNameText}>{item.caption}</Text>
                    </View>
                    <Text
                      style={{
                        // marginLeft: wp('5%'),
                        marginBottom: wp('5%'),
                        fontSize: hp('1.5%'),
                        color: '#808080',
                      }}>
                      {item.postedTime}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: 'row',
    marginTop: hp('1%'),
  },
  listProfileName: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#22222C',
  },
  listProfileName1: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#22222C',
    // marginLeft: wp('3%'),
    marginTop: wp('-5%'),
    paddingRight: 5,
  },
  listProfileSubName: {
    color: '#22222C',
    marginRight: wp('15%'),
  },
  listViewImg: {
    paddingVertical: wp('2%'),
  },
  listViewInlineImg: {
    width: wp('85%'),
    height: wp('100%'),
    marginLeft: wp('4%'),
    borderWidth: 1,
    borderRadius: wp('3%'),
  },
  foodNameDiv: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  foodNameText: {
    fontSize: hp('2%'),
    // left: 5,
    marginTop: wp('-5%'),
  },
  locationDiv: {
    flexDirection: 'column',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  locationText: {
    fontSize: hp('1.5%'),
    color: '#EE6E3D',
  },
  comment: {
    paddingHorizontal: wp('2%'),
  },
  more: {
    marginLeft: wp('10%'),
  },
  likeText: {
    marginRight: wp('45%'),
    paddingBottom: wp('4%'),
    marginTop: wp('-1%'),
  },
  fabIcon: {
    color: '#EE6E3D',
    marginLeft: wp('5%'),
    width: wp('6%'),
    height: hp('4%'),
  },
  fabIcon1: {
    flexDirection: 'row',
    color: '#EE6E3D',
    marginLeft: wp('45%'),
  },
  profile: {
    color: '#fff',
    fontSize: hp('3%'),
    paddingVertical: wp('0.5%'),
    paddingHorizontal: wp('0.8%'),
    marginTop: wp('6%'),
    marginRight: wp('5%'),
  },
  profile1: {
    color: '#fff',
    fontSize: hp('3%'),
  },
  inputSearch: {
    width: wp('70%'),
    paddingVertical: 2,
    borderBottomWidth: wp('0.1%'),
    borderBottomColor: '#fff',
    backgroundColor: '#EE6E3D',
    fontSize: 30,
    color: '#fff',
    height: hp('7%'),
    paddingLeft: wp('5%'),
    marginTop: wp('2%'),
    backgroundColor: '#EE6E3D',
    borderBottomWidth: 0,
    borderTopWidth: 0,
    fontFamily: 'SEAFOOL',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EE6E3D',
    marginTop: wp('-3%'),
    marginBottom: 10,
    padding: 2.5,
  },
  inputSearch1: {
    fontSize: 30,
    color: '#fff',
    fontFamily: 'SEAFOOL',
  },
});
