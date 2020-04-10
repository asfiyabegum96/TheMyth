import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { TextField } from 'react-native-material-textfield';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
}
  from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';


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
      <ScrollView keyboardShouldPersistTaps={true} style={styles.container}>
        <View style={styles.TitleDiv}>
          <Text style={styles.title}>Myth</Text>
          <Text style={styles.titleSub}>Sign in to your account</Text>
        </View>
        <View style={styles.TextInputDiv}>
          <TextField
            label='Email *'
            onSubmitEditing={this.onSubmit}
            ref={input => { this.fieldRef = input }}
            containerStyle={{ width: wp('70%') }}
            textColor='#FF7200'
            baseColor="black"
            tintColor="#FF7200"
            onChangeText={(text) => this.setState({ email: text })}
            value={this.state.email}
          />
          <View style={{ flexDirection: 'row', }}>
            <TextField
              label='Password *'
              onSubmitEditing={this.onSubmit}
              ref={input => { this.fieldRef = input }}
              containerStyle={{ width: wp('65%'), }}
              underlineColorAndroid="transparent"
              textColor='#FF7200'
              baseColor="black"
              tintColor="#FF7200"
              minLength={8}
              secureTextEntry={this.state.hidePassword}
              onChangeText={(text) => this.setState({ password: text })}
              value={this.state.password}
            />
            <TouchableOpacity onPress={this.setPasswordVisibility}>
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
        <TouchableOpacity onPress={() => this.props.navigation.navigate('forgotPassword')} style={styles.ForgotPassDiv}>
          <Text style={styles.ForgotPass}
          >Forgot Password?</Text>
        </TouchableOpacity>
        <View style={styles.but}>
          <TouchableOpacity onPress={() => this.requireField()}>
            <Text style={styles.butText}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.CreateDiv}>
          <View>
            <Text style={styles.pass}>Don't have an account?</Text>
          </View>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('signup')} >
            <Text style={styles.pass2}>Create</Text>
          </TouchableOpacity>
        </View>
        {this.state.loading == true ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color='red' />
          </View>
        ) : <View></View>}
      </ScrollView >
    );
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff2e7',
    flex: 1,
  },
  TitleDiv: {
    left: 55,
    marginTop: wp('10%')
  },
  title: {
    color: '#FF7200',
    fontSize: hp('6%'),
    fontWeight: 'bold',
  },
  titleSub: {
    color: '#FF7200',
    fontSize: hp('3%'),
    marginBottom: 10,
    marginTop: 5,
  },
  TextInputDiv: {
    alignItems: 'center',
    marginTop: wp('20%')
  },
  ForgotPassDiv: {
    left: 210,
    marginTop: wp('3%')
  },
  ForgotPass: {
    color: '#FF7200',
    fontSize: hp('2.2%'),
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
    borderRadius:6,
    borderWidth: 1,
    borderColor: '#FF7200'
  },
  socialAccount: {
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: 'center',
    color: 'white',
    marginTop: wp('3%')
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
  hideIcon: {
    fontSize: 18,
    color: '#000',
    marginTop: wp('10.3%'),
    paddingBottom: wp('1%'),
    borderBottomColor: '#000', borderBottomWidth: 0.5,
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
    marginTop: wp('3%')
  },
  pass: {
    color: 'black',
    fontSize: hp('2.3%'),
  },
  pass2: {
    color: '#FF7200',
    fontSize: hp('2.3%'),
    paddingLeft: 5,
  },
});