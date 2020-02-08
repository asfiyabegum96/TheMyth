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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import UserAvatar from 'react-native-user-avatar';
import {widthPercentageToDP as wp, 
        heightPercentageToDP as hp,
        listenOrientationChange as loc,
        removeOrientationListener as rol} 
from 'react-native-responsive-screen';
import MasonryList from "react-native-masonry-list";
import {Collapse, CollapseHeader, CollapseBody} from "accordion-collapse-react-native"

const Jaguar = '#22222C';
 
export default class profile extends React.Component {
  componentDidMount() {
    loc(this);
  }
  
  componentWillUnMount() {
    rol();
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate("chat")}
          style={styles.fabDiv}>
            <View style={styles.fab}>
              <FontAwesome5 style={styles.fabIcon} name='telegram-plane' size={35} />
            </View>
          </TouchableOpacity>  
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('homeFixed')} >
            <Icon name={'home'} size={30} color="#FCD705" />
          </TouchableOpacity>
          <TextInput style={styles.inputSearch}
              selectionColor='#FCD705'
              placeholder="Search" 
              placeholderTextColor='#FCD705'
              />
          <TouchableOpacity>  
          <MaterialCommunityIcons name="settings" size={35} color="#FCD705" />
          </TouchableOpacity> 
        </View>
        <View style={styles.countDiv}>
        <CollapseBody>

        </CollapseBody>
          <Collapse style={{flexDirection:'row'}}>
            <CollapseHeader>
              <View style={styles.countDesign}>
                <Text style={{fontSize:wp('5%'),
                color:'#FCD705'}}>20</Text>
              </View>
            </CollapseHeader>
            <CollapseBody style={{alignItems:'center',justifyContent:'center',}}>
              <View style={styles.countTextDesign}>
                <Text style={{fontSize:wp('5%'),
                color:'#FCD705'}}>Posts</Text>
              </View>
            </CollapseBody>
          </Collapse>
          <Collapse style={{flexDirection:'row'}}>
            <CollapseHeader>
            <View style={styles.countDesign}>
                <Text style={{fontSize:wp('5%'),
                color:'#FCD705'}}>30</Text>
              </View>
            </CollapseHeader>
            <CollapseBody style={{alignItems:'center',justifyContent:'center',}}>
              <View style={styles.countTextDesign}>
                <Text style={{fontSize:wp('5%'),
                color:'#FCD705'}}>Followers</Text>
              </View>
            </CollapseBody>
          </Collapse>
          <Collapse style={{flexDirection:'row'}}>
            <CollapseHeader>
            <View style={styles.countDesign}>
                <Text style={{fontSize:wp('5%'),
                color:'#FCD705'}}>20</Text>
              </View>
            </CollapseHeader>
            <CollapseBody style={{alignItems:'center',justifyContent:'center',}}>
            <View style={styles.countTextDesign}>
              <Text style={{fontSize:wp('5%'),
                color:'#FCD705'}}>Following</Text>
            </View>
            </CollapseBody>
          </Collapse>
        </View>
        <ScrollView> 
        <View style={{ flexDirection: 'row' }}>
          <View style={{ padding: 20,}}>
            <UserAvatar size="100" name="Avishay Bar" 
            src="https://firebasestorage.googleapis.com/v0/b/chatot-9ab9b.appspot.com/o/images%2FuserId%2F297c99cd-2b78-e3b8-7f97-b377-8ed4-0289?alt=media&token=aea7c4f4-d0d4-4d04-87dd-833195730ea7" />
          </View>
          <View style={{ padding: 20}} >
            <Text style={styles.profileName}>Surya</Text>
            <Text style={{ fontSize: hp('2.5%'),
            marginLeft: 4, }}>Traveller</Text>
            <TouchableOpacity>
              <View style={styles.follow}>
                <Text style={{ color:'#FCD705',
                                fontSize: 17, }}>Follow</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      <View style={{ padding: 10}}>
      <MasonryList
          columns={3}
            images={[
                { uri: "https://www.diabetes.org/sites/default/files/styles/crop_large/public/2019-06/Healthy%20Food%20Made%20Easy%20-min.jpg", 
                dimensions: { width: 900, height: 1050 }},
                { URL: "https://www.studentuniverse.com/blog/wp-content/uploads/2014/04/Santorini-Greece.jpg",
                dimensions: { width: 900, height: 1050 } },
                { uri: "https://www.calgarycoop.com/assets/content/thumbnails/FoodNavBlocks-meat.jpg",
                dimensions: { width: 900, height: 1050 } },
                { URL: "https://assets.grab.com/wp-content/uploads/sites/8/2018/11/20120446/order-grabfood-fast-food-delivery.jpg",
                dimensions: { width: 900, height: 1050 } },
                { uri: "https://i.pinimg.com/1200x/df/f9/fc/dff9fce0da52ccff0cdea550f2ce75cc.jpg",
                dimensions: { width: 900, height: 1050 } },
                { URL: "https://i.pinimg.com/564x/5a/f7/a8/5af7a8f12bc1ee944ba7618879beab3d.jpg",
                dimensions: { width: 900, height: 1050 } },
                { URL: "https://asset1.cxnmarksandspencer.com/is/image/mands/20190926_Christmas-Food-inspiration_LP_Update_SB-21571_03_05?wid=700&qlt=40&fmt=pjpeg",
                dimensions: { width: 900, height: 1050 } },
                { uri: "https://www.calgarycoop.com/assets/content/thumbnails/FoodNavBlocks-seafood.jpg",
                dimensions: { width: 900, height: 1050 } },
                { URL: "https://aot-wpengine.netdna-ssl.com/wp-content/uploads/2019/04/Botswana-elephants-compressed.jpg",
                dimensions: { width: 900, height: 1050 } },
                { uri: "https://www.diabetes.org/sites/default/files/styles/crop_large/public/2019-06/Healthy%20Food%20Made%20Easy%20-min.jpg", 
                dimensions: { width: 900, height: 1050 }},
                { URL: "https://www.studentuniverse.com/blog/wp-content/uploads/2014/04/Santorini-Greece.jpg",
                dimensions: { width: 900, height: 1050 } },
                { uri: "https://www.calgarycoop.com/assets/content/thumbnails/FoodNavBlocks-meat.jpg",
                dimensions: { width: 900, height: 1050 } },
                { URL: "https://assets.grab.com/wp-content/uploads/sites/8/2018/11/20120446/order-grabfood-fast-food-delivery.jpg",
                dimensions: { width: 900, height: 1050 } },
                { uri: "https://i.pinimg.com/1200x/df/f9/fc/dff9fce0da52ccff0cdea550f2ce75cc.jpg",
                dimensions: { width: 900, height: 1050 } },
                { URL: "https://i.pinimg.com/564x/5a/f7/a8/5af7a8f12bc1ee944ba7618879beab3d.jpg",
                dimensions: { width: 900, height: 1050 } },
                { URL: "https://asset1.cxnmarksandspencer.com/is/image/mands/20190926_Christmas-Food-inspiration_LP_Update_SB-21571_03_05?wid=700&qlt=40&fmt=pjpeg",
                dimensions: { width: 900, height: 1050 } },
                { uri: "https://www.calgarycoop.com/assets/content/thumbnails/FoodNavBlocks-seafood.jpg",
                dimensions: { width: 900, height: 1050 } },
                { URL: "https://aot-wpengine.netdna-ssl.com/wp-content/uploads/2019/04/Botswana-elephants-compressed.jpg",
                dimensions: { width: 900, height: 1050 } },
                
            ]}
        />
      </View>  
      </ScrollView>
    </View>  
    );
  }
}


