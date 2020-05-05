import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer  } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import EventScreen from '../screens/EventScreen';
import PlayingScreen from '../screens/PlayingScreen';
import AchievementsScreen from '../screens/Achievements';
import PreviousEventsScreen from '../screens/PreviousEvents';
import UpcomingEventsScreen from '../screens/UpcomingEvents';
import CreateEventScreen from '../screens/CreateEventScreen';
import EventDetailScreen from '../screens/EventDetailScreen';

const config = Platform.select({
  web: { headerMode: 'none', header: null },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarOptions: {
    activeTintColor: '#e7741b',
    inactiveTintColor: '#ccc',
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'} />
  ),
};

HomeStack.path = '';

const EventsStack = createStackNavigator(
  {
    Events: EventScreen,
  },
  config
);

EventsStack.navigationOptions = {
  tabBarLabel: 'New events',
  tabBarOptions: {
    activeTintColor: '#e7741b',
    inactiveTintColor: '#ccc',
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-calendar' : 'md-calendar'} />
  ),
};

EventsStack.path = '';

const PlayingStack = createStackNavigator(
  {
    Playing: PlayingScreen,
  },
  config
);

PlayingStack.navigationOptions = {
  tabBarLabel: 'Playing',
  tabBarOptions: {
    activeTintColor: '#e7741b',
    inactiveTintColor: '#ccc',
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-play' : 'md-play'} />
  ),
};

PlayingStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  EventsStack,
  PlayingStack,
});

tabNavigator.path = '';

//add new screens here, this is the main app navigation stack (excluding authentication)
const appNavigatior = createStackNavigator({
  App: { screen: tabNavigator, navigationOptions: {header: null}},
  Achievements: AchievementsScreen,
  PreviousEvents: PreviousEventsScreen,
  UpcomingEvents: UpcomingEventsScreen,
  CreateEvent: CreateEventScreen,
  EventDetailScreen:EventDetailScreen
},
{
    initialRouteName: 'App',
})

export default appNavigatior;
