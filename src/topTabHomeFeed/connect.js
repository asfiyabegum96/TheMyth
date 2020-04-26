import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  FlatList,
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

export default class connect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      feedData: [],
      email: props.screenProps.email
    }
    this.baseState = this.state;
  }

  componentDidMount() {
    this.fetchUserDetails();
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }


  fetchUserDetails() {
    const context = this;
    let db = firebase.firestore();
    let photosRef = db.collection('signup');
    photosRef.where('email', '==', context.state.email.trim()).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        let data;
        const docNotEmpty = (doc.id, " => ", doc.data() != null);
        if (docNotEmpty) {
          data = (doc.id, " => ", doc.data());
          context.setState({ user: doc.data() });
          context.getFollowers();
        }
      })
    })
  }

  getFollowers() {
    this.setState({ feedData: [] });
    if (this.state.user.isPrivateAccount === true) {
      let db = firebase.firestore();
      const context = this;
      let feedData = this.state.feedData;
      db.collection("signup").doc(this.state.user.docRef).collection('pendingFollowers').get().then(function (followerSnapshot) {
        followerSnapshot.forEach(function (doc) {
          let data;
          const docNotEmpty = (doc.id, " => ", doc.data() != null);
          if (docNotEmpty) {
            data = (doc.id, " => ", doc.data());
            // accepted - accepted request
            // cancelled - Ignored request
            // removed - removed by requestor
            if (!data.email.includes('accepted') || !data.email.includes('cancelled') || !data.email.includes('removed')) {
              context.addToFlatlist(feedData, data);
            } else {
              context.setState({
                feedData: [],
                feedRefresh: false,
                loading: false,
              })
            }
          } context.setState({
            feedData: [],
            feedRefresh: false,
            loading: false,
          })
        })
      })
    } else {
      this.setState({
        feedData: [],
        feedRefresh: false,
        loading: false,
      })
    }
  }

  addToFlatlist = (feedData, data) => {
    var that = this;
    feedData.push({
      fullName: data.fullName,
      profilePicture: data.profilePicture,
      email: data.email,
      docRef: data.docRef
    });
    that.setState({
      feedData: feedData,
      feedRefresh: false,
      loading: false,
    });
  }

  viewProfile(item) {
    this.props.screenProps.navigation({ item, email: this.state.email.trim(), isSameProfile: false }, false, false, true)
  }

  acceptRequest(item) {
    let db = firebase.firestore();
    const context = this;
    db.collection("signup").doc(item.docRef).collection('followers').doc(item.email.trim()).set({ email: item.email.trim() })
    db.collection("signup").doc(item.docRef).collection('pendingFollowers').doc(item.email.trim()).update({ email: item.email.trim() + '_accepted' }).then(() => {
      context.getFollowers();
    })
  }

  cancelRequest(item) {
    let db = firebase.firestore();
    const context = this;
    db.collection("signup").doc(item.docRef).collection('pendingFollowers').doc(item.email.trim()).update({ email: item.email.trim() + '_cancelled' }).then(() => {
      context.getFollowers();
    })
  }

  render() {
    return (
      <View style={{ flex: 1 }} >
        <View
          style={{
            borderBottomColor: '#22222C',
            borderBottomWidth: 1.5,
          }}>
          <Text style={{
            fontSize: hp('3.5'),
            color: '#FF7200',
            paddingVertical: 7,
            left: 25
          }}>Connect</Text></View>
        <View
          style={{
            borderBottomColor: '#22222C',
            borderBottomWidth: wp('0.2'),
          }}>
          <FlatList
            style={styles.root}
            data={this.state.feedData}
            extraData={this.state}
            ItemSeparatorComponent={
              () => { return <View style={styles.separator} /> }
            }
            keyExtractor={(item) => {
              return item.id;
            }}
            renderItem={(item) => {
              const Notification = item.item;
              return (
                <View style={{ flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 10 }}>
                  <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={() => { this.viewProfile(Notification) }}>
                    <UserAvatar size="70" name="Avishay Bar"
                      src={Notification.profilePicture} />
                  </TouchableOpacity>
                  <View>
                    <View style={{ paddingBottom: 10 }}>
                      <Text style={{
                        color: '#22222C',
                        fontSize: hp('2.5%'),
                      }}>{Notification.fullName}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity style={styles.accept} onPress={() => { this.acceptRequest(Notification) }}>
                        <Text style={{
                          color: '#fff',
                          fontSize: 12,
                        }}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.ignore} onPress={() => { this.cancelRequest(Notification) }}>
                        <Text>Ignore</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            }} />
        </View>
      </View >
    );
  }
}

connect.navigationOptions = {
  tabBarIcon: ({ tintColor, focused }) => (
    <FontAwesome5 name={'user-friends'}
      style={styles.connectUsers}
      color={tintColor} />
  )
}

const styles = StyleSheet.create({
  connectUsers: {
    fontSize: hp('3%'),
  },
  separator: {
    height: 1,
    backgroundColor: '#FF7200',
    width: wp('90%')
  },
  root: {
    backgroundColor: '#fff2e7',
    paddingTop: 10,
    paddingLeft: '5.5%',
  },
  accept: {
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FF7200',
    width: wp('25%'),
    alignItems: 'center',
    marginRight: 10,
  },
  ignore: {
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#F5F5F5',
    width: wp('25%'),
    alignItems: 'center'
  }
});

