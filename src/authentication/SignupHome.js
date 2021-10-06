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
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';
import {GoogleSignin} from '@react-native-community/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import main from './styles/main';
import RadialGradient from 'react-native-radial-gradient';
export default class SignupHome extends React.Component {
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
      clicked: false,
    };
    this.ref = firebase.firestore().collection('signup');
  }

  setPasswordVisibility = () => {
    this.setState({hidePassword: !this.state.hidePassword});
  };

  onSubmit = () => {
    let {current: field} = this.fieldRef;

    console.log(field.value());
  };

  // check Textfields are not empty

  requireField = e => {
    const values = this.props.values;
    if (
      values.email !== '' &&
      values.password !== '' &&
      values.fullName !== '' &&
      values.confirmPassword !== ''
    ) {
      this.setState({
        fieldNotEmpty: false,
      });
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (
        reg.test(values.email) &&
        values.password.length >= 8 &&
        values.password === values.confirmPassword
      ) {
        this.setState({
          passwordInvalid: false,
          passwordMismatch: false,
          emailInvalid: false,
        });
        this.continue(e);
      } else {
        if (!reg.test(values.email)) {
          this.setState({
            passwordInvalid: false,
            passwordMismatch: false,
            emailInvalid: true,
          });
        }
        if (values.password.length < 8) {
          this.setState({
            passwordInvalid: true,
            passwordMismatch: false,
            emailInvalid: false,
          });
        }
        if (values.password !== values.confirmPassword) {
          this.setState({
            passwordMismatch: true,
            passwordInvalid: false,
            emailInvalid: false,
          });
        }
      }
    } else {
      this.setState({
        fieldNotEmpty: true,
      });
    }
  };

  continue = e => {
    const context = this;
    e.preventDefault();
    let db = firebase.firestore();
    let signupRef = db.collection('signup');
    let userEmail = context.props.values.email.toLowerCase();
    let query = signupRef
      .where('email', '==', userEmail.trim())
      .where('isDeleted', '==', false)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          this.setState({clicked: true});
          this.props.nextStep();
          return;
        } else {
          this.setState({isInvalid: true});
        }
      })
      .catch(err => {
        return 0;
      });
  };

  onGoogleButtonPress = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = firebase.auth.GoogleAuthProvider.credential(
      idToken,
    );

    // Sign-in the user with the credential
    return firebase.auth().signInWithCredential(googleCredential);
  };
  onFacebookButtonPress = async () => {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    return firebase.auth().signInWithCredential(facebookCredential);
  };

  componentDidMount() {
    this.setState({
      loading: false,
    });
    loc(this);
    GoogleSignin.configure({
      webClientId:
        '119026447603-caakapp6njtis28ujb4qs7b5dgqkh9el.apps.googleusercontent.com',
    });
  }

  componentWillUnMount() {
    rol();
  }

  render() {
    const {values, handleChange} = this.props;

    return (
      <RadialGradient
        style={{width: '100%', height: '100%'}}
        colors={['#FE7948', '#E23E00']}
        stops={[0.1, 0.95]}
        center={[180, 270]}
        radius={400}>
        {
          <React.Fragment>
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
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={true}
                style={styles.container}>
                <View style={styles.container1}>
                  <View style={styles.logo}>
                    <Image
                      source={require('../images/mythlogo.png')}
                      style={main.logo}
                    />
                  </View>
                  {/*sign up with socials-google */}
                  <View>
                    <TouchableOpacity
                      style={styles.authbutton}
                      onPress={() => this.onGoogleButtonPress()}>
                      <Image
                        source={require('../images/google.png')}
                        style={styles.authimage}
                      />
                      <Text style={styles.authtext}>Sign up with Google</Text>
                    </TouchableOpacity>
                    {/*sign up with socials-facebook */}
                    <TouchableOpacity
                      style={styles.authbutton}
                      onPress={() => this.onFacebookButtonPress()}>
                      <Image
                        source={require('../images/facebook.png')}
                        style={styles.authimage}
                      />
                      <Text style={styles.authtext}>Sign up with Facebook</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.TextInputDiv}>
                    <Text style={main.labelContainer}>Full Name *</Text>
                    <TextInput
                      onSubmitEditing={this.requireField}
                      ref={this.fieldRef}
                      style={main.inputContainer}
                      textColor="white"
                      baseColor="white"
                      tintColor="white"
                      onChangeText={text => handleChange('fullName', text)}
                      defaultValue={values.fullName}
                    />
                    <Text style={main.labelContainer}>Email *</Text>
                    <TextInput
                      onSubmitEditing={this.requireField}
                      ref="email"
                      style={main.inputContainer}
                      textColor="white"
                      baseColor="white"
                      tintColor="white"
                      keyboardType={'email-address'}
                      onChangeText={text => handleChange('email', text)}
                      defaultValue={values.email}
                    />
                    {this.state.emailInvalid == true ? (
                      <Text style={{color: 'black'}}>
                        Please enter a valid Email ID
                      </Text>
                    ) : (
                      <View />
                    )}
                    {this.state.isInvalid == true ? (
                      <Text style={{color: 'black'}}>
                        Email ID already exists!
                      </Text>
                    ) : (
                      <View />
                    )}
                    <Text style={main.labelContainer}>Password *</Text>
                    <View style={{flexDirection: 'row'}}>
                      <TextInput
                        onSubmitEditing={this.requireField}
                        ref="password"
                        style={main.passwordContainer}
                        textColor="white"
                        baseColor="white"
                        tintColor="white"
                        secureTextEntry={this.state.hidePassword}
                        onChangeText={text => handleChange('password', text)}
                        defaultValue={values.password}
                      />
                      {/* <TouchableOpacity style={{ zIndex: 999999, }} onPress={this.setPasswordVisibility}>
                      {this.state.hidePassword === true ?
                        <FontAwesome5 style={styles.hideIcon} name={'eye'} />
                        :
                        <FontAwesome5 style={styles.hideIcon} name={'eye-slash'} />
                      }
                    </TouchableOpacity> */}
                    </View>
                    <Text style={main.labelContainer}>Confirm Password *</Text>
                    <TextInput
                      onSubmitEditing={this.requireField}
                      ref="confirmPassword"
                      style={main.inputContainer}
                      textColor="#ed5720"
                      baseColor="black"
                      tintColor="#ed5720"
                      secureTextEntry={true}
                      onChangeText={text =>
                        handleChange('confirmPassword', text)
                      }
                      defaultValue={values.confirmPassword}
                    />
                    {this.state.passwordInvalid == true ? (
                      <Text style={{color: 'black', alignSelf: 'center'}}>
                        Please enter strong password
                      </Text>
                    ) : (
                      <View />
                    )}
                    {this.state.passwordMismatch == true ? (
                      <Text style={{color: 'black', alignSelf: 'center'}}>
                        Password mismatch!
                      </Text>
                    ) : (
                      <View />
                    )}
                    {this.state.fieldNotEmpty == true ? (
                      <Text style={{color: 'black', alignSelf: 'center'}}>
                        Please enter all values
                      </Text>
                    ) : (
                      <View />
                    )}
                  </View>
                  <View style={main.primaryButtonContanier}>
                    {this.state.clicked === false ? (
                      <TouchableOpacity disabled={this.state.clicked} style={{justifyContent: 'center', height: 40}}>
                        <Text
                          style={main.primaryButtonText1}
                          onPress={this.requireField}>
                          Next
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <></>
                    )}
                  </View>
                  {/* <View style={styles.socialIconDiv}>
              <TouchableOpacity>
                <Text style={{ paddingRight: 40 }}>
                  <FontAwesome5 style={styles.fontFacebook} name={'facebook-square'} />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <FontAwesome5 style={styles.fontInsta} name={'instagram'} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={{ paddingLeft: 40 }}>
                  <FontAwesome5 style={styles.fontGoogle} name={'google-plus'} />
                </Text>
              </TouchableOpacity>
            </View> */}
                </View>
              </ScrollView>
            )}
          </React.Fragment>
        }
      </RadialGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#ed5720',
  },
  container1: {
    marginBottom: 25,
  },
  title: {
    color: '#fff',
    fontSize: hp('4%'),
    fontWeight: 'bold',
  },
  TextInputDiv: {
    // marginTop: wp('-10%'),
    marginBottom: wp('10%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  checkboxDiv: {
    marginLeft: 35,
  },
  but: {
    alignItems: 'center',
    borderRadius: 6,
    marginTop: wp('3%'),
  },
  butText: {
    color: '#fff2e7',
    fontSize: hp('3%'),
    marginTop: 10,
    borderColor: '#A9A9A9',
    backgroundColor: '#ed5720',
    paddingVertical: 8,
    paddingHorizontal: 20,
    fontWeight: 'bold',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ed5720',
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
    color: '#fff',
    padding: wp('2%'),
  },
  logo: {
    left: 55,
  },
  authbutton: {
    height: 50,
    width: '80%',
    backgroundColor: '#ed5720',
    elevation: 5,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  authimage: {
    height: 30,
    width: 30,
    alignSelf: 'center',
    marginHorizontal: 10,
    left: 0,
    position: 'absolute',
  },
  authtext: {
    fontSize: 14,
    color: 'white',
    fontWeight: '400',
    alignSelf: 'center',
    position: 'absolute',
  },
});
