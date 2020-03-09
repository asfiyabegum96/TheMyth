import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Image
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


export default class editProfile extends React.Component {
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
            hidePassword: true,
            user: ''
        }
        this.ref = firebase.firestore().collection('signup')
    }

    fetchUserDetails() {
        const context = this;
        let db = firebase.firestore();
        let photosRef = db.collection('signup');
        photosRef.where('email', '==', 'asfiidarlachu@gmail.com').get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                let data;
                const docNotEmpty = (doc.id, " => ", doc.data() != null);
                if (docNotEmpty) data = (doc.id, " => ", doc.data());
                console.log(doc.data())
                context.setState({ user: doc.data(), })
            })
        })
    }

    onSubmit = () => {
        let { current: field } = this.fieldRef;

        console.log(field.value());
    };

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
        this.fetchUserDetails();
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
                        <View >
                            <View style={styles.logo}>
                                {/* <Text style={styles.title}>TheMyth</Text>
                    <Text style={styles.titleSub}>Reset Password</Text> */}
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
                            <View style={styles.TitleDiv}>
                                <Text style={styles.title}>Update Account</Text>
                            </View>
                            <View style={styles.TextInputDiv}>
                                <TextField
                                    label='Full Name *'
                                    onSubmitEditing={this.onSubmit}
                                    ref={this.fieldRef}
                                    containerStyle={{ width: wp('70%'), height: hp('11%') }}
                                    textColor='#FF7200'
                                    baseColor="black"
                                    tintColor="#FF7200"
                                    onChangeText={text => handleChange('fullName', text)}
                                    defaultValue={this.state.user.fullName}
                                />
                                <TextField
                                    label='Description *'
                                    ref="description"
                                    containerStyle={{ width: wp('70%'), height: hp('11%') }}
                                    textColor='#FF7200'
                                    baseColor="black"
                                    autoCapitalize="false"
                                    tintColor="#FF7200"
                                    onChangeText={text => handleChange('email', text)}
                                    defaultValue={this.state.user.description}
                                />
                            </View>
                            <View style={styles.but}>
                                <TouchableOpacity disabled={this.state.clicked} >
                                    <Text style={styles.butText}>Continue</Text>
                                </TouchableOpacity>
                            </View>
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
        marginTop: wp('5%')
    },
    title: {
        color: '#FF7200',
        fontSize: hp('4%'),
        fontWeight: 'bold',
    },
    TextInputDiv: {
        alignItems: 'center',
        marginTop: wp('10%')
    },
    inputfield: {
        width: wp('88%'),
        paddingRight: 25,
        paddingLeft: 25,
        fontSize: hp('3%'),
        fontWeight: 'bold',
        color: '#22222C',
        marginBottom: 10,
        borderColor: '#FF7200',
        backgroundColor: '#A19FA3',
    },
    checkboxDiv: {
        marginLeft: 35,
    },
    but: {
        alignItems: 'center',
        borderRadius: 6,
        marginTop: wp('3%')
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
        color: '#000',
        marginTop: wp('11.7%'),
        paddingBottom: wp('2%'),
        borderBottomColor: '#000', borderBottomWidth: 0.5,
    },
    logo: {
        left: 55,
    },
});