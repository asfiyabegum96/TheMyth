import React from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Image,
  ScrollView,
  Button,
  TouchableOpacity,
  Alert,
  TextInput,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-picker';
import firebase from 'react-native-firebase';
import PushNotification from 'react-native-push-notification';
import main from '../authentication/styles/main';
import {StackActions, NavigationActions} from 'react-navigation';
import {Header} from 'react-native-elements';

class photosUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path: '',
      imageUri: null,
      imageId: this.uniqueId(),
      uploading: false,
      progress: 0,
      caption: '',
      location: '',
      user: '',
      fieldNotEmpty: false,
      token: '',
      uri: '',
      followers: [],
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.baseState = this.state;
  }
  tokenArray = [];
  componentDidMount() {
    this._onFocusListener = this.props.navigation.addListener(
      'didFocus',
      payload => {
        // Perform the reset action here
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.handleBackButtonClick,
        );
      },
    );
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    this.fetchUserDetails();
  }
  fetchUserDetails(){
    const context=this;
    let db=firebase.firestore()
    let photosRef=db.collection('signup');
    photosRef.where('email','==',context.props.screenProps.email)
    .get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        let data;
        const docNotEmpty=(doc.id,'=>',doc.data()!=null);
        context.setState({user:doc.data()})
        context.getFollowers()
      })
    })
  }
  componentWillUnMount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    this.setState(this.baseState);
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    return true;
  }

  // Generate random Id for images
  s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  uniqueId = () => {
    return (
      this.s4() +
      this.s4() +
      '-' +
      this.s4() +
      '-' +
      this.s4() +
      '-' +
      this.s4() +
      '-' +
      this.s4() +
      '-' +
      this.s4() +
      '-' +
      this.s4()
    );
  };
  selectImage=()=>{
    const options = {
      title: 'Food Upload',
      
      storageOptions: {
        skipBackup: true,
        path: 'images',
        allowEditing:true,
      },
      mediaType:'photo',
      quality:0.5,
      maxWidth:500,
      maxHeight:500,
    };
    ImagePicker.showImagePicker(options,(response)=>{
      console.log('Response=',response);
      this.setState({fieldNotEmpty:true})
      if(response.didCancel){
        console.log('User cancelled image picker')
      }
      else if(response.error){
        console.log('ImagePicker Error:',response.error);
      }
      else if(response.customButton){
        console.log('User tapped custom button',response.customButton)
      }
      else{
        this.setState({
          path:response.path.toString(),
          uri:response.uri,
          fieldNotEmpty:false
        })
      }
    })
 
  }

  getFollowers = () => {
    const context = this;
    const followers = [];
    let db = firebase.firestore();
    let photosRef = db.collection('signup');
    photosRef
      .doc(context.state.user.docRef)
      .collection('followers')
      .get()
      .then(function(followerSnapshot) {
        followerSnapshot.forEach(function(followerDoc) {
          const docNotEmpty = (followerDoc.id,
          ' => ',
          followerDoc.data() != null);
          if (docNotEmpty) {
            followers.push(followerDoc.data().email);
            context.getTokens(followerDoc.data().email);
          }
          context.setState({followers: followers});
        });
      });
  };

  getTokens(followerEmail) {
    const context = this;
    let db = firebase.firestore();
    let photosRef = db.collection('signup');
    photosRef
      .where('email', '==', followerEmail)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          let data;
          const docNotEmpty = (doc.id, ' => ', doc.data() != null);
          if (docNotEmpty) data = (doc.id, ' => ', doc.data());
          context.tokenArray.push(doc.data().token);
        });
      });
  }

  // upload image to fireabase storage
  uploadImage = () => {
    if (this.state.path) {
      Alert.alert(
        //title
        'Confirmation',
        //body
        'Tell us where you want to upload the photo!',
        [
          {text: 'My Wall', onPress: () => this.proceedToUpload(false)},
          {text: 'My Diary', onPress: () => this.proceedToUpload(true)},
        ],
        {cancelable: false},
        //clicking out side of alert will not cancel
      );
    } else {
      this.sendNotification();
      this.setState({fieldNotEmpty: true});
    }
  };

  proceedToUpload(flag) {
    if (this.state.path) {
      var firstTime = true;
      var imageId = this.state.imageId;
      var imagePath = this.state.path;
      var userDetails = this.state.user;
      this.setState({
        uploading: true,
      });
      var uploadTask = firebase
        .storage()
        .ref('images/userId/' + imageId)
        .putFile(imagePath);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          let progress = (
            (snapshot.bytesTransferred / snapshot.totalBytes) *
            100
          ).toFixed(0);
          console.log('Upload is ' + progress + '% complete');
          this.setState({
            progress: progress,
          });
          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            // complete
            this.setState({
              progress: 100,
            });

            firebase
              .storage()
              .ref('images/userId/' + imageId)
              .getDownloadURL()
              .then(url => {
                if (firstTime) {
                  firstTime = false;
                  this.processUpload(url, flag);
                }
              });
          }
        },
        error => {
          unsubscribe();
        },
      );
    }
  }

  //uploading feed data in cloud firestore
  processUpload = (imageUrl, flag) => {
    let firstTime = true;
    const url = flag ? 'diary' : 'photos';
    const context = this;
    let imageId = this.state.imageId;
    //Set variable for feed
    let author = this.state.user.fullName;
    let authorDescription = this.state.user.description;
    let caption = this.state.caption;
    let comments = 'yet to be added';
    let likes = 0;
    let location = this.state.location;
    let dateTime = Date.now();
    let timestamp = Math.floor(dateTime / 1000);
    let saved = false;
    let isDeleted = false;
    let userAvatar = this.state.user.profilePicture;
    // Create object for firestore
    let photoObj = {
      author: author,
      authorDescription: authorDescription,
      caption: caption,
      comments: comments,
      likes: likes,
      location: location,
      postedTime: timestamp,
      saved: saved,
      url: imageUrl,
      userAvatar: userAvatar,
      docRef: imageId,
      isDeleted: isDeleted,
      email: this.props.screenProps.email,
    };

    firebase
      .firestore()
      .collection(url)
      .doc(imageId)
      .set(photoObj)
      .then(function(docRef) {
        // alert('Image uploaded!');
        context.setState({
          uploading: false,
        });
        context.navigateToHome();
        if (!flag && context.tokenArray.length) {
          context.sendNotification(photoObj);
        }
        context.setState(context.baseState);
      });
  };

  navigateToHome() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: 'Home'})],
    });
    this.props.screenProps.navigateToOther.dispatch(resetAction);
  }

  async sendNotification(photoObj) {
    const FIREBASE_API_KEY =
      'AAAAG7aHdPM:APA91bF4Yc6qbYxvK90mhU1XheWJbYFnCjVQ13RRUGoUT6oDcI5xiqgUZXsNzxuB0CFuflonomJbDoNtFm1hFyPSLWyAi1LGMAVJpUV_HOjN_xvYRzwrN4U7vw5TZU9x2PMRvcZoaBQ_';
    const message = {
      registration_ids: this.tokenArray,
      notification: {
        title: 'Myth',
        body: 'One of your friends had a food cravings!',
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
    let dateTime = Date.now();
    let timestamp = Math.floor(dateTime / 1000);
    const notificationObj = {
      docRef: this.state.imageId,
      title: 'Photo upload',
      body: `${photoObj.author} added a photo!`,
      userAvatar: photoObj.userAvatar,
      postedTime: timestamp,
      email: photoObj.email,
      followersEmail: this.state.followers,
    };
    firebase
      .firestore()
      .collection('notifications')
      .doc(this.state.imageId)
      .set(notificationObj)
      .then(function(docRef) {});
    console.log(response);
  }

  MyCustomLeftComponent = () => {
    return (
      <View style={{bottom: 12.5}}>
        <Text
          style={{
            color: '#fff',
            fontWeight: '700',
            fontSize: 20,
            width: 200,
          }}>
          Add a photo
        </Text>
      </View>
    );
  };

  render() {
    return (
      <>
        {/* <Header
          leftComponent={<this.MyCustomLeftComponent />}
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
        /> */}
        <View style={main.header}>
          <Text style={main.inputText}>Add a photo</Text>
          {/* <TouchableOpacity onPress={() => this.props.screenProps.navigateToOther.navigate('profile', { email: this.state.email.trim(), searchedEmail: this.state.email.trim(), privateAccount: false, isSameProfile: true })}>
                        <FontAwesome5 style={styles.profile} name={'user'} />
                    </TouchableOpacity> */}
        </View>
        <ScrollView
          keyboardShouldPersistTaps={true}
          style={{flex: 1, padding: wp('3%'), backgroundColor: '#fff6f2'}}>
          <View style={styles.logo}>
            {this.state.uri ? (
              <Image
                source={{uri: this.state.uri}}
                style={{
                  width: wp('65%'),
                  height: hp('45%'),
                  borderRadius: wp('5%'),
                  resizeMode: 'cover',
                  marginTop: wp('5%'),
                  marginBottom: wp('5%'),
                }}
              />
            ) : (
              <Image
                source={require('../images/icecream.jpg')}
                style={{
                  width: wp('65%'),
                  height: hp('45%'),
                  borderRadius: wp('5%'),
                  resizeMode: 'cover',
                  marginTop: wp('5%'),
                  marginBottom: wp('5%'),
                }}
              />
            )}
          </View>
          <View style={styles.edit}>
            <TouchableOpacity
              style={{
                marginBottom: wp('5%'),
                marginTop: wp('-12.5%'),
                marginLeft: wp('-10%'),
              }}
              onPress={this.selectImage}>
              <Image
                source={require('../images/person.png')}
                style={{
                  width: wp('15%'),
                  height: wp('15%'),
                  resizeMode: 'cover',
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              paddingVertical: wp('1%'),
              backgroundColor: '#fff6f2',
            }}>
            <Text style={styles.labelContainer}>Caption</Text>
            <TextInput
              ref={input => {
                this.fieldRef = input;
              }}
              maxLength={150}
              style={styles.inputContainer}
              textColor="white"
              baseColor="white"
              tintColor="white"
              onChangeText={text => this.setState({caption: text})}
              value={this.state.caption}
            />

            <Text style={styles.labelContainer}>Location</Text>
            <TextInput
              ref={input => {
                this.fieldRef = input;
              }}
              maxLength={150}
              style={styles.inputContainer}
              textColor="white"
              baseColor="white"
              tintColor="white"
              onChangeText={text => this.setState({location: text})}
              value={this.state.location}
            />
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            {this.state.uploading == true ? (
              <View style={{marginTop: wp('2%')}}>
                <Text
                  style={{
                    color: '#EE6E3D',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  {this.state.progress}%
                </Text>
                <View>
                  {this.state.progress != 100 ? (
                    <ActivityIndicator size="small" color="#EE6E3D" />
                  ) : (
                    <View>
                      <Text>Processing</Text>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View />
            )}
          </View>
          {this.state.fieldNotEmpty === true ? (
            <Text style={{color: 'red', alignSelf: 'center'}}>
              Please select an image to upload
            </Text>
          ) : (
            <View />
          )}
          <View style={styles.uploadImageStyle}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => this.uploadImage()}>
              <View />
              <View>
                <Text style={styles.buttonText}>Post</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    );
  }
}
const styles = StyleSheet.create({
  uploadImageButton: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    borderWidth: wp('0.5%'),
    borderColor: '#EE6E3D',
    padding: wp('1%'),
    borderRadius: wp('1%'),
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    borderWidth: wp('0.5%'),
    borderColor: '#EE6E3D',
    padding: wp('1%'),

    borderRadius: wp('1%'),
  },
  images: {
    color: '#fff',
    fontSize: hp('2%'),
    paddingVertical: wp('0.5%'),
    paddingHorizontal: wp('0.8%'),
  },
  location: {
    color: '#121212',
    fontSize: hp('2%'),
    paddingVertical: wp('0.5%'),
    paddingHorizontal: wp('0.8%'),
  },
  logo: {
    left: 55,
  },
  edit: {
    left: 280,
  },
  inputContainer: {
    width: wp('94%'),
    height: hp('6%'),
    marginBottom: wp('3%'),
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1.5,
    borderRadius: wp('2%'),
  },
  labelContainer: {
    textAlign: 'left',
    color: 'black',
    paddingBottom: wp('2%'),
  },
  uploadImageStyle: {
    marginTop: wp('1%'),
    paddingTop: wp('1%'),
    paddingBottom: wp('1%'),
    backgroundColor: '#EE6E3D',
    borderRadius: 10,
    borderWidth: wp('0.5%'),
    borderColor: '#EE6E3D',
    width: wp('50%'),
    alignSelf: 'center',
    marginBottom: 50,
  },
  buttonText: {color: 'white', fontWeight: 'bold'},
});

export default photosUpload;