const styles = StyleSheet.create({
  fabDiv:{
    position:'absolute',
    zIndex:1,
    bottom:0,
    right:0,
    margin:15,
  },
  fab:{
    backgroundColor:'#121212',
    alignItems:'center',
    width: wp('15%'),
    borderRadius:wp('10%'),
    justifyContent:'center'
  },
  fabIcon:{
    color:'#FCD705',
    padding: wp('3%'),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#121212',
    padding: 10,
  },
  backArrow:{
    color: '#FCD705',
    fontSize: hp('3%'),
    marginTop: 5,
  },
  inputSearch: {
    width: wp('70%'),
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: 'yellow',
    fontSize: 20,
    backgroundColor: 'transparent',
    color:'#FCD705'
  },
  profileName: {
    fontSize: hp('4%'),
    fontWeight: 'bold',
  },
  follow: {
    marginTop: 10,
    width: wp('30%'),
    alignItems: 'center',
    backgroundColor: '#121212',
    borderRadius: 50,
  },
  countDiv: {
    position:'absolute',
    right:0,
    top:70,
    zIndex:1
  },
  countDesign: {
    backgroundColor:'#121212',
    paddingLeft:wp('3%'),
    paddingVertical:wp('1%'),
    borderTopLeftRadius:wp('2%'),
    borderBottomLeftRadius:wp('2%')
  },
  countTextDesign: {
    backgroundColor:'#121212',
    paddingLeft:wp('1.5%'),
    paddingRight: wp('2%'),
    paddingVertical:wp('1%'),
    borderTopRightRadius:wp('2%'),
    borderBottomRightRadius:wp('2%')
  },
  coutnText: {
    fontSize: hp('2%'),
  },
  ZigZagContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: hp('35%'),
  },
  zigZagImage2: {
    position: 'relative',
    top: 30,
  },
  InlineImg: {
    width: wp('40%'), 
    height: hp('30%'),
    borderWidth: 1,
    borderColor: '#FCD705',
    borderRadius: 20,
  },

});

