import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
import main from '../authentication/styles/main';
import Icon from 'react-native-vector-icons/Entypo';
import RadialGradient from 'react-native-radial-gradient';
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
        context.props.navigation.navigate('homeFixed', {
          email: context.state.email,
        });
      })
      .catch(error => {
        if (error) this.setState({isInvalid: true});
      });
  }

  // check Textfields are not empty

  login = () => {
    const context = this;
    context.props.navigation.navigate('signIn', {email: context.state.email});
  };
  signUp = () => {
    const context = this;
    context.props.navigation.navigate('signUp', {email: context.state.email});
  };

  handleLogin = () => {
    this.checkUser();
  };

  fieldRef = React.createRef();

  onSubmit = () => {
    let {current: field} = this.fieldRef;
  };

  componentDidMount() {
    loc(this);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.navigate('homeFixed', {email: user.email.trim()});
      }
    });
  }

  componentWillUnMount() {
    rol();
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
          <ScrollView keyboardShouldPersistTaps={true} style={styles.container}>
            <View style={styles.logo}>
              <Image
                source={require('../images/mythlogo.png')}
                style={main.logo}
              />
            </View>

            <View style={main.primaryButtonContanier}>
              <TouchableOpacity onPress={() => this.login()}>
                <Text style={main.primaryButtonText}>Sign In</Text>
              </TouchableOpacity>
            </View>
            <View style={main.buttonContainer}>
              <TouchableOpacity onPress={() => this.signUp()}>
                <Text style={main.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>

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
    marginTop: wp('10%'),
  },
  ForgotPassDiv: {
    left: wp('35%'),
    marginTop: wp('3%'),
    marginBottom: wp('5%'),
  },
  ForgotPass: {
    color: '#fff',
    fontSize: hp('2%'),
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
    fontSize: 18,
  },
  CreateDiv: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: wp('10%'),
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
    marginBottom: wp('20%'),
    marginTop: wp('30%'),
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
});
