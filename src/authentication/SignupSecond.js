import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';

import ImagePicker from 'react-native-image-picker';
import main from "./styles/main";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import RadialGradient from 'react-native-radial-gradient';
import { Picker } from '@react-native-community/picker';

export default class SignupSecond extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      uri: '',
      imagePath: '',
      imageSelected: false,
      radioState: 'others',
    }
  }

  genderSelected = key => {
    this.setState({ radioState: key });
    if (key === 'male') {
      this.setState({ maleSelected: true, femaleSelected: false })
    } else if (key === 'female') {
      this.setState({ maleSelected: false, femaleSelected: true })
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
        maleSelected: false,
        femaleSelected: false
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
      <RadialGradient style={{ width: '100%', height: '100%' }}
        colors={['#FE7948', '#E23E00']}
        stops={[0.1, 0.95]}
        center={[180, 270]}
        radius={400}>
        {
          <ScrollView keyboardShouldPersistTaps={true} style={styles.container}>
            {/* <View style={styles.logo}>
              <Image
                source={require('../images/mythlogo.png')}
                style={main.logo} />
            </View> */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: "center",
              marginTop: wp('15%')
            }}>

              <View>
                {this.state.imageSelected == true ? (
                  <TouchableOpacity onPress={this.selectImage}>
                    <Image
                      source={{ uri: this.state.uri }}
                      style={{
                        width: wp('35%'),
                        height: hp('25%'),
                        resizeMode: 'cover',
                        borderRadius: wp('2%'), borderWidth: 1.5, borderColor: 'white'
                      }} />
                  </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={this.selectImage}>
                      <Image
                        source={{ uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" }}
                        style={{
                          width: wp('35%'),
                          height: hp('25%'),
                          resizeMode: 'cover',
                          borderRadius: wp('2%'), borderWidth: 1.5, borderColor: 'white'
                        }} />
                    </TouchableOpacity>
                  )}
              </View>
            </View>
            <View style={styles.edit}>
              <TouchableOpacity style={{ marginBottom: wp('5%'), marginTop: wp('-15%'), marginLeft: wp('-10%') }} onPress={this.selectImage}>
                <Image
                  source={require('../images/add.png')}
                  style={{
                    width: wp('15%'),
                    height: wp('15%'),

                    resizeMode: 'cover',
                  }} />
              </TouchableOpacity>
            </View>

            <View style={styles.TextInputDiv}>
              <Text style={main.labelContainer}>Description</Text>
              <TextInput
                ref="Description"
                maxLength={50}
                style={main.inputContainer}
                textColor='white'
                baseColor="white"
                tintColor="white"
                onChangeText={text => handleChange('description', text)}
                defaultValue={values.description}
              />
            </View>
            <Text style={{ marginLeft: wp('32%'), marginTop: wp('5%'), color: 'white', fontSize: hp('2%'), marginBottom: wp('5%'), }}>Select your gender</Text>
            <View style={{ flex: 1, flexDirection: 'row', }}>

              {this.state.maleSelected === true ?
                <View style={{ width: 100, height: 100, left: wp('5%'), flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => this.genderSelected('male')} style={{ borderRadius: 10, width: 100, height: 100, marginLeft: wp('5%'), backgroundColor: '#6e92f3', }}>
                    <FontAwesome5 style={styles.femaleSelect} name="mars" size={22} />
                  </TouchableOpacity>
                </View> :
                <View style={{ width: 100, height: 100, left: wp('5%'), flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => this.genderSelected('male')} style={{ borderRadius: 10, width: 100, height: 100, marginLeft: wp('5%'), backgroundColor: 'white', }}>
                    <FontAwesome5 style={styles.fabIcon} name="mars" size={22} />
                  </TouchableOpacity>
                </View>
              }
              <Text style={{ color: 'white', fontSize: hp('2%'), left: wp('25%'), marginTop: wp('30%'), marginLeft: wp('-32%') }}>Male</Text>
              {this.state.femaleSelected === true ?
                <View style={{ width: 100, height: 100, left: wp('57%'), flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => this.genderSelected('female')} style={{ borderRadius: 10, width: 100, height: 100, marginLeft: wp('5%'), backgroundColor: '#FF1493', }}>
                    <FontAwesome5 style={styles.femaleSelect} name="venus" size={22} />
                  </TouchableOpacity>
                </View> :
                <View style={{ width: 100, height: 100, left: wp('57%'), flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => this.genderSelected('female')} style={{ borderRadius: 10, width: 100, height: 100, marginLeft: wp('5%'), backgroundColor: 'white', }}>
                    <FontAwesome5 style={styles.fabIcon1} name="venus" size={22} />
                  </TouchableOpacity>
                </View>
              }
              <Text style={{ color: 'white', fontSize: hp('2%'), left: wp('63%'), marginTop: wp('30%'), marginLeft: wp('-20%') }}>Female</Text>
            </View>

            <View style={styles.but}>
              <View style={main.primaryButtonContanier}>
                {/* <TouchableOpacity onPress={this.back}>
                  <Text style={main.leftBorderButton}>BACK</Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={this.signUp}>
                  <Text style={main.primaryButtonText}>Sign Up</Text>
                </TouchableOpacity>

              </View>
              <Text style={{ marginLeft: wp('20%'), marginTop: wp('5%'), color: 'white', fontSize: hp('2%'), marginBottom: wp('5%'), }}>Already a member? Then<Text style={{ fontWeight: "bold" }}> Sign In</Text></Text>
            </View>
          </ScrollView>
        }
      </RadialGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#ed5720',
    flex: 1,
  },
  title: {
    color: '#ed5720',
    fontSize: hp('4%'),
    fontWeight: 'bold',
  },
  box1: {
    width: 100,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 10,
    marginLeft: 32,
  },
  fabIcon: {
    color: '#6e92f3',
    fontSize: hp('2.5%'),
    marginTop: wp('7%'),
    fontSize: 45,
    marginLeft: wp('9%'),

  },
  fabIcon1: {
    color: '#de6fb1',
    fontSize: hp('2.5%'),
    marginTop: wp('7%'),
    fontSize: 45,
    marginLeft: wp('9%'),

  },
  femaleSelect: {
    color: '#fff',
    fontSize: hp('2.5%'),
    marginTop: wp('7%'),
    fontSize: 45,
    marginLeft: wp('9%'),

  },
  selectImage: {
    color: '#fff',
    fontSize: hp('2%'),
    marginTop: 10,
    borderColor: '#A9A9A9',
    backgroundColor: '#ed5720',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ed5720',
    fontWeight: 'bold',
  },
  TextInputDiv: {
    marginLeft: wp('10%'),
    marginTop: wp('5%'),
  },
  inputfield: {
    width: wp('88%'),
    paddingRight: 25,
    paddingLeft: 25,
    fontSize: hp('3%'),
    fontWeight: 'bold',
    color: '#22222C',
    marginBottom: 10,
    borderColor: '#ed5720',
    backgroundColor: '#A19FA3',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 6,
    left: 110
  },
  edit: {
    left: 190,
    marginTop: wp('7%')

  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderColor: 'white',
    backgroundColor: 'white',
  },
  checkboxDiv: {
    marginLeft: 35,
  },
  but: {
    borderRadius: 6,
    marginTop: wp('7%')
  },
  logo: {
    left: 55,
  },
});