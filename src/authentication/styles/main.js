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
        marginTop: wp('3%'),
        borderRadius: wp('2%'),
        borderWidth: 2,
        borderColor: 'white',
    },
    primaryButtonContanier: {
        width: wp('80%'),
        color: '#ed5720',
        backgroundColor: 'white',
        marginLeft: wp('10%'),
        alignItems: 'center',
        marginTop: wp('3%'),
        borderRadius: wp('2%'),
        borderWidth: 2,
        borderColor: 'white',
    },
    buttonText: {
        color: 'white',
        width: wp('80%'),
        alignItems: 'center',
        fontSize: hp('2.5%'),
        marginLeft: wp('55%'),
        paddingVertical: 8,
        paddingHorizontal: 20,
        fontWeight: 'bold',
    },
    primaryButtonText: {
        color: '#ed5720',
        width: wp('80%'),
        alignItems: 'center',
        fontSize: hp('2.5%'),
        marginLeft: wp('55%'),
        paddingVertical: 8,
        paddingHorizontal: 20,
        fontWeight: 'bold',
    },

    leftBorderButton: {
        color: '#ed5720',
        fontSize: hp('2%'),
        marginTop: 10,
        borderColor: '#A9A9A9',
        backgroundColor: '#fff',
        paddingVertical: wp('3%'),
        paddingHorizontal: wp('10%'),
        fontWeight: 'bold',
        borderTopRightRadius: wp('8%'),
        borderBottomRightRadius: wp('8%'),
        borderWidth: 1,
        borderColor: '#fff'
    },

    rightBorderButton: {
        color: '#ed5720',
        fontSize: hp('2%'),
        marginTop: 10,
        borderColor: '#A9A9A9',
        backgroundColor: '#fff',
        paddingVertical: wp('3%'),
        paddingHorizontal: wp('9%'),
        fontWeight: 'bold',
        borderTopLeftRadius: wp('8%'),
        borderBottomLeftRadius: wp('8%'),
        borderWidth: 1,
        borderColor: '#fff'
    },

    inputContainer: {
        width: wp('80%'), height: hp('6%'), marginBottom: wp('3%'), color: '#fff', borderColor: 'white', borderWidth: 1.5, borderRadius: wp('2%'),
    },
    passwordContainer: {
        width: wp('80%'), height: hp('6%'), borderColor: 'white', marginBottom: wp('2%'),
        borderWidth: 1.5, borderRadius: wp('2%'), color: '#fff'
    },
    labelContainer: {
        textAlign: 'left', color: 'white', paddingBottom: wp('2%'), marginTop: wp('4%')
    },
    logo: {
        width: wp('50%'),
        height: hp('40%'),
        resizeMode: 'cover',
        marginLeft: wp('10%'),
    },
    passwordIconContainer: {
        width: wp('50%'), height: hp('6%'), borderColor: 'white', marginBottom: wp('2%'),
        borderWidth: 1.5, borderRadius: wp('2%'), color: '#fff'
    },
    imagesContainer: { borderRadius: 10, borderWidth: 1.5, borderColor: 'white', height: hp('15%'), width: wp('27%') }
});

export default main;