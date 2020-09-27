import React from 'react';
import SignupHome from './SignupHome';
import SignupSecond from './SignupSecond';
import {
  ActivityIndicator,
  View,
  AsyncStorage
} from 'react-native';
import firebase from 'react-native-firebase';

export default class signup extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      loading: true,
      loadingSecond: false,
      signup: [],
      fullName: '',
      email: '',
      password: '',
      description: '',
      gender: '',
      confirmPassword: '',
      errorMessage: 'this is an error',
      imageId: this.uniqueId(),
      profilePicture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      token: null
    }
    this.ref = firebase.firestore().collection('signup')
  }

  componentDidMount() {
    this.setState({ loading: false });
    this.checkUserAuthorization();
  }

  async checkUserAuthorization() {
    firebase.messaging().hasPermission()
      .then((enabled) => {
        if (enabled) {
          console.log('user has permission');
        } else {
          console.log('user does not have permission');
          this.getPermission()
        }
      });
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    this.setState({ token: fcmToken })
    console.log('token from async storage', fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        console.log('token from firebase', fcmToken);
        this.setState({ token: fcmToken })
        await AsyncStorage.setItem("fcmToken", fcmToken, this.state.token); // store in db during installing and access that token
      }
    }
  }

  uniqueId = () => {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
  }

  // Generate random Id for images
  s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  nextStep = () => {
    this.setState({ loadingSecond: true })
    const { step } = this.state;
    this.setState({
      step: step + 1,
      loadingSecond: false
    });
  };

  prevStep = () => {
    this.setState({ loading: true })
    const { step } = this.state;
    this.setState({
      step: step - 1,
      loading: false
    });
  };

  handleChange = (input, value) => {
    this.setState({
      [input]: value
    });
  };

  navigateToSignIn = () => {
    let context = this;
    context.props.navigation.navigate('signIn')
  }

  getUrl(imagePath) {
    var firstTime = true;
    if (imagePath) {
      var uploadTask = firebase.storage().ref('images/userId/' + this.state.imageId).putFile(imagePath);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          let progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
          console.log('Upload is ' + progress + '% complete')
          this.setState({
            progress: progress
          });
          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            // complete
            this.setState({
              progress: 100
            });

            firebase.storage().ref('images/userId/' + this.state.imageId).getDownloadURL()
              .then((url) => {
                if (firstTime) {
                  firstTime = false;
                  this.processUpload(url);
                }
              });
          }
        },
        (error) => {
          unsubscribe();
        },
      );
    } else {
      this.processUpload("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png")
    }
  }

  insertUser = (imagePath) => {
    let context = this;
    context.setState({ loadingSecond: true });
    context.getUrl(imagePath);
  }

  processUpload(url) {
    const context = this;
    let db = firebase.firestore();
    const { fullName, email, password, description, gender, profilePicture } = this.state;
    const values = { fullName, email, password, description, gender, profilePicture }
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function (cred) {
      return db.collection("signup").doc(cred.user.uid).set({
        email: values.email.toLowerCase(),
        fullName: values.fullName,
        password: values.password,
        gender: values.gender,
        description: values.description,
        profilePicture: url,
        docRef: cred.user.uid,
        isDeleted: false,
        token: [context.state.token]
      }).then(function () {
        context.props.navigation.navigate('homeFixed', { email: values.email })
        context.loadingChange();
      })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    });
  }

  loadingChange() {
    this.setState({ loadingSecond: false })
  }

  render() {

    const { step } = this.state;
    const { fullName, email, password, description, gender, profilePicture, confirmPassword } = this.state;
    const values = { fullName, email, password, description, gender, profilePicture, confirmPassword }

    switch (step) {
      case 1:
        return (
          <React.Fragment>
            {this.state.loading == true ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color='red' />
              </View>
            ) : (
                <SignupHome
                  nextStep={this.nextStep}
                  handleChange={this.handleChange}
                  values={values}
                />)}
          </React.Fragment>
        );
      case 2:
        return (
          <React.Fragment>
            {this.state.loadingSecond == true ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color='red' />
              </View>
            ) : (
                <SignupSecond
                  prevStep={this.prevStep}
                  handleChange={this.handleChange}
                  values={values}
                  insertUser={this.insertUser.bind(this)}
                  navigateToSignIn={this.navigateToSignIn.bind(this)}
                />)}
          </React.Fragment>
        );
    }
  }
}
