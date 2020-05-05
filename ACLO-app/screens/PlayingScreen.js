import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Platform, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { Link } from 'react-navigation'
import { Button, ListItem } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';
import eventItem from '../components/eventItem';
import firebase from 'firebase';
import Firebase, { db } from '../config/Firebase';
import moment from 'moment';
import Toast from 'react-native-root-toast';

class PlayingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      search: '',
      activeSections: [],
      eventList: [],
      filterList: [],
      loading: true,
      refreshing: false
    }
    this.timer;
  }

  componentDidMount() {
    this.getPlayingEventList();
  }

  getPlayingEventList = async () => {
    try {
      const startTime = new Date(moment().startOf('day')).getTime();
      const endTime = new Date(moment().endOf('day')).getTime();
      await db.collection("events")
        .where("dt", ">=", startTime)
        .where("dt", "<=", endTime)
        .onSnapshot((snapshot) => {
          let events = [];
          snapshot.docs.forEach(doc => {
            let items = doc.data();
            console.log('item--------', items);
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
        refreshing: false
      })
      console.log('------failed to fetch event list', error);
    }
  }

  chunk = (array, size) => {
    if (!array) return [];
    const firstChunk = array.slice(0, size); // create the first chunk of the given array
    if (!firstChunk.length) {
      return array; // this is the base case to terminal the recursive
    }
    return [firstChunk].concat(this.chunk(array.slice(size, array.length), size));
  }

  //event delete by admin
  updateEventStatus = async ({ key, participantList }) => {
    const participantCount = participantList ? participantList.length : 0;
    let sidePlayer = null;
    let teams = null; 
    if(participantCount >= 2){
      if (participantCount <= 10) {
        let remainingPlayer = participantList
  
        //check if participant is in ODD
        if ((participantCount % 2) !== 0) {
          sidePlayer = participantList.slice(participantCount - 1);
          remainingPlayer = participantList.slice(0, participantCount - 1);
        }
  
        const teamArray = this.chunk(remainingPlayer, remainingPlayer.length / 2);
        teams = teamArray.map((team, index) => {
          return {
            name: `Team ${index + 1}`,
            score :0,
            team
          }
        })
  
      }
      else if (participantCount > 10 && participantCount <= 15) {
        let remainingPlayer = participantList
  
        //check if participant is in Even
        if ((participantCount % 2) === 0) {
          sidePlayer = participantList.slice(participantCount - 1);
          remainingPlayer = participantList.slice(0, participantCount - 1);
        }
        console.log('-------sideplayer', sidePlayer)
        console.log('------------remainingPlayer', remainingPlayer)
  
        const teamArray = this.chunk(remainingPlayer, remainingPlayer.length / 3);
        console.log('-----team array', teamArray);
        
        teams = teamArray.map((team, index) => {
          return {
            name: `Team ${index + 1}`,
            score :0,
            team
          }
        })
        console.log('--------team', teams);
      } else if (participantCount > 15) {
        let remainingPlayer = participantList
  
        //check if participant is in ODD
        if ((participantCount % 2) !== 0) {
          sidePlayer = participantList.slice(participantCount - 1);
          remainingPlayer = participantList.slice(0, participantCount - 1);
        }
        console.log('-------sideplayer', sidePlayer)
        console.log('------------remainingPlayer', remainingPlayer)
  
        const teamArray = this.chunk(remainingPlayer, remainingPlayer.length / 4);
        console.log('-----team array', teamArray);
        
        teams = teamArray.map((team, index) => {
          return {
            name: `Team ${index + 1}`,
            score :0,            
            team
          }
        })
        console.log('--------team', teams);;
      }
  
      await db.collection("events").doc(key).update({
        status:'started',
        teams,
        sidePlayer
      });
  
      // this.props.navigation.navigate('EventDetailScreen');
  
      Toast.show('Event Started', {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        backgroundColor: '#e7741b',
        textColor: 'white',
        delay: 0,
      });
    } else {
      Toast.show('Participant must be 2 or greater to start event', {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        backgroundColor: '#e7741b',
        textColor: 'white',
        delay: 0,
      });
    }
  }

  registerParticipant = (eventID) => {

    console.log('===evnet Id', eventID);

    const eventRef = db.collection("events").doc(eventID);

    eventRef.update({
      participantList: firebase.firestore.FieldValue.arrayUnion(this.props.user)
    });
  }

  _renderSectionTitle = section => {
    return (
      <View style={styles.content}>
        <Text>{section.content}</Text>
      </View>
    );
  };

  _renderContent = section => {
    return (
      <View style={styles.content}>
        <Text style={[styles.colorWhite]}>Location: {section.location}</Text>
        <Text style={[styles.colorWhite]}>Time: {section.time}</Text>
        <Text style={[styles.colorWhite, styles.divisionText]}>Division: {section.division}</Text>
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
      refreshing: true
    })
    this.getPlayingEventList();
  }


keyExtractor = (item, index) => index.toString()

renderItem = ( {item, index }) => (
  <TouchableOpacity style={styles.header} onPress={() => item.status == 'started' && this.props.navigation.navigate('EventDetailScreen', { eventID: item.key })}>
    <Text style={[styles.colorWhite, styles.sportText]}>{item.sport}</Text>
    <Text style={[styles.colorWhite, styles.dateText]}>{item.date}</Text>
    <Text style={[styles.colorWhite, styles.participantsText]}>{item.participantList ? item.participantList.length : 0}/{item.participants}</Text>
    {
      this.props.user.admin &&
        item.status === 'created' ?
        <Button
          title="Start"
          onPress={() => this.updateEventStatus(item, 'started')}
          buttonStyle={styles.button}
          titleStyle={{ fontSize: 15, color: '#e7741b' }}
          type="outline"
        />
        :
        item.status === 'ended' ?
          <Button
            title='Ended'
            // onPress={()=>this.updateEventStatus(item.key,'ended')}
            buttonStyle={styles.button}
            disabled={true}
            titleStyle={{ fontSize: 15, color: '#e7741b' }}
            type="outline"
          />
          :
          item.status === 'completed' &&
          <Button
          title='Completed'
          // onPress={()=>this.updateEventStatus(item.key,'ended')}
          buttonStyle={styles.button}
          disabled={true}
          titleStyle={{ fontSize: 15, color: '#e7741b' }}
          type="outline"
        />
    }
    <Ionicons name={this.state.activeSections.includes(index) ? 'ios-arrow-down' : 'ios-arrow-forward'} size={25} color="#e7741b" />

  </TouchableOpacity>
)
  render() {
    const { search, refreshing } = this.state;
    const list = [
      {
        name: 'Amy Farha',
        subtitle: 'Vice President'
      },
      {
        name: 'Chris Jackson',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice Chairman'
      }
    ]

    if (this.props.user) {
      console.log("Admin?" + this.props.user.admin)
      console.log("Name: " + this.props.user.name)
      console.log("user: " + JSON.stringify(this.props.user))
      let _events = this.state.filterList.length ? this.state.filterList : this.state.eventList;
      return (
        <View style={styles.container}>
          {
            _events.length == 0 && !this.props.user.admin ?
              <View style={styles.noEventView}>
                <Text style={[styles.colorWhite, styles.noEventText]}> Please wait for the event to start </Text>
                <Text style={[styles.colorWhite, styles.noEventText]}> Make sure you are registered!</Text>
                <Text style={[styles.colorWhite, styles.myEventText]} onPress={() => this.props.navigation.navigate('UpcomingEvents')}>
                  [My Upcoming Events]
                  </Text>
              </View>
              :
              <ScrollView
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
                }
              >
                {
                  this.state.loading ?
                    <ActivityIndicator size='large' color='white' />
                    :
                    // <Accordion
                    //   sections={_events}
                    //   activeSections={this.state.activeSections}
                    //   renderSectionTitle={this._renderSectionTitle}
                    //   renderHeader={this._renderHeader}
                    //   renderContent={this._renderContent}
                    //   onChange={this._updateSections}
                    // />
                    <FlatList
                    keyExtractor={this.keyExtractor}
                    data={_events}
                      renderItem={(data, index) => this.renderItem(data, index)}
                  />
                }
              </ScrollView>
          }
        </View>
      );
    }
  }
}

PlayingScreen.navigationOptions = {
  header: null,
};

const mapStateToProps = state => {
  console.log('state-----', state)
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(PlayingScreen)

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
  header: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1
  },
  content: {
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1
  },
  sportText: {
    flex: 0.4,
    textTransform: 'capitalize'
  },
  dateText: {
    flex: 0.4
  },
  participantsText: {
    // flex:0.2,
  },
  scetionText: {
    color: 'white'
  },
  divisionText: {
    textTransform: 'capitalize'
  },
  colorWhite: {
    color: 'white'
  },
  button: {
    height: 30,
    // paddingBottom:5,
    borderColor: "#e7741b"
  },
  noEventView: {
    padding: 20,
    justifyContent: 'center',
    textAlign: 'center'
  },
  noEventText: {
    fontSize: 20,
    textAlign: 'center'
  },
  myEventText: {
    textDecorationLine: 'underline',
    fontSize: 20,
    textAlign: 'center'
  }
});
