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
  Dimensions,
  FlatList,
  Animated,
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import UserAvatar from 'react-native-user-avatar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
}
  from 'react-native-responsive-screen';
import Heart from "./heart";
import firebase from 'react-native-firebase';

const Jaguar = '#22222C';

export default class mainFeed extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      photoFeedData: [],
      feedRefresh: false,
      liked: false,
      loading: true,
      alreadyLiked: false,
      scale: new Animated.Value(0),
      animations: [
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
      ],
      email: ''
    }
  }

  // Photo feed function
  photoFeedLoad = () => {
    this.loadFeed();
  }

  // Heart like trigger function
  onLikePost({ item, index }) {
    const selectedPhoto = this.state.photoFeedData[index];
    this.updateLikes(selectedPhoto, index);
    this.setState({
      liked: !this.state.liked
    })
    Animated.spring(this.state.scale, {
      toValue: 2,
      friction: 3
    }).start(() => {
      this.state.scale.setValue(0);
    });
  }

  updateLikes(selectedPhoto, index) {
    if (selectedPhoto.isLiked) {
      let db = firebase.firestore();
      db.collection("photos").doc(selectedPhoto.docRef).update({
        likes: selectedPhoto.likes - 1
      })
      db.collection("photos").doc(selectedPhoto.docRef).collection('likedUsers').doc(this.state.email).update({ email: this.state.email + '_unliked' })
      this.state.photoFeedData[index].likes = selectedPhoto.likes - 1;
      this.state.photoFeedData[index].isLiked = false;
      this.setState({ alreadyLiked: false, liked: false })
    } else {
      let db = firebase.firestore();
      db.collection("photos").doc(selectedPhoto.docRef).update({
        likes: selectedPhoto.likes + 1
      })
      this.state.photoFeedData[index].likes = selectedPhoto.likes + 1;
      this.state.photoFeedData[index].isLiked = true;
      db.collection("photos").doc(selectedPhoto.docRef).collection('likedUsers').doc(this.state.email).set({ email: this.state.email.trim() })
      this.setState({ alreadyLiked: true, liked: true })
    }
  }

  componentDidMount() {
    loc(this);
    this.loadFeed();
  }

  componentWillUnMount() {
    rol();
  }

  // Cover the timestamp to show in real minutes
  pluralCheck = (s) => {
    if (s == 1) {
      return ' ago';
    } else {
      return 's ago';
    }
  }
  timeConverter = (timestamp) => {
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
  }
  // Fetch data from the database and display in the view


  loadFeed = () => {
    this.setState({
      feedRefresh: true,
      photoFeedData: []
    });
    let viewSpecificPhotos = false;
    let url = 'photos';
    let email, selectedEmail;
    if (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params.email) {
      email = this.props.navigation.state.params.email;
      selectedEmail = this.props.navigation.state.params.selectedItem.item.email;
      url = this.props.navigation.state.params.isSavedCollection === true ? 'savedCollections' : 'photos';
      viewSpecificPhotos = this.props.navigation.state.params.viewSpecificPhotos;
    } else {
      email = this.props.screenProps.property.screenProps.email
    }
    this.setState({ email: email })
    let that = this;

    let db = firebase.firestore();
    let photosRef = db.collection(url);
    photosRef.orderBy('postedTime', 'desc').get().then(function (querySnapshot) {

      querySnapshot.forEach(function (doc) {

        let data;
        const docNotEmpty = (doc.id, " => ", doc.data() != null);
        if (docNotEmpty) data = (doc.id, " => ", doc.data());
        if (viewSpecificPhotos === true) {
          if (doc.data().isDeleted === false && data.email === selectedEmail) {
            that.fetchUserFeed(email, data, that)
          }
        } else {
          if (doc.data().isDeleted === false) {
            that.fetchUserFeed(email, data, that)
          } else {
            that.setState({
              feedRefresh: false,
              loading: false,
            });
          }
        }
      });
    });
  }

  fetchUserFeed = (email, data, that) => {
    if (that.props.navigation && that.props.navigation.state && that.props.navigation.state.params && that.props.navigation.state.params.notification === true) {
      if (data.docRef === that.props.navigation.state.params.selectedItem.item.docRef) {
        that.userRefFeed(email, data, that)
      }
    } else {
      that.userRefFeed(email, data, that)
    }
  }

  userRefFeed = (email, data, that) => {
    let db = firebase.firestore();
    let photoFeedData = that.state.photoFeedData;
    let userRef = db.collection('signup');
    userRef.where('email', '==', email.trim()).get().then(function (userQuerySnapshot) {
      userQuerySnapshot.forEach(function (doc) {
        let userData;
        const docNotEmpty = (doc.id, " => ", doc.data() != null);
        if (docNotEmpty) {
          userData = (doc.id, " => ", doc.data());
          if (userData.email.trim() === data.email.trim()) {
            that.addToFlatlist(photoFeedData, data, userData, email);
          } else {
            userRef.where('email', '==', data.email.trim()).get().then(function (otheruserSnapshot) {
              otheruserSnapshot.forEach(function (otherDoc) {
                const docNotEmpty = (otherDoc.id, " => ", otherDoc.data() != null);
                if (docNotEmpty) {
                  let otherUserData;
                  otherUserData = (otherDoc.id, " => ", otherDoc.data());
                  userRef.doc(otherUserData.docRef).collection('followers').get().then(function (followerSnapshot) {
                    followerSnapshot.forEach(function (followerDoc) {
                      const docNotEmpty = (followerDoc.id, " => ", followerDoc.data() != null);
                      if (docNotEmpty) {
                        otherUserData.isFollowed = false;
                        if (email === followerDoc.data().email) {
                          otherUserData.isFollowed = true;
                          that.addToFlatlist(photoFeedData, data, otherUserData, email);
                        }
                      }
                    })
                  });

                }
              })
            })
          }
        }
      });
    });
  }

  addToFlatlist = (photoFeedData, data, userData, email) => {
    var that = this;
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
      isPrivateAccount: userData.isPrivateAccount
    });
    that.fetchSavedUsers(photoFeedData, email);

  }

  fetchSavedUsers = (item, email) => {
    var that = this;
    let db = firebase.firestore();
    let data;
    item.forEach((element) => {
      let savedUsersRef = db.collection('photos').doc(element.docRef).collection('savedUsers');
      savedUsersRef.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const docNotEmpty = (doc.id, " => ", doc.data() != null);
          if (docNotEmpty) {
            data = doc.data();
          }
          if (data && data.email.trim() === email.trim()) {
            element.isSaved = true;
          }
        });
      });

      let likedUsersRef = db.collection('photos').doc(element.docRef).collection('likedUsers');
      likedUsersRef.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const docNotEmpty = (doc.id, " => ", doc.data() != null);
          if (docNotEmpty) {
            data = doc.data();
          }
          if (data && data.email.trim() === email.trim()) {
            element.isLiked = true;
          }
        });
      });
    })
    setTimeout(() => {
      that.setPhoto(item);
      that.setState({
        feedRefresh: false,
        loading: false,
      });
    }, 1000);

  }

  setPhoto = (data) => {
    this.setState({ photoFeedData: data });
  }

  navigateToComment = ({ item, index }, isComment) => {
    if (this.props.screenProps) {
      this.props.screenProps.navigation({ item, index, context: this }, isComment);
    } else {
      if (isComment) {
        this.props.navigation.navigate('comments', { selectedItem: { item: item }, email: this.props.navigation.state.params.email.trim() })
      } else {
        this.addToSaveCollection({ item, index })
      }
    }
  }

  sendImage = ({ item, index }) => {
    if (this.props.screenProps) {
      this.props.screenProps.navigation({ item, index, context: this }, 'send')
    }
  }

  viewOtherUserProfiles = ({ item }) => {
    const isSameProfile = this.state.email.trim() === item.email.trim();
    this.props.screenProps.navigation({ item, email: this.state.email.trim(), isSameProfile: isSameProfile }, false, false, true)
  }

  //uploading feed data in cloud firestore
  addToSaveCollection = (selectedItem, index) => {
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
      email: this.props.navigation.state.params.email.trim()
    }

    db.collection("photos").doc(selectedItem.item.docRef).update({
      saved: true
    })

    db.collection("photos").doc(selectedItem.item.docRef).collection('savedUsers').doc(selectedItem.item.email).set({ email: this.props.navigation.state.params.email.trim() }).then(function (docRef) {
      context.state.photoFeedData[index].isSaved = true;
      context.setPhoto(context.state.photoFeedData);
    });

    // firebase.firestore().collection('savedCollections').doc(photoObj.email).set(photoObj)
  }

  deleteCollection(selectedItem) {
    const context = this;
    let db = firebase.firestore();

    db.collection("photos").doc(selectedItem.item.docRef).update({
      saved: false
    }).then(() => {
      context.state.photoFeedData[selectedItem.index].isSaved = false;
      context.setPhoto(context.state.photoFeedData);
    })

    db.collection("photos").doc(selectedItem.item.docRef).collection('savedUsers').doc(context.state.email).update({ email: context.state.email + '_deleted' })

    // db.collection("savedCollections").doc(selectedItem.item.docRef).update({
    //   isDeleted: true
    // })
  }


  render() {
    //Heart like spring animation 
    const bouncyHeart = this.state.scale.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [1, .8, 1]
    })
    const heartButtonStyle = {
      transform: [
        { scale: bouncyHeart }
      ]
    }

    return (
      <View style={{ flex: 1, }}>
        <View
          style={{
            borderBottomColor: '#22222C',
            borderBottomWidth: 1.5,
          }} />
        {this.state.loading == true ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color='#FF7200' />
          </View>
        ) : (
            <FlatList
              refreshing={this.state.feedRefresh}
              onRefresh={this.photoFeedLoad}
              data={this.state.photoFeedData}
              keyExtractor={(item, index) => index.toString()}
              style={{ flex: 1 }}
              renderItem={({ item, index }) => (

                <View key={index} style={{ paddingHorizontal: wp('1%'), marginTop: hp('1%') }}>
                  <View style={styles.feedBorder}>
                    <View style={styles.listHeader}>
                      <TouchableOpacity onPress={() => this.viewOtherUserProfiles({ item })} style={{ paddingHorizontal: 10, }}>
                        <UserAvatar size="50" name={item.author}
                          src={item.userAvatar}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Text style={styles.listProfileName}>{item.author}</Text>
                        <Text style={styles.listProfileSubName}>{item.authorDescription}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.listViewImg}>
                      <Image style={styles.listViewInlineImg}
                        // source={{uri: 'https://source.unsplash.com/random/500'+Math.floor((Math.random() * 800)+ 500)}}
                        source={{ uri: item.url }}
                        loadingIndicatorSource={require('../images/loading.gif')}
                      />
                    </View>
                    <View style={styles.foodNameDiv}>
                      <Text style={styles.foodNameText}>{item.caption}</Text>
                    </View>
                    <View style={styles.locationDiv}>
                      <Text style={styles.locationText}>{item.location}</Text>
                    </View>
                    <View style={{
                      flexDirection: 'row',
                      paddingHorizontal: wp('2%'),
                      paddingVertical: wp('2%'),
                      marginLeft: wp('1.3%')
                    }}>
                      <TouchableWithoutFeedback onPress={() => this.onLikePost({ item, index })} >
                        <Animated.View style={heartButtonStyle}>
                          <Heart filled={item.isLiked} />
                        </Animated.View>
                      </TouchableWithoutFeedback>
                      <TouchableOpacity onPress={() => this.navigateToComment({ item, index }, true)} style={{ paddingLeft: wp('1%') }}>
                        <Fontisto style={styles.comment} name="comment" size={22} color="#22222C" />
                      </TouchableOpacity>
                      {item.isSaved === true ?
                        <TouchableOpacity onPress={() => { this.deleteCollection({ item, index }) }} style={{ paddingLeft: wp('1%') }}>
                          <Fontisto name="bookmark-alt" size={22} color="#FF7200" />
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => this.navigateToComment({ item, index }, false)} style={{ paddingLeft: wp('1%') }}>
                          <Fontisto name="bookmark" size={22} />
                        </TouchableOpacity>
                      }
                      <TouchableOpacity onPress={() => this.sendImage({ item, index })} style={{ paddingLeft: wp('1%') }}>
                        <FontAwesome5 style={styles.fabIcon} name="telegram-plane" size={22} />
                      </TouchableOpacity>
                      <View>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: wp('2%') }}>
                      <Text style={styles.likeText}>{item.likes} likes</Text>
                      <Text style={{ marginRight: wp('4%') }}>{item.postedTime}</Text>
                    </View>
                  </View>
                </View>
              )}
            />
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  feedBorder: {
    borderBottomWidth: wp('0.1%'),
    borderBottomColor: '#121212'
  },
  listHeader: {
    flexDirection: 'row',
    marginTop: hp('1%')
  },
  listProfileName: {
    fontSize: hp('3%'),
    fontWeight: 'bold',
    color: '#22222C',
  },
  listProfileSubName: {
    color: '#22222C'
  },
  listViewImg: {
    paddingVertical: wp('2%'),
  },
  listViewInlineImg: {
    width: wp('91%'),
    height: wp('60%'),
    marginLeft: wp('3.5%'),
    borderWidth: 1,
    borderRadius: wp('3%'),
  },
  foodNameDiv: {
    left: 16,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  foodNameText: {
    fontSize: hp('2.5%'),
  },
  locationDiv: {
    left: 16,
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  locationText: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold'
  },
  comment: {
    paddingHorizontal: wp('2%')
  },
  likeText: {
    fontSize: hp('2.5%'),
    paddingHorizontal: wp('2%'),
    paddingBottom: wp('4%'),
  },
  fabIcon: {
    color: '#FF7200',
    fontSize: hp('2.5%'),
    marginLeft: wp('60%'),
    fontSize: 26,
  },
});