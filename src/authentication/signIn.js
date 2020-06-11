import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
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
import main from "../authentication/styles/main";
import Icon from 'react-native-vector-icons/Entypo';
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
        <View style={styles.logo}>
          <Image
            source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTvAIbW8Ka6_KCCozwRCw2_lhWYqQUGyti9ZkVCQWqfeKElydG8" }}
            style={{
              width: wp('25%'),
              height: hp('15%'),
              borderRadius: wp('30%'),
              resizeMode: 'cover',
              marginLeft: wp('20%'),
              marginTop: wp('5%')
            }} />
        </View>
        <View style={styles.TextInputDiv}>
          <View style={{ flexDirection: 'row', }}>
            <Icon name={'email'} size={17} color="#000" style={styles.iconStyle} />
            <TextField
              label='Email *'
              onSubmitEditing={this.onSubmit}
              ref={input => { this.fieldRef = input }}
              containerStyle={{ width: wp('70%') }}
              textColor='#FF7200'
              baseColor="black"
              tintColor="#FF7200"
              style={{ paddingLeft: wp('2%') }}
              labelTextStyle={{ fontSize: wp('2%'), paddingLeft: wp('2%') }}
              fontSize={14}
              onChangeText={(text) => this.setState({ email: text })}
              value={this.state.email}
            />
          </View>
          <View style={{ flexDirection: 'row', }}>
            <Icon name={'lock'} size={17} color="#000" style={styles.iconStyle} />
            <TextField
              label='Password *'
              style={{ paddingLeft: wp('2%') }}
              onSubmitEditing={this.onSubmit}
              ref={input => { this.fieldRef = input }}
              containerStyle={{ width: wp('65%'), }}
              labelTextStyle={{ fontSize: wp('2%'), paddingLeft: wp('2%') }}
              underlineColorAndroid="transparent"
              textColor='#FF7200'
              baseColor="black"
              tintColor="#FF7200"
              fontSize={14}
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
        <View style={main.buttonContainer}>
          <TouchableOpacity onPress={() => this.requireField()}>
            <Text style={main.buttonText}>SIGN IN</Text>
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
    backgroundColor: '#fff',
    flex: 1,
  },
  TextInputDiv: {
    alignItems: 'center',
    marginTop: wp('15%'),
  },
  ForgotPassDiv: {
    left: wp('35%'),
    marginTop: wp('3%'),
    marginBottom: wp('5%')

  },
  ForgotPass: {
    color: '#FF7200',
    fontSize: hp('2%'),
  },
  but: {
    left: 130,
    width: wp('35%'),
    marginTop: wp('3%'),
    alignItems: 'center',

  },
  hideIcon: {
    fontSize: 18,
    color: '#000',
    marginTop: wp('9.6%'),
    paddingBottom: wp('1%'),
    borderBottomColor: '#000', borderBottomWidth: 0.5,
  },
  CreateDiv: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: wp('8%')
  },
  pass: {
    color: 'black',
    fontSize: hp('2%'),
  },
  pass2: {
    color: '#FF7200',
    fontSize: hp('2%'),
    paddingLeft: 5,
  },
  logo: {
    left: wp('20%'),
    marginTop: wp('15%')
  },
  iconStyle: {
    marginTop: wp('8.5%'), borderBottomColor: '#000', borderBottomWidth: 0.5,
    borderRightWidth: 0.5,
    borderRightColor: '#000',
    height: hp('3.75%'),
    paddingRight: wp('3%'),
  }
});