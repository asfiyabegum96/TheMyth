import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  TextInput,
  BackHandler,
} from 'react-native';
import {TextField} from 'react-native-material-textfield';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';
import main from '../authentication/styles/main';
export default class editProfile extends React.Component {
  fieldRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      fieldNotEmpty: false,
      emailInvalid: false,
      passwordInvalid: false,
      isInvalid: false,
      loading: true,
      passwordMismatch: false,
      hidePassword: true,
      user: '',
      imageId: this.uniqueId(),
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

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

  // Generate random Id for images
  s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  fetchUserDetails() {
    const context = this;
    let db = firebase.firestore();
    let photosRef = db.collection('signup');
    photosRef
      .where('email', '==', this.props.navigation.state.params.email.trim())
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          let data;
          const docNotEmpty = (doc.id, ' => ', doc.data() != null);
          if (docNotEmpty) data = (doc.id, ' => ', doc.data());
          context.setState({user: doc.data()});
        });
      });
  }

  getUrl() {
    const imagePath = this.state.imagePath;
    var firstTime = true;
    var uploadTask = firebase
      .storage()
      .ref('images/userId/' + this.state.imageId)
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
            .ref('images/userId/' + this.state.imageId)
            .getDownloadURL()
            .then(url => {
              if (firstTime) {
                firstTime = false;
                this.processUpload(url);
              }
            });
        }
      },
      error => {
        unsubscribe();
      },
    );
  }

  updateProfileDetails() {
    if (this.state.imageSelected === true) {
      this.getUrl();
    } else {
      this.processUpload(null);
    }
  }

  processUpload(url) {
    let db = firebase.firestore();
    const saveParams = {
      profilePicture:
        this.state.imageSelected === true
          ? url
          : this.state.user.profilePicture,
      fullName:
        this.state.nameChanged === true
          ? this.state.fullName
          : this.state.user.fullName,
      description:
        this.state.descriptionChanged === true
          ? this.state.description
          : this.state.user.description,
    };
    db.collection('signup')
      .doc(this.state.user.docRef)
      .update(saveParams)
      .then(() => {
        this.props.navigation.goBack(null);
      });
  }

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
    this.setState({
      loading: false,
    });
    this.fetchUserDetails();
    loc(this);
  }

  componentWillUnMount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    rol();
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    return true;
  }

  // pick image from imagepicker
  selectImage = () => {
    const options = {
      title: 'Choose profile picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
        allowsEditing: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({
          imagePath: response.path.toString(),
          uri: response.uri,
          imageSelected: true,
        });
      }
    });
  };

  handleChange = (input, value) => {
    this.setState({
      [input]: value,
    });
    if (input === 'description') {
      this.setState({descriptionChanged: true});
    } else {
      this.setState({nameChanged: true});
    }
  };

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps={true} style={styles.container}>
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
          <View>
            <View style={styles.logo} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View>
                {this.state.imageSelected == true ? (
                  <TouchableOpacity onPress={this.selectImage}>
                    <Image
                      source={{uri: this.state.uri}}
                      style={{
                        width: wp('30%'),
                        height: hp('15%'),
                        resizeMode: 'cover',
                        borderRadius: wp('5%'),
                        marginTop: wp('30%'),
                      }}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{justifyContent: 'center', marginTop: wp('30%')}}
                    onPress={this.selectImage}>
                    <Image
                      source={{uri: this.state.user.profilePicture}}
                      style={{
                        width: wp('30%'),
                        height: hp('15%'),
                        resizeMode: 'cover',
                        borderRadius: wp('5%'),
                      }}
                    />
                    <Image
                      source={require('../images/person.png')}
                      style={{
                        width: wp('15%'),
                        height: wp('15%'),
                        // marginLeft: wp('19%'),
                        // marginTop: wp('-8%'),
                        resizeMode: 'cover',
                        position: 'absolute',
                        alignItems: 'flex-end',
                        alignSelf: 'flex-end',
                        bottom: -27.5,
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={styles.TextInputDiv}>
              <Text style={styles.labelContainer}>Name</Text>
              <TextInput
                ref={input => {
                  this.fieldRef = input;
                }}
                maxLength={150}
                style={styles.inputContainer}
                textColor="white"
                baseColor="white"
                tintColor="white"
                onChangeText={text => this.handleChange('fullName', text)}
                defaultValue={this.state.user.fullName}
              />

              <Text style={styles.labelContainer}>Description</Text>
              <TextInput
                ref={input => {
                  this.fieldRef = input;
                }}
                maxLength={150}
                style={styles.inputContainer}
                textColor="white"
                baseColor="white"
                tintColor="white"
                onChangeText={text => this.handleChange('description', text)}
                defaultValue={this.state.user.description}
              />
            </View>
            <View style={main.primaryButtonContanier}>
              <TouchableOpacity onPress={() => this.updateProfileDetails()}>
                <Text style={styles.primaryButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EE6E3D',
    flex: 1,
  },
  TitleDiv: {
    alignItems: 'center',
    marginTop: wp('5%'),
  },
  title: {
    color: '#EE6E3D',
    fontSize: hp('4%'),
    fontWeight: 'bold',
  },
  TextInputDiv: {
    marginTop: wp('10%'),
    marginBottom: wp('30%'),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  inputfield: {
    width: wp('88%'),
    paddingRight: 25,
    paddingLeft: 25,
    fontSize: hp('3%'),
    fontWeight: 'bold',
    color: '#22222C',
    marginBottom: 10,
    borderColor: '#EE6E3D',
    backgroundColor: '#A19FA3',
  },
  checkboxDiv: {
    marginLeft: 35,
  },
  but: {
    alignItems: 'center',
    borderRadius: 6,
    marginTop: wp('3%'),
  },
  labelContainer: {
    color: 'white',
    paddingBottom: wp('2%'),
    alignItems: 'center',
  },
  inputContainer: {
    width: wp('90%'),
    color: 'white',
    height: hp('6%'),
    marginBottom: wp('3%'),
    backgroundColor: '#EE6E3D',
    borderColor: 'white',
    borderWidth: 1.5,
    borderRadius: wp('2%'),
  },
  butText: {
    color: '#fff2e7',
    fontSize: hp('3%'),
    marginTop: 10,
    borderColor: '#A9A9A9',
    backgroundColor: '#EE6E3D',
    paddingVertical: 8,
    paddingHorizontal: 20,
    fontWeight: 'bold',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EE6E3D',
  },
  socialIconDiv: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 5,
    marginTop: wp('3%'),
  },
  fontFacebook: {
    fontSize: 30,
    color: '#FAFBFF',
  },
  fontInsta: {
    fontSize: 30,
    color: '#FAFBFF',
  },
  fontGoogle: {
    fontSize: 30,
    color: '#FAFBFF',
  },
  hideIcon: {
    fontSize: 18,
    color: '#000',
    marginTop: wp('11.7%'),
    paddingBottom: wp('2%'),
    borderBottomColor: '#000',
    borderBottomWidth: 0.5,
  },
  logo: {
    left: 55,
  },
  selectImage: {
    color: '#fff',
    fontSize: hp('2%'),
    marginTop: 10,
    borderColor: '#A9A9A9',
    backgroundColor: '#EE6E3D',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EE6E3D',
    fontWeight: 'bold',
  },
  primaryButtonText: {
    color: '#ed5720',
    alignSelf: 'center',
    fontSize: hp('2%'),
    paddingVertical: 8,
    fontWeight: 'bold',
  },
});
