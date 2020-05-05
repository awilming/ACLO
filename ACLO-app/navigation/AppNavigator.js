import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import MainTabNavigator from './MainTabNavigator';
import Login from '../screens/login';
import SignUpScreen from '../screens/SignUp';

const AppStack = createStackNavigator({ Main: MainTabNavigator }, { headerMode: 'none' });

export default createAppContainer(
  createSwitchNavigator({
      App: AppStack,
      Login: Login,
      SignUp: SignUpScreen,
    },
    {
      	initialRouteName: 'Login',
    })
);
