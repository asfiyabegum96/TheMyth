import React from 'react';
import { StyleSheet,
        Text,
        Image,
        View,
        Button,
        TextInput,
        TouchableOpacity,
        ScrollView,
        Dimensions,
        Animated,
        TouchableWithoutFeedback } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import UserAvatar from 'react-native-user-avatar';
import {widthPercentageToDP as wp, 
        heightPercentageToDP as hp,
        listenOrientationChange as loc,
        removeOrientationListener as rol} 
from 'react-native-responsive-screen';
import Heart from "./heart";

const Jaguar = '#22222C';

export default class mainFeed extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      photoFeedData: [0, 1, 2, 3],
      feedRefresh: false,
      liked: false,
      scale: new Animated.Value(0),
      animations: [
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
      ],
    }
    this.triggerLike = this.triggerLike.bind(this);
  }
  // Photo feed function
  photoFeedLoad = () =>{
    this.setState({
      feedRefresh: true
    });
    this.setState({
      photoFeedData: [4, 5, 6, 7],
      feedRefresh: false
    });
  }

  // Heart like trigger function
  triggerLike() {
    this.setState({
      liked: !this.state.liked
    })
    Animated.spring(this.state.scale, {
      toValue: 2,
      friction: 3
    }).start(() => {
      this.state.scale.setValue(0);
    });
  }

  componentDidMount() {
    loc(this);
  }
  
  componentWillUnMount() {
    rol();
  }
  render() {
    //Heart like spring animation 
      const bouncyHeart = this.state.scale.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [1, .8, 1]
      })
      const heartButtonStyle = {
        transform: [
          { scale: bouncyHeart }
        ]
      }

    return (
      <View style={{ flex: 1,}}>
        <View
          style={{
          borderBottomColor: '#22222C',
          borderBottomWidth: 1.5,
          }}/>
        <ScrollView style={{ paddingHorizontal: wp('1%'),marginTop: hp('1%') }}>
          <View style={styles.elevation}>
            <View style={styles.listHeader}>
              <TouchableOpacity style={{ paddingHorizontal: 10, }} 
              onPress={() => this.props.navigation.navigate('profile')}>
                <UserAvatar size="50" name="Avishay Bar" 
                src="https://pbs.twimg.com/profile_images/780079944118444032/cEl3YHYW_400x400.jpg" />
              </TouchableOpacity>
              <TouchableOpacity 
              onPress={() => this.props.navigation.navigate('profile')} >
                <Text style={styles.listProfileName}>Shahrukh Khan</Text>
                <Text style={styles.listProfileSubName}>Actor</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.listViewImg}>
              <Image style={styles.listViewInlineImg}
              source={{uri: 'https://www.swantour.com/blogs/wp-content/uploads/2019/01/Best-Places-To-Visit-in-North-East-India.jpg'}}
              />
            </View>
            <View style={styles.foodNameDiv}>
              <Text style={styles.foodNameText}>Want Peace? Go to this Buddha temple.</Text>
            </View>
            <View style={styles.locationDiv}>
              <Text style={styles.locationText}>Thailand</Text>
            </View>
            <View style={{flexDirection: 'row',  
            paddingHorizontal: wp('2%'),
            paddingVertical: wp('2%')}}>
                <TouchableWithoutFeedback onPress={this.triggerLike}>
                  <Animated.View style={heartButtonStyle}>
                    <Heart filled={this.state.liked}/>
                  </Animated.View>
                </TouchableWithoutFeedback>
                <TouchableOpacity style={{paddingLeft:wp('1%')}}>
                  <Fontisto style={styles.comment} name="comment" size={22} color="#22222C" />
                </TouchableOpacity>
                <TouchableOpacity style={{paddingLeft:wp('1%')}}>
                  <Fontisto name="bookmark-alt" size={20} color="#22222C" />
                </TouchableOpacity>
              <View>
              </View>
            </View>
            <Text style={styles.likeText}>100 likes</Text>
          </View>
          <View style={styles.elevation}>
            <View style={styles.listHeader}>
              <TouchableOpacity style={{ paddingHorizontal: 10, }} 
              onPress={() => this.props.navigation.navigate('profile')}>
                <UserAvatar size="50" name="Avishay Bar" 
                src="https://pbs.twimg.com/profile_images/780079944118444032/cEl3YHYW_400x400.jpg" />
              </TouchableOpacity>
              <TouchableOpacity 
              onPress={() => this.props.navigation.navigate('profile')} >
                <Text style={styles.listProfileName}>Shahrukh Khan</Text>
                <Text style={styles.listProfileSubName}>Actor</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.listViewImg}>
              <Image style={styles.listViewInlineImg}
              source={{uri: 'https://www.billyparisi.com/wp-content/uploads/2015/06/whole-bbq-chicken-5.jpg'}}
              />
            </View>
            <View style={styles.foodNameDiv}>
              <Text style={styles.foodNameText}>Grill chicken lover!!! this is delicious.</Text>
            </View>
            <View style={styles.locationDiv}>
              <Text style={styles.locationText}>Thailand</Text>
            </View>
            <View style={{flexDirection: 'row',  
            paddingHorizontal: wp('2%'),
            paddingVertical: wp('2%')}}>
                <TouchableWithoutFeedback onPress={this.triggerLike}>
                  <Animated.View style={heartButtonStyle}>
                    <Heart filled={this.state.liked}/>
                  </Animated.View>
                </TouchableWithoutFeedback>
                <TouchableOpacity style={{paddingLeft:wp('1%')}}>
                  <Fontisto style={styles.comment} name="comment" size={22} color="#22222C" />
                </TouchableOpacity>
                <TouchableOpacity style={{paddingLeft:wp('1%')}}>
                  <Fontisto name="bookmark-alt" size={20} color="#22222C" />
                </TouchableOpacity>
              <View>
              </View>
            </View>
            <Text style={styles.likeText}>100 likes</Text>
          </View>
          <View style={styles.elevation}>
            <View style={styles.listHeader}>
              <TouchableOpacity style={{ paddingHorizontal: 10, }} 
              onPress={() => this.props.navigation.navigate('profile')}>
                <UserAvatar size="50" name="Avishay Bar" 
                src="https://pbs.twimg.com/profile_images/780079944118444032/cEl3YHYW_400x400.jpg" />
              </TouchableOpacity>
              <TouchableOpacity 
              onPress={() => this.props.navigation.navigate('profile')} >
                <Text style={styles.listProfileName}>Shahrukh Khan</Text>
                <Text style={styles.listProfileSubName}>Actor</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.listViewImg}>
              <Image style={styles.listViewInlineImg}
              source={{uri: 'https://images.unsplash.com/photo-1568882041008-c0954e91caba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'}}
              />
            </View>
            <View style={styles.foodNameDiv}>
              <Text style={styles.foodNameText}>Chicken is so tender and delicious. You can feel the aroma of the food. 
              It's fresh and mouthwatering. Best food for the price </Text>
            </View>
            <View style={styles.locationDiv}>
              <Text style={styles.locationText}>Thailand</Text>
            </View>
            <View style={{flexDirection: 'row',  
            paddingHorizontal: wp('2%'),
            paddingVertical: wp('2%')}}>
                <TouchableWithoutFeedback onPress={this.triggerLike}>
                  <Animated.View style={heartButtonStyle}>
                    <Heart filled={this.state.liked}/>
                  </Animated.View>
                </TouchableWithoutFeedback>
                <TouchableOpacity style={{paddingLeft:wp('1%')}}>
                  <Fontisto style={styles.comment} name="comment" size={22} color="#22222C" />
                </TouchableOpacity>
                <TouchableOpacity style={{paddingLeft:wp('1%')}}>
                  <Fontisto name="bookmark-alt" size={20} color="#22222C" />
                </TouchableOpacity>
              <View>
              </View>
            </View>
            <Text style={styles.likeText}>100 likes</Text>
          </View>
        </ScrollView>
      </View>  
    );
  }
}

