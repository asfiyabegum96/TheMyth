import React from 'react';
import { StyleSheet,
         Text,
         Image,
         View,
         Button,
         TextInput,
         TouchableOpacity,
         ScrollView, } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Entypo';
import UserAvatar from 'react-native-user-avatar';
import {widthPercentageToDP as wp, 
        heightPercentageToDP as hp,
        listenOrientationChange as loc,
        removeOrientationListener as rol} 
from 'react-native-responsive-screen';

const Jaguar = '#22222C';
 
export default class connect extends React.Component {
  componentDidMount() {
    loc(this);
  }
  
  componentWillUnMount() {
    rol();
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
          borderBottomColor: '#22222C',
          borderBottomWidth: 1.5,
        }}/>
          <Text style={{
            fontSize: hp('3.5'),
            color: '#FF7200',
            paddingVertical: 7,
            left: 25
          }}>Connect</Text>
        <View
          style={{
          borderBottomColor: '#22222C',
          borderBottomWidth: wp('0.2'),
        }}/>
	    <View style={{ flexDirection: 'row', 
      paddingVertical:10, 
      paddingHorizontal:10 }}
      >
          <TouchableOpacity style={{ paddingHorizontal:10 }}>
            <UserAvatar size="70" name="Avishay Bar" 
            src="https://images.jansatta.com/2017/08/1-73-616x550.jpg" />
          </TouchableOpacity>
          <View>
            <View style={{ paddingBottom: 10}}>
              <Text style={{ color:'#22222C',
                          fontSize: hp('2.5%'), }}>Hrithik roshan</Text>
            </View>
            <View style={{ flexDirection: 'row'}}>
              <TouchableOpacity style={styles.accept}>
                <Text style={{ color:'#fff',
                fontSize: 12, }}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ignore}>
                <Text>Ignore</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* <View style={{ flexDirection: 'row', paddingVertical:10, paddingHorizontal:10 }}>
          <TouchableOpacity style={{ paddingHorizontal:10 }}>
            <UserAvatar size="70" name="Avishay Bar" 
            src="https://pbs.twimg.com/profile_images/780079944118444032/cEl3YHYW_400x400.jpg" />
          </TouchableOpacity>
          <View>
            <View style={{ paddingBottom: 10}}>
              <Text style={{ color:'#22222C',
                          fontSize: hp('2.5%'), }}>Shahrukh Khan</Text>
            </View>
            <View style={{ flexDirection: 'row'}}>
              <TouchableOpacity style={styles.accept}>
                <Text style={{ color:'#fff',
                fontSize: 12, }}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ignore}>
                <Text>Ignore</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View> */}
      </View>  
    );
  }
}

connect.navigationOptions = {
  tabBarIcon: ({tintColor, focused}) => (
    <FontAwesome5 name={'user-friends'} 
    style={styles.connectUsers}
    color={tintColor}/>
    )
}

const styles = StyleSheet. create ({
  connectUsers: {
    fontSize: hp('3%'),
  },
  accept: {
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FF7200',
    width: wp('25%'),
    alignItems: 'center',
    marginRight: 10,
  },
  ignore: {
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#F5F5F5',
    width: wp('25%'),
    alignItems: 'center'
  }
});

