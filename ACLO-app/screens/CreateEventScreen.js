import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Picker,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { updateSport, updateLocation, updateTime, updateDivision, updateParticipants, updateDate, createEvent } from '../actions/user'
import DateTimePicker from "react-native-modal-datetime-picker";

class CreateEventScreen extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      sport: 'Badminton',
      division: 'recreation',
      participants: 10,
      mode: 'date',
      show: false,
      // if you change the time and date below, also change the fullDate.
      date: '2020-Jan-01',
      dateChanged: false,
      time: '16:00',
      timeChanged: false,
      fullDate: new Date(),
    }
  }

  sportUpdate = (sport) => {
    console.log("sport: " + sport)
    this.setState({sport: sport});
    this.props.updateSport(sport);
  }

  divisionUpdate = (division) => {
    console.log("division: " + division)
    this.setState({division: division});
    this.props.updateDivision(division);
  }

  locationUpdate = (location) => {
    console.log("location: " + location)
    this.setState({location: location});
    this.props.updateLocation(location);
  }

  participantsUpdate = (participants) => {
    console.log("participants: " + participants)
    this.setState({participants: participants});
    this.props.updateParticipants(participants);
  }

  timeUpdate = (data) => {
    let SplitTime = String(data).split(' ');
    time = SplitTime[4];
    let modifiedTime = time.toString();
    //slice gets rid of the seconds. we want it to display hours and minutes only. seconds are not usefull to us.
    //"15:00" instead of "15:00:00"
    modifiedTime = modifiedTime.slice(0, -3);

    this.setState({time: modifiedTime, timeChanged: true, show: false});
    this.props.updateTime(modifiedTime);
  }

  dateUpdate = (data) => {
    let SplitDate = String(data).split(' ');
    let dd = SplitDate[2]
    let mm = SplitDate[1]
    let yyyy = SplitDate[3]
    date =  dd + "-" + mm + "-" + yyyy;
    let modifiedDate = date.toString();

    this.setState({date: modifiedDate, dateChanged: true, show: false});
    this.props.updateDate(modifiedDate);
  }

  onDateTimeConfirm = (data) => {
    this.setState({fullDate: data});
    //depending on the mode (time or date picker) 
    if (this.state.mode == 'time') {
      this.timeUpdate(data)
    } else {
      this.dateUpdate(data)
    }
  }

  showTimePicker= () => {
    this.show('time');
  }

  showDatePicker= () => {
    this.show('date');
  }

  hideDateTimePicker = () => {
    this.setState({ show: false });
  };

  show = mode => {
    this.setState({
      show: true,
      mode,
    });
  }

  //is currently not checking if the date has already past
  onConfirmEvent = () => {
    if (!this.state.location) {
      Alert.alert('Please add a location');
    } else if (!this.state.timeChanged){
      Alert.alert('Are you sure this is the correct time?')
      this.props.updateTime(this.state.time)
      this.setState({timeChanged: true});
    }else if (!this.state.dateChanged) {
      Alert.alert('This is a date that has already passed');
      this.props.updateDate(this.state.date)
      this.setState({dateChanged: true});
    } else {
      //even if the user doesnt change these (..update functions dont get called), 
      //they already have a value. so we need to set the props here if they havent already
      //doesnt hurt to set them again, if they have already been set before
      this.props.updateSport(this.state.sport)
      this.props.updateDivision(this.state.division)
      this.props.updateParticipants(this.state.participants)
      //call createEvent to make an event in the database, then navigate back to eventscreen
      this.props.createEvent();
      Alert.alert('The new event has been saved succesfully');
      this.props.navigation.goBack()
    }
  }

  render(){
    //conditional rendering is used to only show the DateTimePicker, or the other components
    return (
      <View style={styles.container}>
        { this.state.show 
          ? <DateTimePicker
                    isVisible={this.state.show}
                    date={this.state.fullDate}
                    mode={this.state.mode}
                    onConfirm={this.onDateTimeConfirm}
                    minimumDate={new Date()}
                    onCancel={this.hideDateTimePicker} />
        
          : <ScrollView indicatorStyle='white'>
              <View style={styles.orangeBox}>

                <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>Sport </Text>
                  <Picker style={{width: 150}} selectedValue={this.state.sport} onValueChange={(sport) => this.sportUpdate(sport)}>
                    <Picker.Item label="Badminton" value="badminton" />
                    <Picker.Item label="Basketball" value="basketball" />
                    <Picker.Item label="Futsal" value="futsal" />
                    <Picker.Item label="Volley-ball" value="volley ball" />
                  </Picker>
                </View>

                <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>Division </Text>
                  <Picker style={{width: 150}} selectedValue={this.state.division} onValueChange={(division) => this.divisionUpdate(division)}>
                    <Picker.Item label="Recreation" value="recreation" />
                    <Picker.Item label="Standard" value="standard" />
                    <Picker.Item label="Competitive" value="competitive" />
                  </Picker>
                </View>

                <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>Participants </Text>
                  <Picker style={{width: 150}} selectedValue={this.state.participants} onValueChange={(participants) => this.participantsUpdate(participants)}>
                    <Picker.Item label="10" value="10" />
                    <Picker.Item label="15" value="15" />
                    <Picker.Item label="20" value="20" />
                    <Picker.Item label="25" value="25" />
                  </Picker>
                </View>

                <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>Location </Text>
                  <TextInput
                          style={styles.inputBox}
                          value={this.state.location}
                          onChangeText={(location) => this.locationUpdate(location)}
                          placeholder='Location'
                          autoCapitalize="words"
                      />
                </View>

                <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>Time </Text>
                  <TouchableOpacity style={styles.DTpicker} onPress={this.showTimePicker}>
                    <Text>{this.state.time}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>Date </Text>
                  <TouchableOpacity style={styles.DTpicker} onPress={this.showDatePicker}>
                    <Text>{this.state.date}</Text>
                  </TouchableOpacity>
                </View>

              </View>

              <View style={{width: 100, alignSelf: 'center'}}>
                <Button
                    title="Confirm"
                    color="#e7741b"
                    onPress={this.onConfirmEvent}
                />
              </View>
            </ScrollView>
        }
      </View>
    )
  }
}



CreateEventScreen.navigationOptions = {
  title: 'Create event',
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ updateSport, updateLocation, updateTime, updateDivision, updateParticipants, updateDate, createEvent}, dispatch)
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEventScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  orangeBox: {
    backgroundColor: '#e7741b',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  inputBox: {
      width: '60%',
      fontSize: 16,
      borderColor: '#000',
      borderBottomWidth: 1,
      textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  itemText: {
    fontSize: 20,
    paddingTop: 5,
  },
  DTpicker: {
    borderWidth:1,
    borderColor:'#000',
    alignItems:'center',
    justifyContent:'center',
    width:180,
    height:40,
  },
});