mainFeed.navigationOptions = {
	tabBarIcon: ({tintColor, focused}) => (
		<FontAwesome5 name={'globe'} 
		style={styles.globe}
		color={tintColor}/>
		)
}

const styles = StyleSheet. create ({
  globe:{
    fontSize: hp('3%'),
  },
  // elevation:{
  //   marginBottom: hp('2%'),
  //   borderColor:'#ffffff',
  //   paddingVertical: wp('1%'),
  //   borderWidth: wp('1%'),
  //   borderBottomEndRadius : 8,
  //   borderTopStartRadius: 8,
  //   borderTopEndRadius: 8,
  //   borderBottomStartRadius: 8,
  //   borderBottomLeftRadius:8,
  //   borderBottomRightRadius:8,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.5,
  //   shadowRadius: 0.5,
  //   elevation:5,
  // },
  elevation:{
    // borderTopWidth:wp('0.1%'),
    // borderTopColor: '#121212',
    borderBottomWidth:wp('0.1%'),
    borderBottomColor: '#121212'
  },
  listHeader:{
    flexDirection: 'row',
    marginTop: hp('1%')
  },
  listProfileName: {
    fontSize: hp('3%'),
    fontWeight: 'bold',
    color: '#22222C',
  },
  listProfileSubName:{
    color: '#22222C'
  },
  listViewImg: {
    paddingVertical: wp('2%'),
  },
  listViewInlineImg: {
    width: wp('97%'),
    height:wp('60%'), 
    resizeMode:'cover',
    borderWidth: 1,
    borderRadius: wp('3%'),
    // borderColor: '#FCD705',
  },
  foodNameDiv: {
    left: 10,
    flexDirection: 'row',
    alignItems: 'baseline', 
  },
  foodNameText: {
    fontSize: hp('2.5%'),
  },
  locationDiv: {
    left: 10,
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  locationText: {
    fontSize: hp('2.5%'),
    fontWeight:'bold'
  },
  comment:{
    paddingHorizontal: wp('2%')
  },
  likeText:{
    fontSize: hp('2.5%'),
    paddingHorizontal: wp('2%'),
    paddingBottom: wp('4%'),
  },
});