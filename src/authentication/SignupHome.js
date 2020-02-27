import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { TextField } from 'react-native-material-textfield';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
}
  from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';


export default class SignupHome extends React.Component {
  fieldRef = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      fieldNotEmpty: false,
      emailInvalid: false,
      passwordInvalid: false,
      isInvalid: false,
      loading: true,
      passwordMismatch: false,
      hidePassword: true
    }
    this.ref = firebase.firestore().collection('signup')
  }

  setPasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  }

  onSubmit = () => {
    let { current: field } = this.fieldRef;

    console.log(field.value());
  };

  // check Textfields are not empty

  requireField = (e) => {
    this.setState({ clicked: true })
    const values = this.props.values;
    if (values.email !== '' && values.password !== '' && values.fullName !== '' && values.confirmPassword !== '') {
      this.setState({
        fieldNotEmpty: false,
      });
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(values.email) && values.password.length >= 8 && values.password === values.confirmPassword) {
        this.setState({
          passwordInvalid: false,
          passwordMismatch: false,
          emailInvalid: false
        });
        this.continue(e);
      } else {
        if (!reg.test(values.email)) {
          this.setState({
            passwordInvalid: false,
            passwordMismatch: false,
            emailInvalid: true
          });
        }
        if (values.password.length < 8) {
          this.setState({
            passwordInvalid: true,
            passwordMismatch: false,
            emailInvalid: false
          });
        }
        if (values.password !== values.confirmPassword) {
          this.setState({
            passwordMismatch: true,
            passwordInvalid: false,
            emailInvalid: false
          })
        }
      }

    }
    else {
      this.setState({
        fieldNotEmpty: true
      });
    }
  }

  continue = e => {
    const context = this;
    e.preventDefault();
    let db = firebase.firestore();
    let signupRef = db.collection('signup');
    let userEmail = context.props.values.email;
    let query = signupRef.where('email', '==', userEmail.trim()).get()
      .then(snapshot => {
        if (snapshot.empty) {
          this.setState({ clicked: false })
          this.props.nextStep();
          return;
        }
        else {
          this.setState({ isInvalid: true })
        }
      })
      .catch(err => {
        return 0;
      });
  }

  componentDidMount() {
    this.setState({
      loading: false,
    });
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }

  render() {
    const { values, handleChange } = this.props;

    return (
      <React.Fragment>
        {this.state.loading == true ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color='red' />
          </View>
        ) :
          <ScrollView keyboardShouldPersistTaps={true} style={styles.container}>
            <View >
              <View style={styles.TitleDiv}>
                <Text style={styles.title}>Create Account</Text>
              </View>
              <View style={styles.TextInputDiv}>
                <TextField
                  label='Full Name *'
                  onSubmitEditing={this.onSubmit}
                  ref={this.fieldRef}
                  containerStyle={{ width: wp('70%'), height: hp('11%') }}
                  textColor='#FCD705'
                  baseColor="white"
                  tintColor="#FCD705"
                  // onChange={handleChange('fullName')}
                  onChangeText={text => handleChange('fullName', text)}
                  defaultValue={values.fullName}
                />
                <TextField
                  label='Email *'
                  ref="email"
                  containerStyle={{ width: wp('70%'), height: hp('11%') }}
                  textColor='#FCD705'
                  baseColor="white"
                  autoCapitalize="false"
                  tintColor="#FCD705"
                  keyboardType={'email-address'}
                  // onChange={handleChange('email')}
                  onChangeText={text => handleChange('email', text)}
                  defaultValue={values.email}
                />
                {this.state.emailInvalid == true ? (
                  <Text style={{ color: 'red' }}>Please enter a valid Email ID</Text>
                ) : (
                    <View></View>
                  )}
                {this.state.isInvalid == true ? (
                  <Text style={{ color: 'red' }}>Email ID already exists!</Text>
                ) : (
                    <View></View>
                  )}
                <View style={{ flexDirection: 'row', }}>
                  <TextField
                    label='Password *'
                    ref="password"
                    containerStyle={{ width: wp('65%'), height: hp('11%') }}
                    textColor='#FCD705'
                    baseColor="white"
                    tintColor="#FCD705"
                    secureTextEntry={this.state.hidePassword}
                    onChangeText={text => handleChange('password', text)}
                    defaultValue={values.password}
                  />
                  <TouchableOpacity onPress={this.setPasswordVisibility}>
                    {this.state.hidePassword === true ?
                      <FontAwesome5 style={styles.hideIcon} name={'eye-slash'} />
                      :
                      <FontAwesome5 style={styles.hideIcon} name={'eye'} />

                    }
                  </TouchableOpacity>
                </View>
                <TextField
                  label='Confirm Password *'
                  ref="confirmPassword"
                  containerStyle={{ width: wp('70%'), height: hp('11%') }}
                  textColor='#FCD705'
                  baseColor="white"
                  tintColor="#FCD705"
                  secureTextEntry={true}
                  onChangeText={text => handleChange('confirmPassword', text)}
                  defaultValue={values.confirmPassword}
                />
                {this.state.passwordInvalid == true ? (
                  <Text style={{ color: 'red' }}>Please enter strong password</Text>
                ) : (
                    <View></View>
                  )}
                {this.state.passwordMismatch == true ? (
                  <Text style={{ color: 'red' }}>Password mismatch!</Text>
                ) : (
                    <View></View>
                  )}
                {this.state.fieldNotEmpty == true ? (
                  <Text style={{ color: 'red' }}>Please enter all values</Text>
                ) : (
                    <View></View>
                  )}
              </View>

              <View style={styles.checkboxDiv}>
                {/* <CheckBox
                    checkedImage={require('../images/Checked.png')}
                    uncheckedImage={require('../images/unChecked.png')}
                    label='I accept all terms and conditions'
                    labelStyle={{ color:'white' }}
                    /> */}
              </View>
              <View style={styles.but}>
                <TouchableOpacity disabled={this.state.clicked} >
                  <Text style={styles.butText} onPress={this.requireField}>Continue</Text>
                </TouchableOpacity>
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
          </ScrollView>}
      </React.Fragment >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
  },
  TitleDiv: {
    alignItems: 'center',
    marginTop: wp('15%')
  },
  title: {
    color: '#FCD705',
    fontSize: hp('4%'),
    fontWeight: 'bold',
  },
  TextInputDiv: {
    alignItems: 'center',
    marginTop: wp('15%')
  },
  inputfield: {
    width: wp('88%'),
    paddingRight: 25,
    paddingLeft: 25,
    fontSize: hp('3%'),
    fontWeight: 'bold',
    color: '#22222C',
    marginBottom: 10,
    borderColor: '#FCD705',
    backgroundColor: '#A19FA3',
  },
  checkboxDiv: {
    marginLeft: 35,
  },
  but: {
    alignItems: 'center',
    borderRadius: 15,
    marginTop: wp('3%')
  },
  butText: {
    color: '#22222C',
    fontSize: hp('3%'),
    marginTop: 10,
    borderColor: '#A9A9A9',
    backgroundColor: '#FCD705',
    paddingVertical: 8,
    paddingHorizontal: 20,
    fontWeight: 'bold',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#FCD705'
  },
  socialIconDiv: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 5,
    marginTop: wp('3%')
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
    color: '#FAFBFF',
    marginTop: wp('11.6%'),
    paddingBottom: wp('2%'),
    borderBottomColor: '#A9A9A9', borderBottomWidth: 1,
  },
});