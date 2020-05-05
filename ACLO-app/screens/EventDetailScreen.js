import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Platform, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { Link } from 'react-navigation'
import { SearchBar, Button } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';
import eventItem from '../components/eventItem';
import firebase from 'firebase';
import Firebase, { db } from '../config/Firebase';
import moment from 'moment';
import Toast from 'react-native-root-toast';

class EventDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventData: null,
      loading: true,
      refreshing: false,
      activeTeamSections: [],
      activeStandingSections: [],
      activeScheduleSections: [],
      eventID: null
    }
    this.timer;
  }

  componentDidMount() {
    const { eventID } = this.props.navigation.state.params;
    this.setState({
      eventID
    })
    this.getEvent(eventID);
  }

  getEvent = async (id) => {
    try {
      await db.collection("events").doc(id)
        .onSnapshot((snapshot) => {
          const event = snapshot.data();
          console.log('--------------event',event);
          this.setState({
            eventData: event,
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

  //event delete by admin
  updateEventStatus = (status) => {
    const { eventID } = this.state;
    let message = 'Event Started';
    if(status === 'ended'){
      message = 'Event Ended'
      Alert.alert(
        'Confirm',
        'Are you sure to end Event?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => {
            db.collection("events").doc(eventID).update({ status:'ended' });
            this.props.navigation.goBack();
          }},
        ],
        {cancelable: false},
      );
    }
    if (status === 'completed') {
        message = 'Event Completed'
        Alert.alert(
          'Confirm',
          'Are you sure this score is correct?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK', onPress: () => {
                this.updateStatistic()
              }
            },
          ],
          { cancelable: false },
        );
    }

    Toast.show(message, {
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
  
  updateStatistic = () => {
    const { eventData, eventID } = this.state;
    console.log('-----------event Data',eventData);
    let team1 =  eventData.teams[0];
    let team2 =  eventData.teams[1];
    console.log('team --------1',team1);
    console.log('team --------2',team2);
    let winners = team1.team;
    let loosers = team2.team;

    if(team2.score > team1.score){
      winners = team2.team;
      loosers = team1.team
    }
    console.log('===winner',winners);
    console.log('===loosers',loosers);
    winners && winners.map((user) => {
      let updatedStats = {
        ...user,
        statistics : {
          ...user.statistics,
          eventWins: user.statistics.eventWins + 1,
          eventsParticipated: user.statistics.eventsParticipated + 1,
          gameWins: user.statistics.gameWins + 1,
          gamesParticipated: user.statistics.gamesParticipated + 1
        }
      };
      console.log('============', updatedStats);
      this._updateUserData(updatedStats)
    })
    loosers && loosers.map((user) => {
      let updatedStats = {
        ...user,
        statistics : {
          ...user.statistics,
          eventsParticipated: user.statistics.eventsParticipated + 1,
          gamesParticipated: user.statistics.gamesParticipated + 1
        }
      };
      console.log('============', updatedStats);
      this._updateUserData(updatedStats)
    })
    db.collection("events").doc(eventID).update({ status: 'completed' });
    this.props.navigation.goBack();
  }

  _updateUserData = (user)=>{
    console.log('render-----------------------',user);
    const userRef = db.collection('users').doc(user.uid).set(user,
      { merge: true }
    );
  }


  _renderSectionTitle = section => {
    return (
      <View style={styles.content}>
      </View>
    );
  };

  _renderTeamHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={[styles.colorWhite, styles.headingText]}>Team</Text>
        <Ionicons name={this.state.activeTeamSections.includes(0) ? 'ios-arrow-down' : 'ios-arrow-forward'} size={25} color="#e7741b" />
      </View>
    );
  };

  _renderStandingHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={[styles.colorWhite, styles.headingText]}>Standings</Text>
        <Ionicons name={this.state.activeStandingSections.includes(0) ? 'ios-arrow-down' : 'ios-arrow-forward'} size={25} color="#e7741b" />
      </View>
    );
  };

  _renderScheduleHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={[styles.colorWhite, styles.headingText]}>Schedule</Text>
        <Ionicons name={this.state.activeScheduleSections.includes(0) ? 'ios-arrow-down' : 'ios-arrow-forward'} size={25} color="#e7741b" />

      </View>
    );
  };

  _renderTeamContent = (section) => {
    // console.log('-------section', section);
    return <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      {
       section.teams && section.teams.map(({ name, team }, index) => {
          return (
            <View style={styles.teamContent} key={index}>
              <Text style={[styles.colorWhite, { fontWeight: 'bold', fontSize: 15 }]}>{name}</Text>
              {
                team.map((data, index2) => (
                  <Text style={styles.colorWhite} key={index2}>{data.name}</Text>
                ))
              }
            </View>
          );
        })

      }
    </View>
  };

  _renderStandingsContent = (section) => {
    let _teams = section.teams ? section.teams : [];
    let standings = [];
    // for (let i = 0; i <= _teams.length; i++) {
      if (_teams[0].score > _teams[1].score){
        standings.push(_teams[0]);
        standings.push(_teams[1]);
      }else{
        standings.push(_teams[1]);
        standings.push(_teams[0]);
      }
    // }
    console.log('=========stadings',standings);
    return <View style={{ flexDirection: 'column', alignItems: 'center' }}>
      {
      standings.map((teamData, index) => {
          return (
            <View style={styles.standingsContent} key={index}>
              <Text style={styles.colorWhite}>{index + 1}</Text>
              <Text style={styles.colorWhite}>{teamData.name}</Text>
              <Text style={styles.colorWhite}>{teamData.score ? teamData.score : 0}</Text>
            </View>
          );
        })

      }
    </View>
  };

  _renderScheduleContent = section => {
    let scoreCard = '';
    section.teams && section.teams.map((data, index) => {
      let score = data.score ? data.score : 0
      if (section.teams.length === index + 1) {
        scoreCard = `${scoreCard}-${score}`
      } else {
        scoreCard = `${score}`
      }
    })
    let team_one_data = section.teams[0];
    let team_two_data = section.teams[1];
    // console.log('teams-----',section.teams);
    // console.log('team_one_data-----',team_one_data);

    if (this.props.user.admin) {
      return <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'column', paddingTop: 10 }}>
          <Text style={styles.colorWhite}>{team_one_data && team_one_data.name}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <Button
              title="-"
              onPress={() => this.scoreDeccrease( team_one_data && team_one_data,section,)}
              buttonStyle={{ borderColor: '#e7741b', height: 40, width: 45 }}
              disabled={team_one_data && team_one_data.score && team_one_data.score <= 0 ? true : false}
              titleStyle={{ fontSize: 15, color: '#e7741b' }}
              type="outline"
            />
            <Button
              title="+"
              onPress={() => this.scoreIncrease( team_one_data,section)}
              buttonStyle={{ borderColor: '#e7741b', height: 40, width: 45 }}
              titleStyle={{ fontSize: 15, color: '#e7741b' }}
              type="outline"
            />
            <Text style={[styles.colorWhite, { marginLeft: 30 }]}>{team_one_data && team_one_data.score ? team_one_data.score : 0}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'column', paddingTop: 10 }}>
          <Text style={[styles.colorWhite, { width: 10, borderBottomColor: 'white', borderBottomWidth: 1 }]}></Text>
        </View>
        <View style={{ flexDirection: 'column', paddingTop: 10 }}>
          <View style={{ flexDirection: 'row',justifyContent:'flex-end' }}>
            <Text style={[styles.colorWhite, { alignSelf: 'flex-end', marginRight: 8 }]}>{team_two_data && team_two_data.name}</Text>
            <Button
              title="End"
              onPress={() => this.updateEventStatus('completed')}
              buttonStyle={{ borderColor: '#e7741b', height: 30, width: 45}}
              titleStyle={{ fontSize: 15, color: '#e7741b' }}
              type="outline"
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <Text style={[styles.colorWhite, { marginRight: 30 }]}>{team_two_data &&  team_two_data.score ? team_two_data.score : 0}</Text>            
            <Button
              title="+"
              onPress={() => this.scoreIncrease( team_two_data,section)}
              buttonStyle={{borderColor:'#e7741b',height:40,width:45 }}
              titleStyle={{ fontSize: 15, color: '#e7741b' }}
              type="outline"
            />
            <Button
              title="-"
              onPress={() => this.scoreDeccrease(team_two_data,section)}
              buttonStyle={{borderColor:'#e7741b',height:40,width:45}}
              disabled={team_two_data &&  team_two_data.score && team_two_data.score <= 0 ? true : false}
              titleStyle={{ fontSize: 15, color: '#e7741b' }}
              type="outline"
            />
          </View>
        </View>
      </View>

    } else {
      return <View style={styles.scheduleContent}>
        <Text style={styles.colorWhite}>[{section.time}]</Text>
        <Text style={styles.colorWhite}>Team 1</Text>
        <Text style={styles.colorWhite}>Vs</Text>
        <Text style={styles.colorWhite}>Team 2</Text>
        <Text style={styles.colorWhite}>{scoreCard}</Text>
      </View>
    }

  };

  _updateTeamSections = activeTeamSections => {
    this.setState({ activeTeamSections });
  };

  _updateStandingSections = activeStandingSections => {
    this.setState({ activeStandingSections });
  };

  _updateScheduleSections = activeScheduleSections => {
    this.setState({ activeScheduleSections });
  };

  onRefresh = async () => {
    await this.setState({
      refreshing: true
    })
    this.getPlayingEventList();
  }

  scoreIncrease = async (event,eventData) => {
    const _event =  eventData.teams && eventData.teams.map((_item)=>
    {
      if (_item.name === event.name) {
        return {
          ..._item,
          score: event.score ? event.score + 1 : 1
        }
      } else {
        return _item
      }
    });
    console.log('event data================>',event,_event,this.state.eventID);

    // // Document reference
    const eventRef = db.collection('events').doc(this.state.eventID).set(
      { teams: _event },
      { merge: true }
    );

  }

  scoreDeccrease = async (event,eventData) => {
    const _event =  eventData.teams && eventData.teams.map((_item)=>
    {
      if (_item.name === event.name) {
        return {
          ..._item,
          score: event.score ? event.score -1 : 1
        }
      } else {
        return _item
      }
    });
    console.log('event data================>',event,_event,this.state.eventID);

    // // Document reference
    const eventRef = db.collection('events').doc(this.state.eventID).set(
      { teams: _event },
      { merge: true }
    );

  }
  render() {
    const { eventData, refreshing } = this.state;

    // console.log('-------------eventData', eventData);

    return (
      <View style={styles.container}>
        {
          this.state.loading ?
            <ActivityIndicator size='large' color='white' />
            :
            <ScrollView style={{ padding: 15 }}>
              <View style={[styles.alignRow]}>
                <Text style={[styles.colorWhite, styles.sportText]}>{eventData && eventData.sport}</Text>
                <Text style={[styles.colorWhite, styles.text]}>[{eventData && eventData.division}]</Text>
              </View>
              <View style={[styles.alignRow]}>
                <Text style={[styles.colorWhite, styles.text]}>[{eventData && eventData.date}]</Text>
                <Text style={[styles.colorWhite, styles.text]}>[{eventData && eventData.time}]</Text>
              </View>
              <View>
                <Text style={[styles.colorWhite, styles.text]}>[{eventData && eventData.location}]</Text>
              </View>
              <View style={styles.dropView}>
                {/* Teams */}
                <Accordion
                  sections={[this.state.eventData]}
                  activeSections={this.state.activeTeamSections}
                  renderSectionTitle={this._renderSectionTitle}
                  renderHeader={this._renderTeamHeader}
                  renderContent={this._renderTeamContent}
                  onChange={this._updateTeamSections}
                />
              </View>

              <View style={styles.dropView}>
                {/* Standings */}
                <Accordion
                  sections={[this.state.eventData]}
                  activeSections={this.state.activeStandingSections}
                  renderSectionTitle={this._renderSectionTitle}team
                  renderHeader={this._renderStandingHeader}
                  renderContent={this._renderStandingsContent}
                  onChange={this._updateStandingSections}
                />
              </View>

              <View style={styles.dropView}>
                {/* Schedule */}
                <Accordion
                  sections={[this.state.eventData]}
                  activeSections={this.state.activeScheduleSections}
                  renderSectionTitle={this._renderSectionTitle}
                  renderHeader={this._renderScheduleHeader}
                  renderContent={this._renderScheduleContent}
                  onChange={this._updateScheduleSections}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                <Button
                  title="Back"
                  onPress={() => this.props.navigation.goBack()}
                  buttonStyle={styles.button}
                  titleStyle={{ fontSize: 15, color: '#e7741b' }}
                  type="outline"
                />
                {
                  this.props.user.admin &&
                <Button
                title="End Event"
                onPress={() => this.updateEventStatus('ended')}
                buttonStyle={styles.button}
                titleStyle={{ fontSize: 15, color: '#e7741b' }}
                type="outline"
                />
              }

              </View>
            </ScrollView>
        }
      </View>
    );
  }
}

EventDetailScreen.navigationOptions = {
  header: null,
};

const mapStateToProps = state => {
  // console.log('state-----', state)
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(EventDetailScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    marginTop: 20,
    backgroundColor: '#000',
  },
  header: {
    // padding:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // flex:1
  },
  headingText: {
    fontSize: 20
  },
  loadingText: {
    color: '#fff',
    fontSize: 30,
    textAlign: 'center'
  },
  alignRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  sportText: {
    fontSize: 20,
    textTransform: 'capitalize'
  },
  dateText: {
    fontSize: 18,
    textTransform: 'capitalize'
  },
  participantsText: {
    // flex:0.2,
  },
  divisionText: {
    fontSize: 18,
    textTransform: 'capitalize'
  },
  locationText: {
    fontSize: 18,
    textTransform: 'capitalize'
  },
  text: {
    fontSize: 16,
    textTransform: 'capitalize'
  },
  colorWhite: {
    color: 'white'
  },
  button: {
    height: 40,
    // width:70,
    borderColor: "#e7741b"
  },
  dropView: {
    marginTop: 25
  },
  scheduleContent: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  teamContent: {
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  standingsContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10
  },
});
