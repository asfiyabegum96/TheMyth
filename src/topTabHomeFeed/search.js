import React from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    Button,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Entypo';
import UserAvatar from 'react-native-user-avatar';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
}
    from 'react-native-responsive-screen';
import { SearchBar } from 'react-native-elements';
const Jaguar = '#22222C';

export default class search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          search: '',
        }
        this.baseState = this.state;
      }
    componentDidMount() {
        loc(this);
    }

    componentWillUnMount() {
        rol();
    }

    updateSearch() {
        this.setState({search});
    }
    render() {
        const { search } = this.state;
        return (
            <View style={{ flex: 1, }}>
                <SearchBar containerStyle={{ backgroundColor: 'fff2e7', height: hp('8%'), borderBottomWidth: 0, borderTopWidth: 0 }} inputContainerStyle={styles.inputSearch}
                    placeholder="Search"
                    autoFocus="true"
                    placeholderTextColor="#FF7200"
                    inputStyle={{ color: '#FF7200' }}
                    onChangeText={() => this.updateSearch()}
                    value={search}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    bell: {
        fontSize: hp('3%'),
    },
    inputSearch: {
        width: wp('90%'),
        marginLeft: '4%',
        paddingVertical: 2,
        paddingLeft: '5%',
        borderBottomWidth: 1,
        borderBottomColor: '#FF7200',
        backgroundColor: '#fff2e7',
        fontSize: 20,
        color: '#FF7200',
        height: hp('6%')
    },
});

