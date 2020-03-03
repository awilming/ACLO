import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import { connect } from 'react-redux';
import Firebase from '../config/Firebase';

class HomeScreen extends React.Component {

  handleSignout = () => {
    Firebase.auth().signOut()
    this.props.navigation.navigate('Login')
  }

  handleAchievements = () => {
    console.log("Achievements");
    this.props.navigation.navigate('Achievements')
  }
  
  handlePreviousEvents = () => {
    console.log("Previous events");
    this.props.navigation.navigate('PreviousEvents')
  }

  handleUpcomingEvents = () => {
    console.log("Upcoming events");
    this.props.navigation.navigate('UpcomingEvents')
  }

  winningPercentage = () => {
    //new users will have 0 games played, which will result in Nan (not a number) as you can't devide by 0. in this case we will just return 0
    const percentage = (this.props.user.statistics.gameWins/this.props.user.statistics.gamesParticipated)*100;
    const roundPercentage = percentage.toFixed();
    return isNaN(roundPercentage) ? 0 : roundPercentage;
  }

  render(){
    //waiting for props to load, or it cant be rendered ;)
    let loadedProps = this.props.user.statistics;
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>

          <View style={styles.welcomeContainer}>
            <Image
              source={require('../assets/images/aclo-logo.jpg')}
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.nameBar}>
            <Text style={styles.profileText}>{this.props.user.name}</Text>
          </View>

          <View style={styles.statistics}>
              { loadedProps ? <Text style={styles.statisticsText} >Events played: {this.props.user.statistics.eventsParticipated}</Text> : <Text style={styles.profileText}> ...Loading</Text> }
              { loadedProps ? <Text style={styles.statisticsText} >Events won: {this.props.user.statistics.eventWins}</Text> : null }
              { loadedProps ? <Text style={styles.statisticsText} >Matches played: {this.props.user.statistics.gamesParticipated}</Text> : null }
              { loadedProps ? <Text style={styles.statisticsText} >Matches won: {this.props.user.statistics.gameWins}</Text> : null }
              { loadedProps ? <Text style={styles.statisticsText} >Winning percentage: {this.winningPercentage()}%</Text> : null }
          </View>

          <View style={styles.buttonView}>
            <View style={styles.button}>
              <Button color='#e7741b' title='Achievements' onPress={this.handleAchievements}/>
            </View>

            <View style={styles.button}>
              <Button color='#e7741b' title='My previous events' onPress={this.handlePreviousEvents}/>
            </View>

            <View style={styles.button}>
              <Button color='#e7741b' title='My upcoming events'  onPress={this.handleUpcomingEvents}/>
            </View>

            <View style={styles.button}>
              <Button color='#e7741b' title='Logout' onPress={this.handleSignout} />
            </View>
          </View>

        </ScrollView>
      </View>
    );
  }
  
}

HomeScreen.navigationOptions = {
  header: null,
};

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(HomeScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    paddingTop: 3,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  welcomeImage: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
  },
  profileText: {
    color: '#fff',
    fontSize: 30,
    textAlign: 'center'
  },
  button: {
    marginHorizontal: 20,
    marginVertical: 5,
    justifyContent: 'flex-end',
  },
  buttonView: {
    justifyContent: 'flex-end',
    flex: 1,
    marginVertical: 5,
  },
  nameBar: {
    backgroundColor: '#e7741b',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  statistics: {
    flex: 1,
    backgroundColor: '#e7741b',
    marginHorizontal: 20,
    paddingVertical: 10,
  },
  statisticsText: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center'
  },
});
