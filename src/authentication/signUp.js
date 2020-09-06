import React from 'react';
import SignupHome from './SignupHome';
import SignupSecond from './SignupSecond';
import {
  ActivityIndicator,
  View
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
      profilePicture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    }
    this.ref = firebase.firestore().collection('signup')
  }

  componentDidMount() {
    this.setState({ loading: false })
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

  insertUser = () => {
    let context = this;
    context.setState({ loadingSecond: true })
    let db = firebase.firestore();
    const { fullName, email, password, description, gender, profilePicture } = this.state;
    const values = { fullName, email, password, description, gender, profilePicture }
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function (cred) {
      return db.collection("signup").doc(cred.user.uid).set({
        email: values.email,
        fullName: values.fullName,
        password: values.password,
        gender: values.gender,
        description: values.description,
        profilePicture: values.profilePicture,
        docRef: cred.user.uid,
        isDeleted: false
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
