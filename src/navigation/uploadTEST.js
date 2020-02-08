import React from 'react';
import {Text,
    View,
    AppRegistry,
    AsyncStorage,
    StyleSheet,
    Image,
    ScrollView,
    Button,
    TouchableOpacity} from 'react-native';
import {widthPercentageToDP as wp, 
        heightPercentageToDP as hp,
        listenOrientationChange as loc,
        removeOrientationListener as rol} 
from 'react-native-responsive-screen';
import { TextField } from 'react-native-material-textfield';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import ImagePicker from 'react-native-image-picker';
import firebase from 'react-native-firebase';


const options = {
        title: 'Select Avatar',
        customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
        noData:true,
        mediaType:'mixed',
        storageOptions: {
            path: 'images',
        },
    };


class food extends React.Component {  
    
   
    componentWillUnMount() {
    rol();
    }
    
    constructor(props) {
        super(props)
        this.state = {
        imageUri: null,
        imageId: this.uniqueId() 
    }
        // this.ref = firebase.storage().ref('images/imageUri');
    }

    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    uniqueId = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + 
        this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
    }
    
selectImage = async () =>{
    ImagePicker.launchImageLibrary( options, (response) => {
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
        this.uploadImage(response.uri);
        // this.setState({
        //     uri: response.uri,
        // });
        console.log(this.uploadImage(response.uri));
        }
    });
}
componentDidMount() {
    loc(this);
    var that = this;
}
uploadImage = async (uri) => {

    var that = this;
    var imageId = this.state.imageId;

    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(uri)[1];

    this.setState({currentFileType: ext});

    const response = await fetch(uri);
    const blob = await response.blob();
    var FilePath = imageId+'.'+that.state.currentFileType;

    
    const ref = firebase.storage().ref('/image/').child(FilePath);
    alert(ref);
    var snapshot = ref.put(blob).on('state_changed', snapshot => {
        console.log('Progress', snapshot.bytesTransferred, snapshot.totalBytes);
    });

        // return firebase.storage()
        // .ref(`photos/newPhotoId`)
        // .putFile(data)
        // .then(file => file.ref)
        // .catch(error => error);
};

    render() {
        return (
        <ScrollView style={{ flex: 1,padding:wp('3%') }}>
            <Text style={{
                fontSize:wp('5%'),
                textAlign: 'center',
                fontWeight: 'bold'
            }}>Food Upload</Text>
            <View
            style={{
            borderBottomColor: '#22222C',
            borderBottomWidth: 1,
            marginTop:wp('2%')
            }}/>
            <View style={{ alignItems:'center'}}>
                <View  style={{paddingTop:wp('3%'),}}>
                    {
                    this.state.uri &&
                    <Image 
                    source={{uri:this.state.uri}}
                    style={{width:wp('97%'),
                    height:hp('60%'),
                    resizeMode:'cover'}} />
                    }
                </View>
                <View style={{paddingTop:wp('3%')}}>
                    <TouchableOpacity style={styles.uploadImageButton}
                onPress={this.selectImage}>
                    <View>
                        <FontAwesome5 name='images' style={styles.images}/>
                    </View>
                    <View>
                        <Text>PICK IMAGE</Text>
                    </View>
                </TouchableOpacity>
                </View>
            </View>
            <View style={{ paddingVertical: wp('1%'),alignItems:'center'}}>
            <TextField 
            label='Title'
            containerStyle={{ width: wp('90%'),
            height:wp('17%')}}
            textColor='#FCD705'
            baseColor="#121212"
            tintColor="#FCD705"
            />
            <TextField 
            label='Description'
            containerStyle={{ width: wp('90%'),
            height:wp('17%')}}
            textColor='#FCD705'
            baseColor="#121212"
            tintColor="#FCD705"
            />
            </View>
            <View>
                <TouchableOpacity style={styles.uploadButton}>
                    <View>
                    <FontAwesome5 name='map-marker' style={styles.location}/>
                    </View>
                    <View>
                        <Text>LOCATION</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{paddingTop:wp('3%'),paddingBottom:wp('5%')}}>
                <TouchableOpacity style={styles.uploadButton} onPress={() => this.uploadImage()}>
                    <View>
                        <MaterialCommunityIcons name='upload' size={20}/>
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

class travel extends React.Component {

    state = {
        imageSource: null
    }
    
    selectImage = async () =>{
        ImagePicker.launchImageLibrary({noData:true,mediaType:'mixed'}, (response) => {
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
            <ScrollView style={{ flex: 1,padding:wp('3%') }}>
            <Text style={{
                fontSize:wp('5%'),
                textAlign: 'center',
                fontWeight: 'bold'
            }}>Travel Upload</Text>
            <View
            style={{
            borderBottomColor: '#22222C',
            borderBottomWidth: 1,
            marginTop:wp('2%')
            }}/>
            <View style={{ alignItems:'center'}}>
                <View  style={{paddingTop:wp('3%')}}>
                    {
                    this.state.imageSource &&
                    <Image 
                    source={{uri:this.state.imageSource}}
                    style={{width:wp('40%'),
                    height:hp('30%'),
                    resizeMode:'cover'}} />
                    }
                </View>
                <View style={{paddingTop:wp('3%')}}>
                    <TouchableOpacity style={styles.uploadImageButton}
                onPress={this.selectImage}>
                    <View>
                        <FontAwesome5 name='images' style={styles.images}/>
                    </View>
                    <View>
                        <Text>PICK IMAGE</Text>
                    </View>
                </TouchableOpacity>
                </View>
            </View>
            <View style={{ paddingVertical: wp('1%'),alignItems:'center'}}>
            <TextField 
            label='Title'
            containerStyle={{ width: wp('90%'),
            height:wp('17%')}}
            textColor='#FCD705'
            baseColor="#121212"
            tintColor="#FCD705"
            />
            <TextField 
            label='Description'
            containerStyle={{ width: wp('90%'),
            height:wp('17%')}}
            textColor='#FCD705'
            baseColor="#121212"
            tintColor="#FCD705"
            />
            </View>
            <View>
                <TouchableOpacity style={styles.uploadButton}>
                    <View>
                    <FontAwesome5 name='map-marker' style={styles.location}/>
                    </View>
                    <View>
                        <Text>LOCATION</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{paddingTop:wp('3%'),paddingBottom:wp('5%')}}>
                <TouchableOpacity style={styles.uploadButton}>
                    <View>
                        <MaterialCommunityIcons name='upload' size={20}/>
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
    uploadImageButton:{
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent:'center',
        borderWidth: wp('0.5%'),
        borderColor: '#121212',
        padding:wp('1%'),
        borderRadius: wp('1%')
    },
    uploadButton:{
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent:'center',
        borderWidth: wp('0.5%'),
        borderColor: '#121212',
        padding:wp('1%'),
        borderRadius: wp('1%')
    },
    images: {
    color: '#121212',
    fontSize: hp('2%'),
    paddingVertical: wp('0.5%'),
    paddingHorizontal:wp('0.8%'),
    },
    location:{
    color: '#121212',
    fontSize: hp('2%'),
    paddingVertical: wp('0.5%'),
    paddingHorizontal:wp('0.8%'),
    }
});

const uploadNavigator = createMaterialTopTabNavigator(
{
    Home: food,
    Second: travel,
},
{
    navigationOptions:{
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
    tabBarIcon: ({tintColor, focused}) => (
        <MaterialCommunityIcons name="food" size={25} color={tintColor}  />
    )
}
travel.navigationOptions = {
    tabBarIcon: ({tintColor, focused}) => (
        <MaterialCommunityIcons name="wallet-travel" size={25} color={tintColor}/>
    )
}

export default createAppContainer(uploadNavigator);

//     componentDidMount() {
//         loc(this);
//     }
//     componentWillUnMount() {
//     rol();
//     }
    
//     constructor(props) {
//         super(props)
//         this.state = {
//         imageUri: null,
//         imageId: this.uniqueId() 
//     }
//         // this.ref = firebase.storage().ref('images/imageUri');
//     }

//     s4 = () => {
//         return Math.floor((1 + Math.random()) * 0x10000)
//         .toString(16)
//         .substring(1);
//     }

//     uniqueId = () => {
//         return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + 
//         this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
//     }
    
// selectImage = async () =>{
//     ImagePicker.launchImageLibrary( options, (response) => {
//         console.log('Response = ', response);
//         if (response.didCancel) {
//         console.log('User cancelled image picker');
//         } else if (response.error) {
//         console.log('ImagePicker Error: ', response.error);
//         } else if (response.customButton) {
//         console.log('User tapped custom button: ', response.customButton);
//         } else {
//           // You can also display the image using data:
//           // const source = { uri: 'data:image/jpeg;base64,' + response.data };
//         this.uploadImage(response.uri);
//         // this.setState({
//         //     uri: response.uri,
//         // });
//         console.log(this.uploadImage(response.uri));
//         }
//     });
// }
// uploadImage = async (uri) => {

//     var imageId = this.state.imageId;

//     var re = /(?:\.([^.]+))?$/;
//     var ext = re.exec(uri)[1];

//     this.setState({currentFileType: ext});

//     const response = await fetch(uri);
//     const blob = await response.blob();
//     var FilePath = imageId+'.'+this.state.currentFileType;

//     const ref = firebase.storage().ref('image/').child(FilePath);

//     ref.put(FilePath).then(function(snapshot) {
//         console.log('Uploaded a blob or file!');
//     });
    
//     // var snapshot = ref.put(blob).on('state_changed', snapshot => {
//     //     console.log('Progress', snapshot.bytesTransferred, snapshot.totalBytes);
//     // });
//         // return firebase.storage()
//         // .ref(`photos/newPhotoId`)
//         // .putFile(data)
//         // .then(file => file.ref)
//         // .catch(error => error);
// };