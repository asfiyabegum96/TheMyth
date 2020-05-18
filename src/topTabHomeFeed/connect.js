import React from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
}
  from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';

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
    loc(this);
  }

  componentWillUnMount() {
    rol();
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
        <Text>Connect</Text>
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

