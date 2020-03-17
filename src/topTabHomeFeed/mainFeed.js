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
    if (this.state.liked) {
      let db = firebase.firestore();
      db.collection("photos").doc(selectedPhoto.docRef).update({
        likes: selectedPhoto.likes - 1
      })
      this.state.photoFeedData[index].likes = selectedPhoto.likes - 1;
      this.state.photoFeedData[index].isLiked = false;
      this.setState({ alreadyLiked: false })
    } else {
      let db = firebase.firestore();
      db.collection("photos").doc(selectedPhoto.docRef).update({
        likes: selectedPhoto.likes + 1
      })
      this.state.photoFeedData[index].likes = selectedPhoto.likes + 1;
      this.state.photoFeedData[index].isLiked = true;
      this.setState({ alreadyLiked: true })
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
    let url = 'photos';
    let email;
    if (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params.isSavedCollection) {
      email = this.props.navigation.state.params.email
      url = this.props.navigation.state.params.isSavedCollection === true ? 'savedCollections' : 'photos';
    } else {
      email = this.props.screenProps.property.screenProps.email
    }
    let that = this;

    let db = firebase.firestore();
    let photosRef = db.collection(url);
    photosRef.orderBy('postedTime', 'desc').get().then(function (querySnapshot) {

      querySnapshot.forEach(function (doc) {

        let data;
        const docNotEmpty = (doc.id, " => ", doc.data() != null);
        if (docNotEmpty) data = (doc.id, " => ", doc.data());
        if (doc.data().isDeleted === false) {
          let photoFeedData = that.state.photoFeedData;
          let userRef = db.collection('signup');
          userRef.where('email', '==', email.trim()).get().then(function (userQuerySnapshot) {
            userQuerySnapshot.forEach(function (doc) {
              let userData;
              const docNotEmpty = (doc.id, " => ", doc.data() != null);
              if (docNotEmpty) {
                userData = (doc.id, " => ", doc.data());
                if (userData.email === data.email) {
                  that.addToFlatlist(photoFeedData, data, userData);
                }
              }
            });
          });
        }

      });
    });
  }

  addToFlatlist = (photoFeedData, data, userData) => {

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
      docRef: data.docRef
    });
    that.setState({
      feedRefresh: false,
      loading: false
    });
  }

  navigateToComment = ({ item, index }, isComment) => {
    if (this.props.screenProps) {
      this.props.screenProps.navigation({ item, index }, isComment)
    } else {
      if (isComment) {
        this.props.navigation.navigate('comments', { selectedItem: { item: item }, email: this.props.navigation.state.params.email.trim() })
      } else {
        this.addToSaveCollection({ item: item })
      }
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
            <ActivityIndicator size="large" color='red' />
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
                      <TouchableOpacity style={{ paddingHorizontal: 10, }}>
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
                      <TouchableOpacity onPress={() => this.navigateToComment({ item, index }, false)} style={{ paddingLeft: wp('1%') }}>
                        <Fontisto name="bookmark-alt" size={22} color="#22222C" />
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
  // elevation:{
  //   marginBottom: hp('2%'),
  //   borderColor:'#ffffff',
  //   paddingVertical: wp('1%'),
  //   borderWidth: wp('1%'),
  //   borderBottomEndRadius : 8,
  //   borderTopStartRadius: 8,
  //   borderTopEndRadius: 8,
  //   borderBottomStartRadius: 8,
  //   borderBottomLeftRadius:8,
  //   borderBottomRightRadius:8,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.5,
  //   shadowRadius: 0.5,
  //   elevation:5,
  // },
  feedBorder: {
    // borderTopWidth:wp('0.1%'),
    // borderTopColor: '#121212',
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
    // height: 275, 
    // resizeMode:'center',
    borderWidth: 1,
    borderRadius: wp('3%'),
    // borderColor: '#FCD705',
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
});