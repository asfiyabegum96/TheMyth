import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  AsyncStorage,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';
import main from '../authentication/styles/main';
import RadialGradient from 'react-native-radial-gradient';
import {GoogleSignin} from '@react-native-community/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signup: [],
      email: '',
      password: '',
      fieldNotEmpty: false,
      isInvalid: false,
      hidePassword: true,
    };
    this.ref = firebase.firestore().collection('signup');
  }

  setPasswordVisibility = () => {
    this.setState({hidePassword: !this.state.hidePassword});
  };

  checkUser() {
    const context = this;
    let userEmail = context.state.email.trim();
    let verifyPassword = context.state.password;
    firebase
      .auth()
      .signInWithEmailAndPassword(userEmail, verifyPassword)
      .then(function() {
        context.setState({isInvalid: false});
        context.setToken();
        context.props.navigation.navigate('homeFixed', {
          email: context.state.email,
        });
      })
      .catch(error => {
        if (error) this.setState({isInvalid: true});
      });
  }

  // check Textfields are not empty

  requireField = () => {
    const context = this;
    if (context.state.email !== '' && context.state.password !== '') {
      context.handleLogin();
      context.setState({
        fieldNotEmpty: false,
      });
    } else {
      context.setState({
        fieldNotEmpty: true,
      });
    }
  };

  handleLogin = () => {
    this.checkUser();
  };

  fieldRef = React.createRef();

  onSubmit = () => {
    let {current: field} = this.fieldRef;
  };

  formatText = text => {
    // return text.replace(/[^+\d]/g, '');
    return text.clear();
  };

  componentDidMount() {
    this.checkUserAuthorization();
    loc(this);
    GoogleSignin.configure({
      webClientId:
        '119026447603-caakapp6njtis28ujb4qs7b5dgqkh9el.apps.googleusercontent.com',
    });
  }
  onGoogleButtonPress = async () => {
    // Get the users ID token
    const context = this;
    const userInfo = await GoogleSignin.signIn();
    const userEmail = userInfo.user.email;
    const Token = userInfo.idToken;

    // Create a Google credential with the token
    const googleCredential = firebase.auth.GoogleAuthProvider.credential(Token);

    firebase.auth().signInWithCredential(googleCredential);
    // Sign-in the user with the credential
  };
  onFacebookButtonPress = async () => {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    //console.log(result)
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
    const data = await AccessToken.getCurrentAccessToken();
    const token = data.accessToken;

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    firebase.auth().signInWithCredential(facebookCredential);
  };
  async checkUserAuthorization() {
    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          console.log('user has permission');
        } else {
          console.log('user does not have permission');
          this.getPermission();
        }
      });
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    this.setState({token: fcmToken});
    console.log('token from async storage', fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        console.log('token from firebase', fcmToken);
        this.setState({token: fcmToken});
        await AsyncStorage.setItem('fcmToken', fcmToken); // store in db during installing and access that token
      }
    }
  }

  setToken() {
    const context = this;
    let db = firebase.firestore();
    let userRef = db.collection('signup');
    userRef
      .where('email', '==', context.state.email.trim())
      .get()
      .then(function(userQuerySnapshot) {
        userQuerySnapshot.forEach(function(doc) {
          let userData;
          const docNotEmpty = (doc.id, ' => ', doc.data() != null);
          if (docNotEmpty) {
            userData = (doc.id, ' => ', doc.data());
            if (userData.token && userData.token.length >= 0) {
              if (!userData.token.includes(context.state.token)) {
                const token = userData.token;
                token.push(context.state.token);
                db.collection('signup')
                  .doc(userData.docRef)
                  .update({token: token});
              }
            }
          }
        });
      });
  }

  componentWillUnMount() {
    rol();
  }
  render() {
    return (
      <RadialGradient
        style={{width: '100%', height: '100%', justifyContent: 'center'}}
        colors={['#FE7948', '#E23E00']}
        stops={[0.1, 0.95]}
        center={[180, 270]}
        radius={400}>
        {
          <ScrollView keyboardShouldPersistTaps={true} style={styles.container}>
            <View style={styles.logo}>
              <Image
                source={require('../images/mythlogo.png')}
                style={main.logo}
              />
            </View>
            <View style={{backgroundColor: 'yellow'}}>
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: wp('-15%'),
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                Food. Photo. Memories
              </Text>
            </View>
            <View style={styles.TextInputDiv}>
              {/* <View style={{ flexDirection: 'row', }}> */}
              <Text style={main.labelContainer}>Email *</Text>
              <TextInput
                ref={input => {
                  this.fieldRef = input;
                }}
                maxLength={50}
                style={main.inputContainer}
                textColor="white"
                baseColor="white"
                tintColor="white"
                onChangeText={text => this.setState({email: text})}
                value={this.state.email}
              />
              <Text style={main.labelContainer}>Password *</Text>
              <View style={{justifyContent: 'center'}}>
                <TextInput
                  ref={input => {
                    this.fieldRef = input;
                  }}
                  maxLength={50}
                  minLength={8}
                  onSubmitEditing={this.onSubmit}
                  style={main.passwordContainer}
                  textColor="white"
                  baseColor="white"
                  tintColor="white"
                  secureTextEntry={this.state.hidePassword}
                  onChangeText={text => this.setState({password: text})}
                  value={this.state.password}
                />
                <TouchableOpacity
                  style={{
                    flex: 1,
                    zIndex: 999999,
                    position: 'absolute',
                    right: 10,
                  }}
                  onPress={this.setPasswordVisibility}>
                  {this.state.hidePassword === true ? (
                    <FontAwesome5 style={styles.hideIcon} name={'eye'} />
                  ) : (
                    <FontAwesome5 style={styles.hideIcon} name={'eye-slash'} />
                  )}
                </TouchableOpacity>
              </View>
              {this.state.fieldNotEmpty == true ? (
                <Text
                  style={{
                    color: 'black',
                    marginTop: wp('2%'),
                    alignSelf: 'center',
                  }}>
                  Please enter email and password
                </Text>
              ) : (
                <View />
              )}

              {this.state.isInvalid == true ? (
                <Text
                  style={{
                    color: 'black',
                    marginTop: wp('2%'),
                    alignSelf: 'center',
                  }}>
                  Incorrect email ID or password
                </Text>
              ) : (
                <View />
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 20,
                justifyContent: 'center',
              }}>
              <Text style={styles.authtext}>or continue with</Text>
              <TouchableOpacity onPress={() => this.onFacebookButtonPress()}>
                <Image
                  source={require('../images/facebook1.png')}
                  style={styles.authimage}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.onGoogleButtonPress()}>
                <Image
                  source={require('../images/google1.png')}
                  style={styles.authimage1}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.CreateDiv}>
              <View>
                <Text style={styles.pass}>Don't have an account?</Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('signup')}>
                <Text style={styles.pass2}>Create</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={main.primaryButtonContanier}
              onPress={() => this.requireField()}>
              <Text style={main.primaryButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('forgotPassword')}
              style={styles.ForgotPassDiv}>
              <Text style={styles.ForgotPass}>Trouble signing in?</Text>
            </TouchableOpacity>
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
              <View />
            )}
          </ScrollView>
        }
      </RadialGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  TextInputDiv: {
    marginTop: wp('-5%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  ForgotPassDiv: {
    left: wp('35%'),
    marginTop: wp('3%'),
    marginBottom: wp('5%'),
  },
  ForgotPass: {
    color: '#fff',
    fontSize: hp('2%'),
    fontStyle: 'italic',
  },
  but: {
    left: 130,
    width: wp('35%'),
    marginTop: wp('3%'),
    alignItems: 'center',
  },
  hideIcon: {
    color: '#fff',
    fontSize: 18,
  },
  CreateDiv: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: wp('8%'),
  },
  pass: {
    color: 'white',
    fontSize: hp('2%'),
  },
  pass2: {
    color: '#fff',
    fontSize: hp('2%'),
    paddingLeft: 5,
  },
  logo: {
    left: wp('14%'),
    marginTop: wp('5%'),
  },
  iconStyle: {
    marginTop: wp('8.5%'),
    borderBottomColor: '#000',
    borderBottomWidth: 0.5,
    borderRightWidth: 0.5,
    borderRightColor: '#000',
    height: hp('3.75%'),
    paddingRight: wp('3%'),
  },
  authimage: {
    height: 30,
    width: 30,
    alignSelf: 'center',
    marginHorizontal: 10,
    left: 0,
    // position: 'absolute',
  },
  authimage1: {
    height: 25,
    width: 25,
    alignSelf: 'center',
    left: 0,
    top: 2.5,
    // position: 'absolute',
  },
  authtext: {
    fontSize: 14,
    color: 'white',
    fontWeight: '400',
    alignSelf: 'center',
    // position: 'absolute',
  },
});
