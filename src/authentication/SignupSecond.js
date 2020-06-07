import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { TextField } from 'react-native-material-textfield';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-picker';
import main from "./styles/main";

export default class SignupSecond extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      uri: '',
      imagePath: '',
      imageSelected: false,
      radioState: ''
    }
  }

  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  }
  back = e => {
    e.preventDefault();
    this.props.prevStep();
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
          imagePath: response.path.toString(),
          uri: response.uri,
          imageSelected: true,
        });

        this.props.handleChange('profilePicture', response.uri)
      }
    });
  }

  signUp = () => {
    this.props.insertUser();
  }


  componentWillUnMount() {
    rol();
  }
  render() {
    const { values, handleChange } = this.props;
    const radioState = this.state.radioState;
    const options = [
      {
        key: 'male',
        text: 'Male',
      },
      {
        key: 'female',
        text: 'Female',
      },
    ];
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
                    source={{ uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" }}
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
            maxLength={50}
            label='Description'
            ref="Description"
            containerStyle={{ width: wp('80%'), height: hp('11%') }}
            textColor='#FF7200'
            baseColor="black"
            tintColor="#FF7200"
            onChangeText={text => handleChange('description', text)}
            defaultValue={values.description}
          />
        </View>
        <View style={{ marginBottom: wp('35%') }}>
          <Text style={{ color: 'black', left: 60, marginBottom: 8, fontSize: wp('4.5%'), marginTop: wp('1%') }}>Gender :</Text>
          <View>
            {options.map(item => {
              return (
                <View key={item.key} style={styles.buttonContainer}>
                  <View>
                    <TouchableOpacity
                      style={styles.circle}
                      onPress={() => {
                        this.setState({
                          radioState: item.key,
                        });
                        handleChange('gender', item.key)
                      }}
                    >
                      {radioState === item.key && <View style={styles.checkedCircle} />}
                    </TouchableOpacity>
                  </View>
                  <View>
                    <Text style={{ color: 'black', marginLeft: 10 }}>{item.text}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        <View style={styles.but}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity onPress={this.back}>
              <Text style={main.leftBorderButton}>BACK</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.signUp}>
              <Text style={main.rightBorderButton}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
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
  title: {
    color: '#FF7200',
    fontSize: hp('4%'),
    fontWeight: 'bold',
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
  TextInputDiv: {
    alignItems: 'center',

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
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 6,
    left: 110
  },

  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ACACAC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FF7200',
  },
  checkboxDiv: {
    marginLeft: 35,
  },
  but: {
    borderRadius: 6,
    marginTop: wp('1%')
  },
  logo: {
    left: 55,
  },
});