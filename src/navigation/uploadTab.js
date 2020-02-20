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



class food extends React.Component {
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
                    console.error(error);
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
            docRef: imageId
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
            <ScrollView keyboardShouldPersistTaps={ true } style={{ flex: 1, padding: wp('3%') }}>
                <Text style={{
                    fontSize: wp('5%'),
                    textAlign: 'center',
                    fontWeight: 'bold'
                }}>Food Upload </Text>
                <View
                    style={{
                        borderBottomColor: '#22222C',
                        borderBottomWidth: 1,
                        marginTop: wp('2%')
                    }} />
                <View style={{ alignItems: 'center' }}>
                    <View style={{ paddingTop: wp('3%'), }}>
                        {
                            this.state.uri &&
                            <Image
                                source={{ uri: this.state.uri }}
                                style={{
                                    width: wp('40%'),
                                    height: hp('20%'),
                                    resizeMode: 'cover'
                                }} />
                        }
                    </View>
                    <View style={{ paddingTop: wp('3%') }}>
                        <TouchableOpacity style={styles.uploadImageButton}
                            onPress={this.selectImage}>
                            <View>
                                <FontAwesome5 name='images' style={styles.images} />
                            </View>
                            <View>
                                <Text>PICK IMAGE</Text>
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
                        textColor='#006B38FF'
                        baseColor="#121212"
                        tintColor="#006B38FF"
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
                        textColor='#006B38FF'
                        baseColor="#121212"
                        tintColor="#006B38FF"
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
                            <Text style={{ color: '#006B38FF' }}>{this.state.progress}%</Text>
                            <View>
                                {this.state.progress != 100 ? (
                                    <ActivityIndicator size='small' color='#006B38FF' />
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
                <View style={{ paddingTop: wp('3%'), paddingBottom: wp('5%') }}>
                    <TouchableOpacity style={styles.uploadButton} onPress={() => this.uploadImage()}>
                        <View>
                            <MaterialCommunityIcons name='upload' size={20} />
                        </View>
                        <View>
                            <Text>UPLOAD</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView >
        );
    }
}

class travel extends React.Component {

    state = {
        imageSource: null
    }

    selectImage = async () => {
        ImagePicker.launchImageLibrary({ noData: true, mediaType: 'mixed' }, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    imageSource: response.uri,
                });
            }
        });
    }

    render() {
        return (
            <ScrollView style={{ flex: 1, padding: wp('3%') }}>
                <Text style={{
                    fontSize: wp('5%'),
                    textAlign: 'center',
                    fontWeight: 'bold'
                }}>Travel Upload</Text>
                <View
                    style={{
                        borderBottomColor: '#22222C',
                        borderBottomWidth: 1,
                        marginTop: wp('2%')
                    }} />
                <View style={{ alignItems: 'center' }}>
                    <View style={{ paddingTop: wp('3%') }}>
                        {
                            this.state.imageSource &&
                            <Image
                                source={{ uri: this.state.imageSource }}
                                style={{
                                    width: wp('40%'),
                                    height: hp('30%'),
                                    resizeMode: 'cover'
                                }} />
                        }
                    </View>
                    <View style={{ paddingTop: wp('3%') }}>
                        <TouchableOpacity style={styles.uploadImageButton}
                            onPress={this.selectImage}>
                            <View>
                                <FontAwesome5 name='images' style={styles.images} />
                            </View>
                            <View>
                                <Text>PICK IMAGE</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ paddingVertical: wp('1%'), alignItems: 'center' }}>
                    <TextField
                        label='Title'
                        containerStyle={{
                            width: wp('90%'),
                            height: wp('17%')
                        }}
                        textColor='#FCD705'
                        baseColor="#121212"
                        tintColor="#FCD705"
                    />
                    <TextField
                        label='Description'
                        containerStyle={{
                            width: wp('90%'),
                            height: wp('17%')
                        }}
                        textColor='#FCD705'
                        baseColor="#121212"
                        tintColor="#FCD705"
                    />
                </View>
                <View>
                    <TouchableOpacity style={styles.uploadButton}>
                        <View>
                            <FontAwesome5 name='map-marker' style={styles.location} />
                        </View>
                        <View>
                            <Text>LOCATION</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ paddingTop: wp('3%'), paddingBottom: wp('5%') }}>
                    <TouchableOpacity style={styles.uploadButton}>
                        <View>
                            <MaterialCommunityIcons name='upload' size={20} />
                        </View>
                        <View>
                            <Text>UPLOAD</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    uploadImageButton: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'center',
        borderWidth: wp('0.5%'),
        borderColor: '#121212',
        padding: wp('1%'),
        borderRadius: wp('1%')
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'center',
        borderWidth: wp('0.5%'),
        borderColor: '#121212',
        padding: wp('1%'),
        borderRadius: wp('1%')
    },
    images: {
        color: '#121212',
        fontSize: hp('2%'),
        paddingVertical: wp('0.5%'),
        paddingHorizontal: wp('0.8%'),
    },
    location: {
        color: '#121212',
        fontSize: hp('2%'),
        paddingVertical: wp('0.5%'),
        paddingHorizontal: wp('0.8%'),
    }
});

const uploadNavigator = createMaterialTopTabNavigator(
    {
        Home: food,
        Second: travel,
    },
    {
        navigationOptions: {
            swipeEnabled: true
        },
        tabBarOptions: {
            activeTintColor: '#FCD705',
            inactiveTintColor: 'white',
            showIcon: true,
            showLabel: false,
            style: {
                backgroundColor: '#121212',
                borderBottomColor: wp('0.5%'),
            }
        },
    },
)
food.navigationOptions = {
    tabBarIcon: ({ tintColor, focused }) => (
        <MaterialCommunityIcons name="food" size={25} color={tintColor} />
    )
}
travel.navigationOptions = {
    tabBarIcon: ({ tintColor, focused }) => (
        <MaterialCommunityIcons name="wallet-travel" size={25} color={tintColor} />
    )
}

export default createAppContainer(uploadNavigator);