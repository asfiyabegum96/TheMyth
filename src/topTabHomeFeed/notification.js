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
  FlatList
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
  }

  componentDidMount() {
    loc(this);
    this.fetchNotificationList();
  }

  fetchNotificationList = () => {
    this.setState({
      feedData: [],
      feedRefresh: true
    });
    let that = this;
    let db = firebase.firestore();
    let notificationRef = db.collection('notifications');
    notificationRef.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        let data;
        const docNotEmpty = (doc.id, " => ", doc.data() != null);
        if (docNotEmpty) {
          data = (doc.id, " => ", doc.data());
        }
        let feedData = that.state.feedData;
        that.addToFlatlist(feedData, data);
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
    rol();
    this.setState(this.baseState)
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff2e7', }}>
        <View
          style={{
            borderBottomColor: '#22222C',
            borderBottomWidth: 1.5,
          }} />
        <Text style={{
          fontSize: hp('3.5'),
          color: '#FF7200',
          paddingVertical: 7,
          left: 25
        }}>Notification</Text>
        <View
          style={{
            borderBottomColor: '#22222C',
            borderBottomWidth: wp('0.2'),
          }}>
          {this.state.loading == true ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color='red' />
            </View>
          ) : (
              <FlatList
                style={styles.root}
                refreshing={this.state.feedRefresh}
                onRefresh={this.fetchNotificationList}
                data={this.state.feedData}
                extraData={this.state}
                ItemSeparatorComponent={() => {
                  return (
                    <View style={styles.separator} />
                  )
                }}
                keyExtractor={(item) => {
                  return item.id;
                }}
                renderItem={(item) => {
                  const Notification = item.item;
                  return (
                    <View style={styles.container}>
                      <Image style={styles.image} source={{ uri: Notification.userAvatar }} />
                      <View style={styles.content}>
                        <TouchableOpacity onPress={() => this.props.screenProps.navigation(item, false, false, false, true)}>
                          <View style={styles.contentHeader}>
                            <Text style={styles.name}>{Notification.title}</Text>
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
            )}
        </View>
      </View>
    );
  }
}

notification.navigationOptions = {
  tabBarIcon: ({ tintColor, focused }) => (
    <FontAwesome5 name={'bell'}
      style={styles.bell}
      color={tintColor} />
  )
}

const styles = StyleSheet.create({
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
    height: 1,
    backgroundColor: '#FF7200'
  },
  root: {
    backgroundColor: '#fff2e7',
    paddingTop: 10,
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  displaySection: {
    color: "#FF7200",
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 20,
    marginLeft: 20
  },
  time: {
    fontSize: 11,
    color: "#808080",
  },
  bell: {
    fontSize: hp('3%'),
  }
});

