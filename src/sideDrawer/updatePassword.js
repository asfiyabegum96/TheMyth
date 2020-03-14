import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator
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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { StackActions, NavigationActions } from 'react-navigation';

export default class updatePassword extends React.Component {

    constructor(props) {
        super(props)
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
            loading: false
        }
    }

    navigateToRoute = (route) => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: route })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    // check Textfields are not empty

    requireField = () => {
        if (this.state.oldPassword !== '' && this.state.newPassword !== '' && this.state.confirmPassword !== '') {
            this.setState({
                fieldNotEmpty: false,
            });
            if (this.state.newPassword.length >= 8 && this.state.newPassword === this.state.confirmPassword) {
                this.setState({
                    passwordInvalid: false,
                    passwordMismatch: false,
                    isInvalid: false
                });
                this.updatePasswords();
            } else {
                if (this.state.newPassword.length < 8) {
                    this.setState({
                        passwordInvalid: true,
                        passwordMismatch: false,
                        isInvalid: false
                    });
                }
                if (this.state.newPassword !== this.state.confirmPassword) {
                    this.setState({
                        passwordMismatch: true,
                        passwordInvalid: false,
                        isInvalid: false
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

    updatePasswords() {
        const emailCred = firebase.auth.EmailAuthProvider.credential(
            firebase.auth().currentUser.email, this.state.oldPassword);
        firebase.auth().currentUser.reauthenticateWithCredential(emailCred)
            .then(() => {
                this.setState({ loading: true })
                // User successfully reauthenticated.
                firebase.auth().currentUser.updatePassword(this.state.newPassword).then(() => {
                    alert('Updated Password successfully!')
                    this.setState({ loading: false });
                    this.navigateToRoute('sideNavigator')
                })
            })
            .catch(error => {
                // Handle error.
                this.setState({ isInvalid: true })
                console.log(error)
            });
    }

    setPasswordVisibility = () => {
        this.setState({ hidePassword: !this.state.hidePassword });
    }

    setOldPasswordVisibility = () => {
        this.setState({ hideOldPassword: !this.state.hideOldPassword });
    }

    handleChange = (input, value) => {
        this.setState({
            [input]: value
        });
    };

    componentDidMount() {
        loc(this);
    }

    componentWillUnMount() {
        rol();
    }

    render() {
        return (
            <React.Fragment>
                {this.state.loading == true ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color='red' />
                    </View>
                ) :
                    <ScrollView keyboardShouldPersistTaps={true} style={styles.container}>
                        <View style={styles.TitleDiv}>
                            <Image
                                source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTvAIbW8Ka6_KCCozwRCw2_lhWYqQUGyti9ZkVCQWqfeKElydG8" }}
                                style={{
                                    width: wp('25%'),
                                    height: hp('15%'),
                                    borderRadius: wp('30%'),
                                    resizeMode: 'cover',
                                    marginTop: wp('20%')
                                }} />
                        </View>
                        <View style={styles.TitleDiv}>
                            <Text style={styles.title}>Update Password</Text>
                        </View>
                        <View style={styles.TextInputDiv}>
                            <View style={{ flexDirection: 'row', }}>
                                <TextField
                                    label='Old Password *'
                                    ref="password"
                                    containerStyle={{ width: wp('65%'), height: hp('11%') }}
                                    textColor='#FF7200'
                                    baseColor="black"
                                    tintColor="#FF7200"
                                    secureTextEntry={this.state.hideOldPassword}
                                    onChangeText={text => this.handleChange('oldPassword', text)}
                                />
                                <TouchableOpacity onPress={this.setOldPasswordVisibility}>
                                    {this.state.hideOldPassword === true ?
                                        <FontAwesome5 style={styles.hideIcon} name={'eye-slash'} />
                                        :
                                        <FontAwesome5 style={styles.hideIcon} name={'eye'} />

                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', }}>
                                <TextField
                                    label='New Password *'
                                    ref="password"
                                    containerStyle={{ width: wp('65%'), height: hp('11%') }}
                                    textColor='#FF7200'
                                    baseColor="black"
                                    tintColor="#FF7200"
                                    secureTextEntry={this.state.hidePassword}
                                    onChangeText={text => this.handleChange('newPassword', text)}
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
                                label='Re-enter New Password *'
                                ref="confirmPassword"
                                containerStyle={{ width: wp('70%'), height: hp('11%') }}
                                textColor='#FF7200'
                                baseColor="black"
                                tintColor="#FF7200"
                                secureTextEntry={true}
                                onChangeText={text => this.handleChange('confirmPassword', text)}
                            />
                            {this.state.passwordInvalid == true ? (
                                <Text style={{ color: 'red' }}>Please enter strong password.</Text>
                            ) : (
                                    <View></View>
                                )}
                            {this.state.passwordMismatch == true ? (
                                <Text style={{ color: 'red' }}>Password mismatch!</Text>
                            ) : (
                                    <View></View>
                                )}
                            {this.state.fieldNotEmpty == true ? (
                                <Text style={{ color: 'red' }}>Please enter all values.</Text>
                            ) : (
                                    <View></View>
                                )}
                            {this.state.isInvalid == true ? (
                                <Text style={{ color: 'red' }}>Incorrect Old Password!</Text>
                            ) : (
                                    <View></View>
                                )}
                        </View>
                        <View style={styles.but}>
                            <TouchableOpacity onPress={() => this.requireField()}>
                                <Text style={styles.butText}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>}
            </React.Fragment >
        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff2e7',
        flex: 1,
    },
    TitleDiv: {
        alignItems: 'center',
    },
    title: {
        color: '#FF7200',
        fontSize: hp('4%'),
        fontWeight: 'bold',
        marginTop: wp('5%')
    },
    titleSub: {
        color: '#FF7200',
        fontSize: hp('3%'),
        marginBottom: 10,
        marginTop: 5,
    },
    TextInputDiv: {
        alignItems: 'center',
        marginTop: wp('10%'),
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
        color: '#FF7200',
        fontSize: hp('2.5%'),
        paddingLeft: 5,
    },
    hideIcon: {
        fontSize: 18,
        color: '#000',
        marginTop: wp('11.7%'),
        paddingBottom: wp('2%'),
        borderBottomColor: '#000', borderBottomWidth: 0.5,
    },
});