import React from 'react';
import { StyleSheet,
        Text,
        Image,
        View,
        Button,
        TextInput,
        TouchableOpacity,
        ScrollView,
        Animated,
        TouchableWithoutFeedback } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {widthPercentageToDP as wp, 
        heightPercentageToDP as hp,
        listenOrientationChange as loc,
        removeOrientationListener as rol} 
from 'react-native-responsive-screen';

const Jaguar = '#22222C';
 
export default class diary extends React.Component {
  constructor(props){
    super(props);
      this.state={
        noteArray: [],

      }
  }

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
          <View>
            <Text style={{
              fontSize: hp('3.5'),
              color: '#FCD705',
              paddingVertical: 7,
              left: 25
            }}>Diary</Text>
          </View>
        <View
          style={{
          borderBottomColor: '#22222C',
          borderBottomWidth: wp('0.2'),
        }}/>
        <View style={{width: wp('100%'),flexDirection:"row",justifyContent:'space-between'}}>
          <TextInput
            placeholder='Description'
          />
          <Button
            title="add"
          />
        </View>
        {/* <View key={this.props.keyval}>
          <Text>{this.props.val.desc}</Text>
        </View> */}
      </View>  
    );
  }
}

diary.navigationOptions = {
  tabBarIcon: ({tintColor, focused}) => (
    <FontAwesome5 name={'address-book'} 
    style={styles.diary}
    color={tintColor}/>
    )
}

const styles = StyleSheet. create ({
  diary: {
    fontSize: hp('3%'),
  },
});


