import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { SearchBar, Button } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';
import eventItem from '../components/eventItem';
import firebase from 'firebase';
import Firebase, { db } from '../config/Firebase';
import moment from 'moment';

class EventScreen extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          posts: [],
          search: '',
          activeSections: [],
          eventList:[],
          filterList:[],
          loading: true,
          refreshing:false
      }
      this.timer;
  }

  componentDidMount(){
    this.getEventList();
  }

  getEventList = async () => {
    try {
      const todayTime = new Date(moment().startOf('day')).getTime();
      await db.collection("events")
        .where("dt", ">=", todayTime)
        .onSnapshot((snapshot) => {
          let events = [];
          snapshot.docs.forEach(doc => {
            let items = doc.data();
            console.log('item--------',items);
            if (items.participantList && items.participantList.length > 0) {
              let userMatch = false;
              items.participantList.find((_user) => {
                // alert(JSON.stringify(_user));
                // alert(JSON.stringify(this.props.user.uid));
                if (_user.uid !== this.props.user.uid) {
                  userMatch = true
                  // alert(JSON.stringify(userMatch));
                }
              });
              if (userMatch) {
                events.push({
                  ...items,
                  key: doc.id
                });
              }
            } else {
              events.push({
                ...items,
                key: doc.id
              });
            }
          });
          this.setState({
            eventList: events,
            loading: false,
            refreshing: false
          })
        });
    } catch (error) {
      this.setState({
        loading: false,
        refreshing:false
      })
      console.log('------failed to fetch event list',error);
    }
  }

  //event delete by admin
  deleteEvent = (eventID) => {
    db.collection("events").doc(eventID).delete()
  }

  registerParticipant = (eventID) => {

    console.log('===evnet Id',eventID);

    const eventRef = db.collection("events").doc(eventID);

    eventRef.update({
      participantList: firebase.firestore.FieldValue.arrayUnion(this.props.user)
    });
  }

  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    const filteredEvents = this.state.eventList.filter(function(item) {

      const textData = text.toLowerCase();
       if((item.sport.indexOf(textData) > -1) || (item.division.indexOf(textData) > -1) ){
        return item
      };

    });

    this.setState({
      filterList: filteredEvents,
      search: text,
    });
  }

  updateSearch = search => {
    this.setState({ search });
  };

  _renderSectionTitle = section => {
    return (
      <View style={styles.content}>
        <Text>{section.content}</Text>
      </View>
    );
  };

  _renderHeader = (section,index) => {
    // console.log('============local sate',this.state)
    return (
      <View style={styles.header}>
        <Text style={[styles.colorWhite,styles.sportText]}>{section.sport}</Text>
        <Text style={[styles.colorWhite, styles.dateText]}>{section.date}</Text>
        <Text style={[styles.colorWhite, styles.participantsText]}>{section.participantList ? section.participantList.length : 0}/{section.participants}</Text>
        {
          this.props.user.admin ?
            <Button
              title="Delete"
              onPress={()=>this.deleteEvent(section.key)}
              buttonStyle={styles.button}
              titleStyle={{ fontSize: 15, color: '#e7741b' }}
              type="outline"
            /> :
            <Button
              title="Register"
              onPress={()=>this.registerParticipant(section.key)}
              buttonStyle={styles.button}
              titleStyle={{ fontSize: 15, color: '#e7741b' }}
              type="outline"
            />
        } 
        <Ionicons name={this.state.activeSections.includes(index) ? 'ios-arrow-down' : 'ios-arrow-forward'} size={25} color="#e7741b" />
        
      </View>
    );
  };

  _renderContent = section => {
    return (
      <View style={styles.content}>
        <Text style={[styles.colorWhite]}>Location: {section.location}</Text>
        <Text style={[styles.colorWhite]}>Time: {section.time}</Text>
        <Text style={[styles.colorWhite,styles.divisionText]}>Division: {section.division}</Text>
        <Text style={[styles.colorWhite]}>Participants: --</Text>
      </View>
    );
  };

  _updateSections = activeSections => {
    // console.log(activeSections,'-----------------')
    this.setState({ activeSections });
  };

  onRefresh = async () => {
    await this.setState({
      refreshing:true
    })
    this.getEventList();
  }
  render(){
    const { search,refreshing } = this.state;
    
    if(this.props.user){
      console.log("Admin?" + this.props.user.admin)
      console.log("Name: " + this.props.user.name)
      console.log("user: " + JSON.stringify(this.props.user))
      let _events = this.state.filterList.length ? this.state.filterList : this.state.eventList; 
        return (
          <View style={styles.container}>
            <SearchBar
              placeholder="Search"
              onChangeText={(text) => this.SearchFilterFunction(text)}
              value={search}
            />
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
              }
            >
              {
                this.state.loading ?
                  <ActivityIndicator size='large' color='white' />
                  :
                  <Accordion
                    sections={_events}
                    activeSections={this.state.activeSections}
                    renderSectionTitle={this._renderSectionTitle}
                    renderHeader={this._renderHeader}
                    renderContent={this._renderContent}
                    onChange={this._updateSections}
                  />
              }
            </ScrollView>
            {
              this.props.user.admin &&
              <TouchableOpacity style={styles.addEvent} onPress={() => this.props.navigation.navigate('CreateEvent')}>
                <Ionicons name={Platform.OS === 'ios' ? 'ios-add-circle' : 'md-add-circle'} size={78} color="#e7741b" />
              </TouchableOpacity>
            }
          </View>
        );
    }
  }
}

EventScreen.navigationOptions = {
  header: null,
};

const mapStateToProps = state => {
  console.log('state-----',state)
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
  },
  header:{
    padding:10,
    flexDirection:'row',
    justifyContent:'space-between',
    flex:1
  },
  content:{
    paddingLeft:10,
    paddingRight:10,
    flexDirection:'column',
    justifyContent:'space-between',
    flex:1
  },
  sportText:{
    flex:0.4,
    textTransform:'capitalize'
  },
  dateText:{
    flex:0.4
  },
  participantsText:{
    // flex:0.2,
  },
  scetionText:{
    color:'white'
  },
  divisionText:{
    textTransform:'capitalize'
  },
  colorWhite:{
    color:'white'
  },
  button:{
    height:30,
    // paddingBottom:5,
    borderColor: "#e7741b"
  }
});
