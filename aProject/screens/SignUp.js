import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Button, Alert } from 'react-native'
import Firebase from '../config/Firebase'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateEmail, updatePassword, updateName, signup } from '../actions/user'

class Signup extends React.Component {
    handleSignUp = () => {
    	if (!this.validateEmail(this.props.user.email)) {
    		//this is not a correctly formatted email
		  	Alert.alert('invalid email');
		} else {
		  	if(this.props.user.name == undefined || this.props.user.name.length == 0){
		  		//if the name is still undefined or empty
		  		Alert.alert('Please enter a first and last name');
		  	}else {
		  		if(this.validateName(this.props.user.name) != 2 ){
		  		// if the name is less than 2 or more than 2 words
		  		Alert.alert('Please enter a first and last name');
			  	} else {
			  		if(this.props.user.password == undefined || this.props.user.password.length == 0){
			  			//if the name is still undefined or empty
			  			console.log("password is empty or undefined")
			  			Alert.alert('Please enter a password that is longer than 6 characters');
			  		} else{
			  			if(this.props.user.password.length <= 5){
			  				//if the password is shorter than 6 characters
					  		console.log('invalid password lenght' + this.props.user.password.length)
					  		Alert.alert('Please enter a password that is longer than 6 characters');
					  	} else {
					  		this.props.signup()
			    			//this.props.navigation.navigate('App')
					  	}
			  		}
			  		
				}
		  	}
		  	
		}
    }

    validateEmail = (email) => {
	  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	}

	validateName = (name) => {
		// counts how many words the name has by spaces after every word. e.g. ("bob bob" = 2), ("bob bob " = 3)
		return name.split(/\s+/).length;
	}

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.inputBox}
                    value={this.props.user.name}
                    onChangeText={name => this.props.updateName(name)}
                    placeholder='Full Name'
                    autoCapitalize="words"
                />
                <TextInput
                    style={styles.inputBox}
                    value={this.props.user.email}
                    onChangeText={email => this.props.updateEmail(email)}
                    keyboardType='email-address'
                    placeholder='Email'
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.inputBox}
                    value={this.props.user.password}
                    onChangeText={password => this.props.updatePassword(password)}
                    placeholder='Password'
                    secureTextEntry={true}
                />
                <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
                    <Text style={styles.buttonText}>Signup</Text>
                </TouchableOpacity>

            	<Button
                    title="You already have an acount? Go back"
                    onPress={() => this.props.navigation.navigate('Login')}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputBox: {
        width: '85%',
        margin: 10,
        padding: 15,
        fontSize: 16,
        borderColor: '#d3d3d3',
        borderBottomWidth: 1,
        textAlign: 'center'
    },
    button: {
        marginTop: 30,
        marginBottom: 20,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#FFA611',
        borderColor: '#FFA611',
        borderWidth: 1,
        borderRadius: 5,
        width: 200
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    },
    buttonSignup: {
        fontSize: 12
    }
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({updateName, updateEmail, updatePassword, signup }, dispatch)
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Signup)