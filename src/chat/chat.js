import React from 'react';
import {Text,
        View,
        AppRegistry,
        AsyncStorage,
        StyleSheet,
        Image,
        TextInput,
        ScrollView,
        Button,
        TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { TextField } from 'react-native-material-textfield';
import {widthPercentageToDP as wp, 
        heightPercentageToDP as hp,
        listenOrientationChange as loc,
        removeOrientationListener as rol} 
from 'react-native-responsive-screen';



export default class chat extends React.Component{

  
	render() {
		return (
			<Text>Chat Screen</Text>
		);
	}
}

const styles = StyleSheet.create ({

});