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
 
export default class notification extends React.Component {
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
            color: '#FCD705',
            paddingVertical: 7,
            left: 25
          }}>Notification</Text>
        <View
          style={{
          borderBottomColor: '#22222C',
          borderBottomWidth: wp('0.2'),
        }}/>
      </View>  
    );
  }
}

notification.navigationOptions = {
  tabBarIcon: ({tintColor, focused}) => (
    <FontAwesome5 name={'bell'} 
    style={styles.bell}
    color={tintColor}/>
    )
}

const styles = StyleSheet. create ({
  bell: {
    fontSize: hp('3%'),
  },
});

