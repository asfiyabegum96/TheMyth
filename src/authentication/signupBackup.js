import React from 'react';
import {Text,
        View,
        AppRegistry,
        AsyncStorage,
        StyleSheet,
        Image,
        TextInput,
        ScrollView,
        Button,
        TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import CheckBox from 'react-native-modest-checkbox';
import { TextField } from 'react-native-material-textfield';
import {widthPercentageToDP as wp, 
        heightPercentageToDP as hp,
        listenOrientationChange as loc,
        removeOrientationListener as rol} 
from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';

const Jaguar = '#22222C';
let statusforredudancy=0;

export default class signup extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
    signup: [],
    fullName: '', 
    email: '',
    phoneNumber: '', 
    password: '', 
    errorMessage: 'this is an error' }
    this.ref = firebase.firestore().collection('signup')
}
checkUser =() => {
  let db = firebase.firestore();
  let signupRef = db.collection('signup');
  let userEmail = this.state.email;
  let query = signupRef.where('email', '==', userEmail ).get()
  .then(snapshot => {
    statusforredudancy=0;
    if (snapshot.empty) {
     // alert('no document found');
      statusforredudancy=1;
      return;
    } 
    else
    {
     // alert('document found');
      statusforredudancy=0;
      return;
    } 
    // snapshot.forEach(doc => {
    //   console.log(doc.id, '=>', doc.data());
    // });
  })
  .catch(err => {
    //console.log('Error getting documents', err);
    return 0;
  });
}

componentDidMount() {
  loc(this);
  this.unsubscribe = this.ref.onSnapshot((querySnapshot) =>{
    const signNew = [];
    querySnapshot.forEach((doc) => {
      signNew.push({
        signup: doc.data().signup
      });
    });
    this.setState({
      signup: signNew
    });
  });
}

submitSignUp = () => {
  this.checkUser();
    if(statusforredudancy == 1){
      alert("ready for insert");
      this.ref.add({
        fullName: this.state.fullName,
        email: this.state.email,
        phoneNumber: this.state.phoneNumber,
        password: this.state.password
      }).then((data) => {
        console.log('added data = ${data}');
        this.setState({
          fullName: '',
          email:'',
          phoneNumber: '',
          password: ''
        });
      }).catch((error) => {
        console.log('error adding Firestore document = ${error}');
        this.setState({
          fullName: '',
          email:'',
          phoneNumber: '',
          password: ''
        });
      })
    }
    else{
      alert("id already exist");
    }
    statusforredudancy=0;
}



onSubmit = () => {
  
}

formatText = (text) => {
  return text.replace(/[^+\d]/g, '');
};

  
 componentWillUnMount() {
    rol();
  }
	render() {
		return (
			<ScrollView style={styles.container}>
      <View style={styles.TitleDiv}>
        <Text style={styles.title}>Create Account</Text>
      </View>
			<View style={styles.TextInputDiv}>
      <TextField 
        label='Full Name'
        onSubmitEditing={this.onSubmit}
        ref="fullName"
        containerStyle={{ width: wp('70%'),}}
        textColor='#FCD705'
        baseColor="white"
        tintColor="#FCD705"
        onChangeText={fullName => this.setState({ fullName })}
        value={this.state.fullName}
        />
        <TextField 
        label='Email'
        onSubmitEditing={this.onSubmit}
        ref="email"
        containerStyle={{ width: wp('70%'),}}
        textColor='#FCD705'
        baseColor="white"
        tintColor="#FCD705"
        keyboardType={'email-address'}
        onChangeText={email => this.setState({ email })}
        value={this.state.email}
        />
        <TextField 
        label='Mobile Number'
        onSubmitEditing={this.onSubmit}
        ref="phoneNumber"
        containerStyle={{ width: wp('70%'),}}
        textColor='#FCD705'
        baseColor="white"
        tintColor="#FCD705"
        onChangeText={phoneNumber => this.setState({ phoneNumber })}
        keyboardType={'number-pad'}
        value={this.state.phoneNumber}
        />
        <TextField 
        label='Password'
        onSubmitEditing={this.onSubmit}
        ref="password"
        containerStyle={{ width: wp('70%'),}}
        textColor='#FCD705'
        baseColor="white"
        tintColor="#FCD705"
        onChangeText={password => this.setState({password })}
        value={this.state.password}
        />
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
                <TouchableOpacity onPress={this.onSubmit()}>          
                    <Text style={styles.butText}>SIGN UP</Text>
                </TouchableOpacity>
                <Text style={{ color: 'white', marginTop:wp('3%') }}>Or create using social media</Text>
            </View>
            <View style={styles.socialIconDiv}>
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
            </View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create ({
	container: {
		backgroundColor: '#121212',
		flex: 1,
  },
  TitleDiv: {
    alignItems:'center',
    marginTop:wp('15%')
  },
  title: {
    color: '#FCD705',
    fontSize: hp('4%'),
    fontWeight: 'bold',
    },
  TextInputDiv: {
    alignItems: 'center',
    marginTop: wp('5%') 
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
	checkboxDiv:{
		marginLeft: 35,
	},
	but: {
        alignItems: 'center',
        borderRadius: 15,
        marginTop:wp('3%')
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
    },
    socialIconDiv: {
      flexDirection: 'row', 
      justifyContent:'center',
      padding: 5,
      marginTop:wp('3%')
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
});