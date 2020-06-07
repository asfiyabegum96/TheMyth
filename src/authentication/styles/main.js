import {
    StyleSheet
} from 'react-native';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
}
    from 'react-native-responsive-screen';
const main = StyleSheet.create({
    buttonContainer: {
        width: wp('80%'),
        marginLeft: wp('10%'),
        alignItems: 'center',
        backgroundColor: '#FF7200',
        borderRadius: 17,
        borderWidth: 1,
        borderColor: '#FF7200'

    },
    buttonText: {
        color: '#fff2e7',
        width: wp('80%'),
        alignItems: 'center',
        fontSize: hp('2.5%'),
        marginLeft: wp('55%'),
        paddingVertical: 8,
        paddingHorizontal: 20,
        fontWeight: 'bold',
    },

    leftBorderButton: {
        color: '#fff',
        fontSize: hp('2%'),
        marginTop: 10,
        borderColor: '#A9A9A9',
        backgroundColor: '#FF7200',
        paddingVertical: wp('3%'),
        paddingHorizontal: wp('10%'),
        fontWeight: 'bold',
        borderTopRightRadius: wp('8%'),
        borderBottomRightRadius: wp('8%'),
        borderWidth: 1,
        borderColor: '#FF7200'
    },

    rightBorderButton: {
        color: '#fff',
        fontSize: hp('2%'),
        marginTop: 10,
        borderColor: '#A9A9A9',
        backgroundColor: '#FF7200',
        paddingVertical: wp('3%'),
        paddingHorizontal: wp('9%'),
        fontWeight: 'bold',
        borderTopLeftRadius: wp('8%'),
        borderBottomLeftRadius: wp('8%'),
        borderWidth: 1,
        borderColor: '#FF7200'
    }
});

export default main;