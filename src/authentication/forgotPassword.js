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


export default class forgotPassword extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            signup: [],
            email: '',
            password: '',
            fieldNotEmpty: false,
            isInvalid: false

        }
        this.ref = firebase.firestore().collection('signup')
    }

    checkUser() {
        let db = firebase.firestore();
        let signupRef = db.collection('signup');
        let userEmail = this.state.email;
        let verifyPassword = this.state.password;
        let query = signupRef.where('email', '==', userEmail.trim()).where('password', '==', verifyPassword).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    this.setState({ isInvalid: true })
                    return;
                }
                else {
                    this.setState({ isInvalid: false })
                    this.props.navigation.navigate('homeFixed')
                    return;
                }
            })
            .catch(err => {
                return 0;
            });
    }

    // check Textfields are not empty

    updatePassword = () => {
        const context = this;
        if (this.state.email !== '') {
            firebase.auth().sendPasswordResetEmail(this.state.email.trim()).then((data) => {
                alert('Please check your mail to reset your password!')
                context.props.navigation.navigate('Home')
                this.setState({
                    fieldNotEmpty: false,
                })
            }).catch((error) => {
                alert('Incorrect Email ID')
            });
        }
        else {
            this.setState({
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

        console.log(field.value());
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
            <ScrollView style={styles.container}>
                <View style={styles.TitleDiv}>
                    <Text style={styles.title}>TheMyth</Text>
                    <Text style={styles.titleSub}>Reset Password</Text>
                </View>
                <View style={styles.TextInputDiv}>
                    <TextField
                        placeholder='Enter your email ID to reset'
                        placeholderTextColor='#fff'
                        onSubmitEditing={this.onSubmit}
                        ref={input => { this.fieldRef = input }}
                        containerStyle={{ width: wp('70%') }}
                        textColor='#FCD705'
                        baseColor="white"
                        tintColor="#FCD705"
                        onChangeText={(text) => this.setState({ email: text })}
                        value={this.state.email}
                    />
                    {this.state.fieldNotEmpty == true ? (
                        <Text style={{ color: 'red' }}>Please enter email and password</Text>
                    ) : (
                            <View></View>
                        )}
                </View>
                <View style={styles.but}>
                    <TouchableOpacity onPress={() => this.updatePassword()}>
                        <Text style={styles.butText}>Reset</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
        flex: 1,
    },
    TitleDiv: {
        left: 55,
        marginTop: wp('10%')
    },
    title: {
        color: '#FCD705',
        fontSize: hp('6%'),
        fontWeight: 'bold',
    },
    titleSub: {
        color: '#FCD705',
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
        color: 'white',
        fontSize: hp('2.5%'),
    },
    but: {
        left: 130,
        width: wp('35%'),
        marginTop: wp('3%'),
        alignItems: 'center'
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
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FCD705'
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
        color: 'white',
        fontSize: hp('2.5%'),
    },
    pass2: {
        color: '#FCD705',
        fontSize: hp('2.5%'),
        paddingLeft: 5,
    },
});