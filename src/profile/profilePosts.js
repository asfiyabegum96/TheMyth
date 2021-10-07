import React from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import MasonryList from 'react-native-masonry-list';
import firebase from 'react-native-firebase';
import main from '../authentication/styles/main';
import postTab from './postTab';

export default class ProfilePosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      images: [],
      loading: true,
      navProps: props.screenProps.navigation,
      followText: 'Follow',
      followersCount: 0,
      followingCount: 0,
    };
    this.baseState = this.state;
  }

  componentDidMount() {
    loc(this);
    this.fetchUserDetails();
    this._unsubscribe = this.props.screenProps.navigation.addListener(
      'willFocus',
      () => {
        this.setState(this.baseState);
        this.fetchUserDetails();
      },
    );
  }

  fetchUserDetails() {
    const context = this;
    let email;
    let params = context.props.screenProps;
    let db = firebase.firestore();
    let photosRef = db.collection('signup');
    photosRef
      .where('email', '==', params.email)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          let data;
          const docNotEmpty = (doc.id, ' => ', doc.data() != null);
          if (docNotEmpty) data = (doc.id, ' => ', doc.data());
          context.setState({user: doc.data()});
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
    let params = context.props.screenProps;
    if (params.email) {
      photosRef
        .where('email', '==', params.email)
        .where('isDeleted', '==', false)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            let data;
            const docNotEmpty = (doc.id, ' => ', doc.data() != null);
            if (docNotEmpty) data = (doc.id, ' => ', doc.data());
            image.push({
              URL: doc.data().url,
              dimensions: {width: 900, height: 1050},
              item: doc.data(),
            });
          });
          context.setState({images: image, loading: false});
        });
    } else {
      context.setState({images: [], loading: false});
    }
  }

  componentWillUnMount() {
    rol();
    this._unsubscribe();
  }

  confirmDelete(item, index) {
    if (
      this.props &&
      this.props.screenProps &&
      this.props.screenProps.navigation &&
      this.props.screenProps.navigation.state &&
      this.props.screenProps.navigation.state.params &&
      this.props.screenProps.navigation.state.params.isSameProfile === true
    ) {
      Alert.alert(
        //title
        'Confirmation',
        //body
        'Are you sure to delete this post?',
        [
          {text: 'Yes', onPress: () => this.deletePost(item)},
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

  vpWidth = Dimensions.get('window').width;

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff6f2'}}>
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
        ) : (
          <MasonryList
            backgroundColor={'#fff6f2'}
            // listContainerStyle={{
            //   width: this.vpWidth * 0.33,
            //   height: 200,
            //   margin: 2,
            //   elevation: 5,
            // borderRadius: 10,
            // borderWidth: 1.5,
            // borderColor: 'white',
            // height: hp('15%'),
            // width: wp('27%'),
            // }}
            // listContainerStyle={{marginLeft: wp('3%')}}
            // imageContainerStyle={main.imagesContainer}
            imageContainerStyle={{
              width: this.vpWidth * 0.3,
              height: hp('15%'),
              margin: 2,
              elevation: 5,
              borderRadius: 10,
              borderWidth: 1.5,
              borderColor: 'white',
            }}
            spacing={2}
            onRefresh={this.fetchImages}
            columns={3}
            images={this.state.images}
            onLongPressImage={(item, index) => this.confirmDelete(item, index)}
            onPressImage={item =>
              this.props.screenProps.navigation.navigate('mainFeed', {
                selectedItem: item,
                email: this.props.screenProps.navigation.state.params.email.trim(),
                viewSpecificPhotos: true,
                viewOtherPhotos: true,
              })
            }
          />
        )}
      </View>
    );
  }
}
