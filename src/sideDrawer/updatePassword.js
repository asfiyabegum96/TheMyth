import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {StackActions, NavigationActions} from 'react-navigation';
import main from '../authentication/styles/main';
import Toaster from 'react-native-toaster';
import RadialGradient from 'react-native-radial-gradient';
export default class updatePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldNotEmpty: false,
      isInvalid: false,
      hidePassword: true,
      hideOldPassword: true,
      passwordMismatch: false,
      passwordInvalid: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      loading: false,
      showAlert: false,
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  navigateToRoute = route => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: route})],
    });
    this.props.screenProps.navigation.dispatch(resetAction);
  };

  // check Textfields are not empty

  requireField = () => {
    if (
      this.state.oldPassword !== '' &&
      this.state.newPassword !== '' &&
      this.state.confirmPassword !== ''
    ) {
      this.setState({
        fieldNotEmpty: false,
      });
      if (
        this.state.newPassword.length >= 8 &&
        this.state.newPassword === this.state.confirmPassword
      ) {
        this.setState({
          passwordInvalid: false,
          passwordMismatch: false,
          isInvalid: false,
        });
        this.updatePasswords();
      } else {
        if (this.state.newPassword.length < 8) {
          this.setState({
            passwordInvalid: true,
            passwordMismatch: false,
            isInvalid: false,
          });
        }
        if (this.state.newPassword !== this.state.confirmPassword) {
          this.setState({
            passwordMismatch: true,
            passwordInvalid: false,
            isInvalid: false,
          });
        }
      }
    } else {
      this.setState({
        fieldNotEmpty: true,
      });
    }
  };

  updatePasswords() {
    const emailCred = firebase.auth.EmailAuthProvider.credential(
      firebase.auth().currentUser.email,
      this.state.oldPassword,
    );
    firebase
      .auth()
      .currentUser.reauthenticateWithCredential(emailCred)
      .then(() => {
        // User successfully reauthenticated.
        firebase
          .auth()
          .currentUser.updatePassword(this.state.newPassword)
          .then(() => {
            // alert('Updated Password successfully!')
            this.setState({
              loading: false,
              message: {
                text: (
                  <View styles={styles.toasterContainer}>
                    <Text style={styles.text}>
                      Updated Password successfully!
                    </Text>
                  </View>
                ),
                duration: 1000,
              },
              showAlert: true,
            });
            setTimeout(() => {
              this.props.navigation.goBack(null);
            }, 2000);
          });
      })
      .catch(error => {
        // Handle error.
        this.setState({isInvalid: true});
        console.log(error);
      });
  }

  setPasswordVisibility = () => {
    this.setState({hidePassword: !this.state.hidePassword});
  };

  setOldPasswordVisibility = () => {
    this.setState({hideOldPassword: !this.state.hideOldPassword});
  };

  handleChange = (input, value) => {
    this.setState({
      [input]: value,
    });
  };

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
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

  render() {
    return (
      <RadialGradient
        style={{width: '100%', height: '100%'}}
        colors={['#FE7948', '#E23E00']}
        stops={[0.1, 0.95]}
        center={[180, 270]}
        radius={400}>
        {
          <React.Fragment>
            <Toaster message={this.state.message} />
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
                keyboardShouldPersistTaps={true}
                style={styles.container}>
                <View style={styles.logo}>
                  <Image
                    source={require('../images/mythlogo.png')}
                    style={main.logo}
                  />
                </View>
                <View style={styles.TextInputDiv}>
                  <Text style={styles.labelContainer}>Old Password *</Text>
                  <TextInput
                    ref="password"
                    maxLength={50}
                    minLength={8}
                    onSubmitEditing={this.onSubmit}
                    style={main.passwordContainer}
                    textColor="white"
                    baseColor="white"
                    tintColor="white"
                    secureTextEntry={this.state.hideOldPassword}
                    onChangeText={text =>
                      this.handleChange('oldPassword', text)
                    }
                  />
                  {/* <TouchableOpacity style={{ zIndex: 999999, marginTop: wp('-11.5%'), marginLeft: wp('70%') }} onPress={this.setOldPasswordVisibility}>
                                        {this.state.hideOldPassword === true ?
                                            <FontAwesome5 style={styles.hideIcon} name={'eye-slash'} />
                                            :
                                            <FontAwesome5 style={styles.hideIcon} name={'eye'} />

                                        }
                                    </TouchableOpacity> */}
                  <Text style={styles.labelContainer}>New Password *</Text>
                  <TextInput
                    ref="password"
                    maxLength={50}
                    minLength={8}
                    onSubmitEditing={this.onSubmit}
                    style={main.passwordContainer}
                    textColor="white"
                    baseColor="white"
                    tintColor="white"
                    secureTextEntry={this.state.hidePassword}
                    onChangeText={text =>
                      this.handleChange('newPassword', text)
                    }
                  />
                  {/* <TextField
                                            label='New Password *'
                                            ref="password"
                                            containerStyle={{ width: wp('75%'), height: hp('11%') }}
                                            textColor='#FF7200'
                                            baseColor="black"
                                            tintColor="#FF7200"
                                            secureTextEntry={this.state.hidePassword}
                                            onChangeText={text => this.handleChange('newPassword', text)}
                                        /> */}
                  {/* <TouchableOpacity style={{ zIndex: 999999, marginTop: wp('-11.5%'), marginLeft: wp('70%') }} onPress={this.setPasswordVisibility}>
                                        {this.state.hidePassword === true ?
                                            <FontAwesome5 style={styles.hideIcon} name={'eye-slash'} />
                                            :
                                            <FontAwesome5 style={styles.hideIcon} name={'eye'} />

                                        }
                                    </TouchableOpacity> */}
                  <Text style={styles.labelContainer}>
                    Re-enter New Password *
                  </Text>
                  {/* <View style={{ flexDirection: 'row' }}> */}
                  <TextInput
                    onSubmitEditing={this.onSubmit}
                    ref="confirmPassword"
                    style={main.passwordContainer}
                    textColor="white"
                    baseColor="white"
                    tintColor="white"
                    secureTextEntry={true}
                    onChangeText={text =>
                      this.handleChange('confirmPassword', text)
                    }
                  />
                  {/* <TextField
                                            label='Re-enter New Password *'
                                            ref="confirmPassword"
                                            containerStyle={{ width: wp('80%'), height: hp('11%') }}
                                            textColor='#FF7200'
                                            baseColor="black"
                                            tintColor="#FF7200"
                                            secureTextEntry={true}
                                            onChangeText={text => this.handleChange('confirmPassword', text)}
                                        /> */}
                  {this.state.passwordInvalid == true ? (
                    <Text style={{color: 'black'}}>
                      Please enter strong password.
                    </Text>
                  ) : (
                    <View />
                  )}
                  {this.state.passwordMismatch == true ? (
                    <Text style={{color: 'black'}}>Password mismatch!</Text>
                  ) : (
                    <View />
                  )}
                  {this.state.fieldNotEmpty == true ? (
                    <Text style={{color: 'black', alignSelf: 'center'}}>
                      Please enter all values.
                    </Text>
                  ) : (
                    <View />
                  )}
                  {this.state.isInvalid == true ? (
                    <Text style={{color: 'black'}}>
                      Incorrect Old Password!
                    </Text>
                  ) : (
                    <View />
                  )}
                </View>
                <TouchableOpacity
                  style={main.primaryButtonContanier}
                  onPress={() => this.requireField()}>
                  <Text style={styles.primaryButtonText}>Update</Text>
                </TouchableOpacity>
                {this.state.showAlert === true ? (
                  <Toaster message={this.state.message} />
                ) : (
                  <></>
                )}
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
    marginTop: wp('-10%'),
  },
  toasterContainer: {
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 15,
    paddingLeft: 15,
  },
  text: {
    backgroundColor: '#fff',
    color: '#000',
    height: hp('4%'),
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: wp('4%'),
  },
  TitleDiv: {
    alignItems: 'center',
  },
  title: {
    color: '#FF7200',
    fontSize: hp('4%'),
    fontWeight: 'bold',
    marginTop: wp('5%'),
  },
  titleSub: {
    color: '#FF7200',
    fontSize: hp('3%'),
    marginBottom: 10,
    marginTop: 5,
  },
  TextInputDiv: {
    // marginLeft: wp('10%'),
    marginTop: wp('-16%'),
    marginBottom: wp('25%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  ForgotPassDiv: {
    left: 210,
    marginTop: wp('3%'),
  },
  ForgotPass: {
    color: 'white',
    fontSize: hp('2.5%'),
  },
  but: {
    left: 130,
    width: wp('35%'),
    marginTop: wp('3%'),
    alignItems: 'center',
  },
  butText: {
    color: '#fff2e7',
    fontSize: hp('3%'),
    marginTop: 10,
    borderColor: '#A9A9A9',
    backgroundColor: '#FF7200',
    paddingVertical: 8,
    paddingHorizontal: 20,
    fontWeight: 'bold',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF7200',
  },
  socialAccount: {
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: 'center',
    color: 'white',
    marginTop: wp('3%'),
  },
  socialIconDiv: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: wp('3%'),
    zIndex: 10,
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
  CreateDiv: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: wp('3%'),
  },
  pass: {
    color: 'white',
    fontSize: hp('2.5%'),
  },
  pass2: {
    color: '#FF7200',
    fontSize: hp('2.5%'),
    paddingLeft: 5,
  },
  hideIcon: {
    color: '#fff',
    padding: wp('2%'),
    fontSize: 18,
  },
  logo: {
    left: 55,
  },
  labelContainer: {
    textAlign: 'left',
    color: '#FFFFFF',
    paddingBottom: wp('2%'),
  },
  primaryButtonText: {
    color: '#ed5720',
    alignSelf: 'center',
    fontSize: hp('2%'),
    paddingVertical: 8,
    fontWeight: 'bold',
  },
});
