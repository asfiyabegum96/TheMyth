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
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
}
    from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';
import main from "./styles/main";

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
                    this.props.navigation.navigate('Home')
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
                    <Image
                        source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTvAIbW8Ka6_KCCozwRCw2_lhWYqQUGyti9ZkVCQWqfeKElydG8" }}
                        style={{
                            width: wp('25%'),
                            height: hp('15%'),
                            borderRadius: wp('30%'),
                            resizeMode: 'cover',
                            marginLeft: wp('25%'),
                            marginTop: wp('10%')
                        }} />
                </View>
                <View style={styles.TextInputDiv}>
                    <TextField
                        placeholder='Enter your email ID to reset'
                        placeholderTextColor='#000'
                        ref={input => { this.fieldRef = input }}
                        containerStyle={{ width: wp('75%') }}
                        textColor='#FF7200'
                        baseColor="#FF7200"
                        tintColor="#FF7200"
                        onChangeText={(text) => this.setState({ email: text })}
                        value={this.state.email}
                    />
                    {this.state.fieldNotEmpty == true ? (
                        <Text style={{ color: 'red' }}>Please enter your registered email ID!</Text>
                    ) : (
                            <View></View>
                        )}
                </View>
                <View style={main.buttonContainer}>
                    <TouchableOpacity onPress={() => this.updatePassword()}>
                        <Text style={main.buttonText}>Reset</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    TitleDiv: {
        left: 55,
        marginTop: wp('30%')
    },
    TextInputDiv: {
        alignItems: 'center',
        marginTop: wp('10%'),
        marginBottom: wp('60%')
    },
});