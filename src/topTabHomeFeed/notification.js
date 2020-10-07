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
  ActivityIndicator,
  FlatList,
  BackHandler
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Entypo';
import UserAvatar from 'react-native-user-avatar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
}
  from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';
import main from '../authentication/styles/main'
const Jaguar = '#22222C';

export default class notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      feedData: [],
      feedRefresh: false,
    }
    this.baseState = this.state;
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    this._onFocusListener = this.props.navigation.addListener('didFocus', (payload) => {
      // Perform the reset action here
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    loc(this);
    this.fetchFollowers();
  }

  fetchFollowers = () => {
    let isFollower = false;
    let emailArray = [];
    let context = this;
    let db = firebase.firestore();
    let photosRef = db.collection('signup');
    photosRef.doc(context.props.screenProps.userDetails.docRef).collection('following').get().then(function (followerSnapshot) {
      followerSnapshot.forEach(function (followerDoc) {
        const docNotEmpty = (followerDoc.id, " => ", followerDoc.data() != null);
        if (docNotEmpty) {
          isFollower = true;
          emailArray.push(followerDoc.data().email);
        }
      });
      context.fetchNotificationList(emailArray);
      context.setState({ emailArray: emailArray });
    });
  }

  fetchNotificationList = (emailArray) => {
    this.setState({
      feedData: [],
      feedRefresh: true
    });
    let that = this;
    let db = firebase.firestore();
    let notificationRef = db.collection('notifications');
    notificationRef.orderBy('postedTime', 'desc').get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        let data;
        const docNotEmpty = (doc.id, " => ", doc.data() != null);
        if (docNotEmpty) {
          data = (doc.id, " => ", doc.data());
          if (emailArray.includes(data.email)) {
            let feedData = that.state.feedData;
            that.addToFlatlist(feedData, data);
          }
        } else {
          that.setState({
            feedRefresh: false,
            loading: false,
          });
        }
      });
    });
    that.setState({
      feedRefresh: false,
      loading: false,
    });
  }

  addToFlatlist = (feedData, data) => {
    var that = this;
    feedData.push({
      title: data.title,
      postedTime: that.timeConverter(data.postedTime),
      body: data.body,
      userAvatar: data.userAvatar,
      docRef: data.docRef,
      email: data.email
    });
    that.setState({
      feedRefresh: false,
      loading: false,
    });
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

  // Cover the timestamp to show in real minutes
  pluralCheck = (s) => {
    if (s == 1) {
      return ' ago';
    } else {
      return 's ago';
    }
  }

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    rol();
    this.setState(this.baseState)
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    return true;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff6f2', }}>
        <View style={main.header}>
          <Text style={main.inputText}
          >Your Myths</Text>
          {/* <TouchableOpacity onPress={() => this.props.screenProps.navigateToOther.navigate('profile', { email: this.state.email.trim(), searchedEmail: this.state.email.trim(), privateAccount: false, isSameProfile: true })}>
                        <FontAwesome5 style={styles.profile} name={'user'} />
                    </TouchableOpacity> */}
        </View>
        <View>
          {this.state.loading == true ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              {/* <ActivityIndicator  style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} size="large" color='red' /> */}
            </View>
          ) : (
              <>
                <Text style={styles.time1}>Recents</Text>
                <FlatList
                  style={styles.root}
                  refreshing={this.state.feedRefresh}
                  onRefresh={this.fetchFollowers}
                  data={this.state.feedData}
                  extraData={this.state}
                  keyExtractor={(item) => {
                    return item.id;
                  }}
                  renderItem={(item) => {
                    const Notification = item.item;
                    return (
                      <View style={styles.container}>

                        <Image
                          source={{ uri: Notification.userAvatar }}
                          style={{
                            width: wp('20%'),
                            height: hp('10%'),
                            resizeMode: 'cover',
                            borderRadius: wp('5%'),
                          }} />

                        <View style={styles.content}>
                          <TouchableOpacity onPress={() => this.props.screenProps.navigation(item, false, false, false, true)}>
                            <View style={styles.contentHeader}>
                              <Text style={styles.time}>
                                {Notification.postedTime}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <Text style={styles.displaySection} rkType='primary3 mediumLine'>{Notification.body}</Text>
                        </View>
                      </View>
                    );
                  }} />
              </>
            )}
        </View>
      </View>
    );
  }
}

notification.navigationOptions = {
  tabBarIcon: ({ tintColor, focused }) => (
    <View style={styles.fab}>
      <Image
        source={require('../images/notifications.png')}
        style={styles.fabIcon} tintColor={tintColor} width={25} height={30} />
      {/* <FontAwesome5 style={styles.fabIcon} name='telegram-plane' size={30} /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  fab: {
    backgroundColor: '#fff',
    alignItems: 'center',
    // width: wp('15%'),
    // borderRadius: wp('10%'),
    justifyContent: 'center',
    width: 30,
    height: 40,
  },
  fabIcon: {
    color: '#fff',
    // padding: wp('2%'),
  },
  content: {
    marginLeft: 16,
    flex: 1,

  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  separator: {
    backgroundColor: '#FF7200'
  },
  separator1: {
    height: 2,
    backgroundColor: '#ccc',
    width: 300,
    marginLeft: wp('25%'),
    marginTop: wp('-5%'),
  },
  root: {
    backgroundColor: '#fff6f2',
    marginTop: 15,
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  displaySection: {
    color: "black",
    flexDirection: 'row',
    marginTop: wp('5%'),
    width: wp('43%'),
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 20,
    marginLeft: 20
  },
  time: {
    fontSize: 10,
    color: "#808080",
    marginLeft: wp('45%'),
    marginTop: wp('-20%'),
  },
  time1: {
    fontSize: 20,
    color: "black",
    marginTop: wp('5%'),
    marginLeft: wp('5%'),
    fontWeight: 'bold',
    marginBottom: wp('2%'),
  },
  bell: {
    fontSize: hp('3%'),
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 10,
    marginLeft: 20
  },
});

