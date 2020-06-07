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
import { TextField } from 'react-native-material-textfield';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
}
    from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';
import main from "../authentication/styles/main";
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
    }

    fetchUserDetails() {
        const context = this;
        let db = firebase.firestore();
        let photosRef = db.collection('signup');
        photosRef.where('email', '==', this.props.navigation.state.params.email.trim()).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                let data;
                const docNotEmpty = (doc.id, " => ", doc.data() != null);
                if (docNotEmpty) data = (doc.id, " => ", doc.data());
                context.setState({ user: doc.data(), });
            })
        })
    }

    updateProfileDetails() {
        let db = firebase.firestore();
        const saveParams = {
            profilePicture: this.state.imageSelected === true ? this.state.uri : this.state.user.profilePicture,
            fullName: this.state.nameChanged === true ? this.state.fullName : this.state.user.fullName,
            description: this.state.descriptionChanged === true ? this.state.description : this.state.user.description
        }
        db.collection('signup').doc(this.state.user.docRef).update(saveParams).then(() => {
            alert('success');
            this.navigateToRoute();
        })
    }

    navigateToRoute = () => {
        this.props.navigation.state.params.navigation.navigate('sideNavigator');
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

    // pick image from imagepicker
    selectImage = () => {
        const options = {
            title: 'Choose profile picture',
            storageOptions: {
                skipBackup: true,
                path: 'images',
                allowsEditing: true,
            },
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);

            }
            else {
                this.setState({
                    imagePath: response.path.toString(),
                    uri: response.uri,
                    imageSelected: true,
                });
            }
        });
    }

    handleChange = (input, value) => {
        this.setState({
            [input]: value,
        });
        if (input === 'description') {
            this.setState({ descriptionChanged: true })
        } else {
            this.setState({ nameChanged: true })
        }
    };

    render() {
        return (
            <ScrollView keyboardShouldPersistTaps={true} style={styles.container}>
                {this.state.loading == true ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color='red' />
                    </View>
                ) :
                    <View >
                        <View style={styles.logo}>
                            <Image
                                source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTvAIbW8Ka6_KCCozwRCw2_lhWYqQUGyti9ZkVCQWqfeKElydG8" }}
                                style={{
                                    width: wp('25%'),
                                    height: hp('15%'),
                                    borderRadius: wp('30%'),
                                    resizeMode: 'cover',
                                    marginLeft: wp('20%'),
                                    marginTop: wp('5%'),
                                    marginBottom: wp('10%')
                                }} />
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: "center",
                        }}>
                            <View>
                                {this.state.imageSelected == true ? (
                                    <TouchableOpacity onPress={this.selectImage}>
                                        <Image
                                            source={{ uri: this.state.uri }}
                                            style={{
                                                width: wp('25%'),
                                                height: hp('15%'),
                                                borderRadius: wp('30%'),
                                                resizeMode: 'cover'
                                            }} />
                                    </TouchableOpacity>
                                ) : (
                                        <TouchableOpacity onPress={this.selectImage}>
                                            <Image
                                                source={{ uri: this.state.user.profilePicture }}
                                                style={{
                                                    width: wp('25%'),
                                                    height: hp('15%'),
                                                    borderRadius: wp('30%'),
                                                    resizeMode: 'cover'
                                                }} />
                                        </TouchableOpacity>
                                    )}
                            </View>
                        </View>
                        <View style={styles.TextInputDiv}>
                            <TextField
                                label='Full Name'
                                ref={this.fieldRef}
                                containerStyle={{ width: wp('80%'), height: hp('11%') }}
                                textColor='#FF7200'
                                baseColor="black"
                                tintColor="#FF7200"
                                onChangeText={text => this.handleChange('fullName', text)}
                                defaultValue={this.state.user.fullName}
                            />
                            <TextField
                                maxLength={50}
                                label='Description'
                                ref="description"
                                containerStyle={{ width: wp('80%'), height: hp('11%') }}
                                textColor='#FF7200'
                                baseColor="black"
                                autoCapitalize="false"
                                tintColor="#FF7200"
                                onChangeText={text => this.handleChange('description', text)}
                                defaultValue={this.state.user.description}
                            />
                        </View>
                        <View style={main.buttonContainer}>
                            <TouchableOpacity onPress={() => this.updateProfileDetails()}>
                                <Text style={main.buttonText}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>}
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
        marginTop: wp('10%'),
        marginBottom: wp('30%')
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
    selectImage: {
        color: '#fff',
        fontSize: hp('2%'),
        marginTop: 10,
        borderColor: '#A9A9A9',
        backgroundColor: '#FF7200',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#FF7200',
        fontWeight: 'bold',
    },
});