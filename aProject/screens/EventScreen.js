import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import eventItem from '../components/eventItem';

class EventScreen extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          posts: []
      }
  }

  render(){
    if(this.props.user){
      console.log("Admin?" + this.props.user.admin)
      console.log("Name: " + this.props.user.name)
      console.log("user: " + JSON.stringify(this.props.user))
      //if props have been loaded
      if(this.props.user.admin){
        //if the user is an admin, render this
        console.log("hi admin");
        return (
          <View style={styles.container}>
            <ScrollView >
              
            </ScrollView>
            <TouchableOpacity style={styles.addEvent} onPress={() => this.props.navigation.navigate('CreateEvent')}>
              <Ionicons name={Platform.OS === 'ios' ? 'ios-add-circle' : 'md-add-circle'}  size={78} color="#e7741b" />
            </TouchableOpacity>
          </View>
        );
      } else if(!this.props.user.admin){
        //if the user is not an admin, render this
        console.log("hi user");
        return (
          <ScrollView style={styles.container}>

          </ScrollView>
        );
      }
    } else{
      //return loading text if props have not been loaded yet
      return (
        <ScrollView style={styles.container}>
          <View style={styles.statistics}>
            <Text style={styles.loadingText}> ...Loading</Text>
          </View>
        </ScrollView>
      );
    }
  }
}

EventScreen.navigationOptions = {
  header: null,
};

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(EventScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    marginTop: 20,
    backgroundColor: '#000',
  },
  statistics: {
    flex: 1,
    backgroundColor: '#e7741b',
    marginHorizontal: 20,
    paddingVertical: 10,
  },
  loadingText: {
    color: '#fff',
    fontSize: 30,
    textAlign: 'center'
  },
  addEvent: {
    borderWidth:1,
    borderColor:'#000',
    alignItems:'center',
    justifyContent:'center',
    width:70,
    height:70,
    position: 'absolute',                                          
    bottom: 20,                                                    
    right: 35,
    backgroundColor:'#fff',
    borderRadius:100,
  }
});
