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
              marginTop: wp('20%')
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
            <View style={{ marginBottom: wp('15%'), }}>
              <Text style={{ color: 'white', left: 35, marginBottom: 8, fontSize: wp('4.5%'), marginTop: wp('1%') }}>Gender :</Text>
              <View style={{ marginLeft: wp('10%'), backgroundColor: 'white',opacity: 0.7, borderRadius: wp('2%'), borderWidth: 1.5, borderColor: 'white', width: wp('80%') }}>
                <Picker
                  selectedValue={this.state.radioState}
                  mode={'dropdown'}
                  style={{ height: wp('10%'), width: wp('80%') }}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ radioState: itemValue })
                  }>
                  <Picker.Item color="#ed5720" label="Others" value="others" />
                  <Picker.Item label="Male" color="#ed5720" value="male" />
                  <Picker.Item label="Female" value="female" color="#ed5720" />
                </Picker>
              </View>

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
    marginTop: wp('15%'),
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
    marginTop: wp('1%')
  },
  logo: {
    left: 55,
  },
});