import React from 'react';
import SignupHome from './SignupHome';
import SignupSecond from './SignupSecond';

import firebase from 'react-native-firebase';

export default class signup extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      signup: [],
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      description: '',
      gender: '',
      errorMessage: 'this is an error',
      profilePicture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    }
    this.ref = firebase.firestore().collection('signup')
  }

  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  };

  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  };

  handleChange = (input, value) => {
    this.setState({
      [input]: value
    });
  };

  insertUser = () => {
    let context = this;
    let db = firebase.firestore();
    const { fullName, email, phoneNumber, password, description, gender, profilePicture } = this.state;
    const values = { fullName, email, phoneNumber, password, description, gender, profilePicture }
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function (cred) {
      return db.collection("signup").doc(cred.user.uid).set({
        email: values.email,
        fullName: values.fullName,
        password: values.password,
        phoneNumber: values.phoneNumber,
        gender: values.gender,
        description: values.description,
        profilePicture: values.profilePicture
      }).then(function () {
        context.props.navigation.navigate('homeFixed', { email: values.email })
      })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    });
  }

  render() {

    const { step } = this.state;
    const { fullName, email, phoneNumber, password, description, gender, profilePicture } = this.state;
    const values = { fullName, email, phoneNumber, password, description, gender, profilePicture }

    switch (step) {
      case 1:
        return (
          <SignupHome
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
      case 2:
        return (
          <SignupSecond
            prevStep={this.prevStep}
            handleChange={this.handleChange}
            values={values}
            insertUser={this.insertUser.bind(this)}
          />
        );
    }
  }
}
