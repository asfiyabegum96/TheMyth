import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
}
  from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';
import main from "../authentication/styles/main";
import RadialGradient from 'react-native-radial-gradient';

export default class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      signup: [],
      email: '',
      password: '',
      fieldNotEmpty: false,
      isInvalid: false,
      hidePassword: true

    }
    this.ref = firebase.firestore().collection('signup')
  }

  setPasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  }

  checkUser() {
    const context = this;
    let userEmail = context.state.email.trim();
    let verifyPassword = context.state.password;
    firebase.auth().signInWithEmailAndPassword(userEmail, verifyPassword).then(function () {
      context.setState({ isInvalid: false })
      context.props.navigation.navigate('homeFixed', { email: context.state.email })
    }).catch((error) => {
      if (error)
        this.setState({ isInvalid: true })
    })
  }

  // check Textfields are not empty

  requireField = () => {
    const context = this;
    if (context.state.email !== '' && context.state.password !== '') {
      context.handleLogin();
      context.setState({
        fieldNotEmpty: false,
      });
    }
    else {
      context.setState({
        fieldNotEmpty: true
      });
    }
  }


  handleLogin = () => {
    this.checkUser();
  }

  fieldRef = React.createRef();

  onSubmit = () => {
    let { current: field } = this.fieldRef;
  };

  formatText = (text) => {
    // return text.replace(/[^+\d]/g, '');
    return text.clear();
  };

  componentDidMount() {
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }
  render() {
    return (
      <RadialGradient style={{ width: '100%', height: '100%' }}
        colors={['#FE7948', '#E23E00']}
        stops={[0.1, 0.95]}
        center={[180, 270]}
        radius={400}>
        {
          <ScrollView keyboardShouldPersistTaps={true} style={styles.container}>
            <View style={styles.logo}>
              <Image
                source={require('../images/mythlogo.png')}
                style={main.logo} />
            </View>
            <View style={styles.TextInputDiv}>
              {/* <View style={{ flexDirection: 'row', }}> */}
              <Text style={main.labelContainer}>Email *</Text>
              <TextInput
                ref={input => { this.fieldRef = input }}
                maxLength={50}
                style={main.inputContainer}
                textColor='white'
                baseColor="white"
                tintColor="white"
                onChangeText={(text) => this.setState({ email: text })}
                value={this.state.email}
              />
              <Text style={main.labelContainer}>Password *</Text>
              <View>
                <TextInput
                  ref={input => { this.fieldRef = input }}
                  maxLength={50}
                  minLength={8}
                  onSubmitEditing={this.onSubmit}
                  style={main.passwordContainer}
                  textColor='white'
                  baseColor="white"
                  tintColor="white"
                  secureTextEntry={this.state.hidePassword}
                  onChangeText={(text) => this.setState({ password: text })}
                  value={this.state.password}
                />
                <TouchableOpacity style={{ zIndex: 999999, marginTop: wp('-11.5%'), marginLeft: wp('70%') }} onPress={this.setPasswordVisibility}>
                  {this.state.hidePassword === true ?
                    <FontAwesome5 style={styles.hideIcon} name={'eye'} />
                    :
                    <FontAwesome5 style={styles.hideIcon} name={'eye-slash'} />
                  }
                </TouchableOpacity>
              </View>
              {this.state.fieldNotEmpty == true ? (
                <Text style={{ color: 'red' }}>Please enter email and password</Text>
              ) : (
                  <View></View>
                )}

              {this.state.isInvalid == true ? (
                <Text style={{ color: 'red' }}>Incorrect email ID or password</Text>
              ) : (
                  <View></View>
                )}

            </View>
            <View style={styles.CreateDiv}>
              <View>
                <Text style={styles.pass}>Don't have an account?</Text>
              </View>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('signup')} >
                <Text style={styles.pass2}>Create</Text>
              </TouchableOpacity>
            </View>
            <View style={main.primaryButtonContanier}>
              <TouchableOpacity onPress={() => this.requireField()}>
                <Text style={main.primaryButtonText}>Sign In</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => this.props.navigation.navigate('forgotPassword')} style={styles.ForgotPassDiv}>
              <Text style={styles.ForgotPass}
              >Trouble logging in?</Text>
            </TouchableOpacity>
            {this.state.loading == true ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color='red' />
              </View>
            ) : <View></View>}
          </ScrollView>}
      </RadialGradient>

    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  TextInputDiv: {
    marginLeft: wp('10%'),
    // marginTop: wp('10%'),
  },
  ForgotPassDiv: {
    left: wp('35%'),
    marginTop: wp('3%'),
    marginBottom: wp('5%')

  },
  ForgotPass: {
    color: '#fff',
    fontSize: hp('2%'),
    fontStyle: 'italic'
  },
  but: {
    left: 130,
    width: wp('35%'),
    marginTop: wp('3%'),
    alignItems: 'center',

  },
  hideIcon: {
    color: '#fff',
    padding: wp('2%'),
    fontSize: 18
  },
  CreateDiv: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: wp('8%'),
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
    marginTop: wp('10%')
  },
  iconStyle: {
    marginTop: wp('8.5%'), borderBottomColor: '#000', borderBottomWidth: 0.5,
    borderRightWidth: 0.5,
    borderRightColor: '#000',
    height: hp('3.75%'),
    paddingRight: wp('3%'),
  }
});