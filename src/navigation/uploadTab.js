import React from 'react';
import {
    Text,
    View,
    AppRegistry,
    AsyncStorage,
    ActivityIndicator,
    StyleSheet,
    Image,
    ScrollView,
    Button,
    TouchableOpacity
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
}
    from 'react-native-responsive-screen';
import { TextField } from 'react-native-material-textfield';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import ImagePicker from 'react-native-image-picker';
import firebase from 'react-native-firebase';



class photosUpload extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            path: '',
            imageUri: null,
            imageId: this.uniqueId(),
            uploading: false,
            progress: 0,
            caption: '',
            location: '',
            user: '',
            fieldNotEmpty: false
        }
        this.baseState = this.state;
    }

    componentDidMount() {
        this.fetchUserDetails()
    }

    componentWillUnMount() {
        this.setState(this.baseState)
    }

    // Generate random Id for images
    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    uniqueId = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
    }
    // pick image from imagepicker
    selectImage = () => {
        const options = {
            title: 'Food Upload',
            storageOptions: {
                skipBackup: true,
                path: 'images',
                allowsEditing: true,
            },
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            this.setState({ fieldNotEmpty: true })
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
                // var path = '';
                // if (Platform.OS == 'ios')
                //     path = response.uri.toString();
                // else {
                //     path = response.path.toString();
                // }

                // let image = {
                //     path: response.path.toString()
                // };
                this.setState({
                    path: response.path.toString(),
                    uri: response.uri,
                    fieldNotEmpty: false
                });
            }
        });
    }

    fetchUserDetails() {
        const context = this;
        let db = firebase.firestore();
        let photosRef = db.collection('signup');
        photosRef.where('email', '==', context.props.screenProps.navigation.state.params.email).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                let data;
                const docNotEmpty = (doc.id, " => ", doc.data() != null);
                if (docNotEmpty) data = (doc.id, " => ", doc.data());
                context.setState({ user: doc.data() })
            })
        })
    }

    // upload image to fireabase storage
    uploadImage = () => {
        if (this.state.path) {
            var imageId = this.state.imageId;
            var imagePath = this.state.path;
            var userDetails = this.state.user;
            this.setState({
                uploading: true
            });
            var uploadTask = firebase.storage().ref('images/userId/' + imageId).putFile(imagePath);
            uploadTask.on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                (snapshot) => {
                    let progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
                    console.log('Upload is ' + progress + '% complete')
                    this.setState({
                        progress: progress
                    });
                    if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                        // complete
                        this.setState({
                            progress: 100
                        });

                        firebase.storage().ref('images/userId/' + imageId).getDownloadURL()
                            .then((url) => {
                                this.processUpload(url);
                            });
                    }
                },
                (error) => {
                    unsubscribe();
                },
            );
        } else {
            this.setState({ fieldNotEmpty: true })
        }
    }

    //uploading feed data in cloud firestore
    processUpload = (imageUrl) => {
        const context = this;
        let imageId = this.state.imageId;
        //Set variable for feed
        let author = this.state.user.fullName;
        let authorDescription = this.state.user.description;
        let caption = this.state.caption;
        let comments = 'yet to be added';
        let likes = 0;
        let location = this.state.location;
        let dateTime = Date.now();
        let timestamp = Math.floor(dateTime / 1000);
        let saved = 'no';
        let userAvatar = this.state.user.profilePicture
        // Create object for firestore
        let photoObj = {
            author: author,
            authorDescription: authorDescription,
            caption: caption,
            comments: comments,
            likes: likes,
            location: location,
            postedTime: timestamp,
            saved: saved,
            url: imageUrl,
            userAvatar: userAvatar,
            docRef: imageId,
            email: this.props.screenProps.navigation.state.params.email
        }

        firebase.firestore().collection('photos').doc(imageId).set(photoObj).then(function (docRef) {
            alert('Image uploaded!');
            context.setState({
                uploading: false,
            });
            context.props.screenProps.navigation.navigate('homeFixed');
        });

    }

    render() {
        return (
            <ScrollView keyboardShouldPersistTaps={true} style={{ flex: 1, padding: wp('3%') }}>
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
                <Text style={{
                    fontSize: wp('5%'),
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#FF7200',
                    marginTop: wp('10%')
                }}>Photos Upload </Text>
                <View
                    style={{
                        borderBottomColor: '#FF7200',
                        borderBottomWidth: 1,
                        marginTop: wp('3%')
                    }} />
                <View style={{ alignItems: 'center' }}>
                    <View style={{ paddingTop: wp('5%'), }}>
                        {
                            this.state.uri &&
                            <Image
                                source={{ uri: this.state.uri }}
                                style={{
                                    width: wp('40%'),
                                    height: hp('20%'),
                                    resizeMode: 'cover',
                                }} />
                        }
                    </View>
                    <View style={styles.imagePick}>
                        <TouchableOpacity style={styles.uploadImageButton}
                            onPress={this.selectImage}>
                            <View>
                                <FontAwesome5 name='images' style={styles.images} />
                            </View>
                            <View>
                                <Text style={styles.buttonText}>PICK IMAGE</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ paddingVertical: wp('1%'), alignItems: 'center' }}>
                    <TextField
                        editable={true}
                        maxLength={150}
                        onChangeText={(text) => this.setState({ caption: text })}
                        value={this.state.caption}
                        label='Enter Your Caption...'
                        containerStyle={{
                            width: wp('90%'),
                            height: wp('17%')
                        }}
                        textColor='#FF7200'
                        baseColor="#121212"
                        tintColor="#FF7200"
                    />
                    <TextField
                        editable={true}
                        maxLength={50}
                        onChangeText={(text) => this.setState({ location: text })}
                        value={this.state.location}
                        label='Location'
                        containerStyle={{
                            width: wp('90%'),
                            height: wp('17%')
                        }}
                        textColor='#FF7200'
                        baseColor="#121212"
                        tintColor="#FF7200"
                    />
                </View>
                {/* <View>
                <TouchableOpacity style={styles.uploadButton}>
                    <View>
                    <FontAwesome5 name='map-marker' style={styles.location}/>
                    </View>
                    <View>
                        <Text>LOCATION</Text>
                    </View>
                </TouchableOpacity>
            </View> */}
                <View>
                    {this.state.uploading == true ? (
                        <View style={{ marginTop: wp('2%'), }}>
                            <Text style={{ color: '#FF7200' }}>{this.state.progress}%</Text>
                            <View>
                                {this.state.progress != 100 ? (
                                    <ActivityIndicator size='small' color='#FF7200' />
                                ) : (
                                        <View>
                                            <Text>Processing</Text>
                                        </View>
                                    )}
                            </View>

                        </View>
                    ) : (
                            <View></View>
                        )}
                </View>
                {this.state.fieldNotEmpty === true ? (
                    <Text style={{ color: 'red' }}>Please select an image to upload</Text>
                ) : (
                        <View></View>
                    )}
                <View style={styles.uploadImageStyle}>
                    <TouchableOpacity style={styles.uploadButton} onPress={() => this.uploadImage()}>
                        <View>
                            <MaterialCommunityIcons style={{ color: '#fff', }} name='upload' size={20} />
                        </View>
                        <View>
                            <Text style={styles.buttonText}>UPLOAD</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView >
        );
    }
}
const styles = StyleSheet.create({
    uploadImageButton: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'center',
        borderWidth: wp('0.5%'),
        borderColor: '#FF7200',
        padding: wp('1%'),
        borderRadius: wp('1%'),
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'center',
        borderWidth: wp('0.5%'),
        borderColor: '#FF7200',
        padding: wp('1%'),
        borderRadius: wp('1%'),

    },
    images: {
        color: '#fff',
        fontSize: hp('2%'),
        paddingVertical: wp('0.5%'),
        paddingHorizontal: wp('0.8%'),
    },
    location: {
        color: '#121212',
        fontSize: hp('2%'),
        paddingVertical: wp('0.5%'),
        paddingHorizontal: wp('0.8%'),
    },
    logo: {
        left: 55,
    },
    imagePick: {
        marginTop: wp('5%'),
        paddingTop: wp('1%'), backgroundColor: '#FF7200',
        borderRadius: wp('1%'),
        borderWidth: wp('0.5%'),
        borderColor: '#FF7200',
    },
    uploadImageStyle: {
        marginTop: wp('5%'),
        paddingTop: wp('1%'),
        paddingBottom: wp('1%'),
        backgroundColor: '#FF7200',
        borderRadius: wp('1%'),
        borderWidth: wp('0.5%'),
        borderColor: '#FF7200',
    },
    buttonText: { color: 'white', fontWeight: 'bold' }
});

export default photosUpload;