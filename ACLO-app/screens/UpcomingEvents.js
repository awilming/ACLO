import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { SearchBar, Button } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';
import eventItem from '../components/eventItem';
import firebase from 'firebase';
import moment from 'moment';
import Firebase, { db } from '../config/Firebase'

class UpcomingEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      search: '',
      activeSections: [],
      eventList: [],
      loading: true
    }
    this.timer;
  }

  componentDidMount() {
    this.getEventList();
  }
  // firebase.firestore.FieldValue.arrayRemove("east_coast")

  getEventList = async () => {
    try {
      const todayTime = new Date(moment().startOf('day')).getTime();
      await db.collection("events")
        .where("participantList", "array-contains", this.props.user)
        .where("dt", ">=", todayTime)
        .onSnapshot((snapshot) => {
          let events = [];
          snapshot.docs.forEach(doc => {
            let items = doc.data();
            events.push({
              ...items,
              key: doc.id
            });
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
      console.log('------failed to fetch upcoming event list', error);
    }
  }


  unRegisterParticipant = (eventID) => {
    console.log('===evnet Id', eventID);

    const eventRef = db.collection("events").doc(eventID);
    eventRef.update({
      participantList: firebase.firestore.FieldValue.arrayRemove(this.props.user)
    });
  }

  _renderSectionTitle = section => {
    return (
      <View style={styles.content}>
        <Text>{section.content}</Text>
      </View>
    );
  };

  _renderHeader = (section, index) => {
    return (
      <View style={styles.header}>
        <Text style={[styles.colorWhite, styles.sportText]}>{section.sport}</Text>
        <Text style={[styles.colorWhite, styles.dateText]}>{section.date}</Text>
        <Text style={[styles.colorWhite, styles.participantsText]}>{section.participantList ? section.participantList.length : 0}/{section.participants}</Text>

        <Button
          title="Unregister"
          buttonStyle={styles.button}
          titleStyle={{ fontSize: 15, color: '#e7741b' }}
          type="outline"
          // disabled={section.status !== 'created' ? true : false}
          onPress={() => this.unRegisterParticipant(section.key)}
        />
        <Ionicons name={this.state.activeSections.includes(index) ? 'ios-arrow-down' : 'ios-arrow-forward'} size={25} color="#e7741b" />

      </View>
    );
  };

  _renderContent = section => {
    return (
      <View style={styles.content}>
        <Text style={[styles.colorWhite]}>Location: {section.location}</Text>
        <Text style={[styles.colorWhite]}>Time: {section.time}</Text>
        <Text style={[styles.colorWhite, styles.divisionText]}>Division: {section.division}</Text>
        <Text style={[styles.colorWhite]}>Participants:{
          section.participantList && section.participantList.length > 0 ? section.participantList.map((_user, index) => {
            return <Text style={styles.colorWhite}>{_user.name}{section.participantList.length > (index + 1) && ' , '}</Text>
          })
            : '-'
        }</Text>
      </View>
    );
  };

  _updateSections = activeSections => {
    console.log(activeSections, '-----------------')
    this.setState({ activeSections });
  };

  onRefresh = async () => {
    await this.setState({
      refreshing: true
    })
    this.getEventList();
  }
  render() {
    const { refreshing } = this.state;
    if (this.props.user) {
      console.log("Admin?" + this.props.user.admin)
      console.log("Name: " + this.props.user.name)
      console.log("user: " + JSON.stringify(this.props.user))
      console.log("hi admin");
      return (
        <View style={styles.container}>
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
                  sections={this.state.eventList}
                  activeSections={this.state.activeSections}
                  renderSectionTitle={this._renderSectionTitle}
                  renderHeader={this._renderHeader}
                  renderContent={this._renderContent}
                  onChange={this._updateSections}
                />
            }
          </ScrollView>
        </View>
      );
    }
  }
}

UpcomingEvents.navigationOptions = {
  title: 'Upcoming events',
};

const mapStateToProps = state => {
  console.log('state-----', state)
  return {
    user: state.user
  }
}


export default connect(mapStateToProps)(UpcomingEvents)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  }
});
