import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

export default class RadioButton extends Component {
	state = {
		radioState: null,
	};
	// handleRadioButton = (item) =>{
	// 	this.setState({
	// 		value:item.key
	// 	});
	// }
	render() {
		const { options } = this.props;
		// const radioState = this.state.radioState;
        // console.log(radioState);
		return (
			<View>
				{options.map(item => {
					return (
						<View key={item.key} style={styles.buttonContainer}>
                            <View>
                                <TouchableOpacity
                                        style={styles.circle}
                                        onPress={() => {
                                            this.setState({
                                                radioState: item.key,
                                            });
                                        }}
                                    >
                                        {radioState === item.key && <View style={styles.checkedCircle} />}
                                    </TouchableOpacity>
                            </View>
                            <View>
                                <Text style={{color:'white',marginLeft:10}}>{item.text}</Text>
                            </View>
                        </View>
					);
				})}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	buttonContainer: {
        flexDirection: 'row',
        marginBottom:6,
        left:110
	},

	circle: {
		height: 20,
		width: 20,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#ACACAC',
		alignItems: 'center',
		justifyContent: 'center',
	},
  
	checkedCircle: {
		width: 14,
		height: 14,
		borderRadius: 7,
		backgroundColor: '#FCD705',
	},
});