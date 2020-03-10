/* eslint-disable react/display-name */
import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Post from '../views/Post';
import AuthLoading from '../views/AuthLoading';
import Login from '../views/Login';
import Upload from '../views/Upload';
import Search from "../views/Search";
import Likes from '../views/Likes';
import {Icon} from 'native-base';
import MyFiles from '../views/MyFiles';
import Modify from '../views/Modify';

const TabNavigator = createBottomTabNavigator(
    {
      Home,
      Profile,
      Upload,
      Likes
    },
    {
      defaultNavigationOptions: ({navigation}) => ({
        tabBarIcon: ({focused, color}) => {
          const {routeName} = navigation.state;
          let iconName;
          if (routeName === 'Home') {
            iconName = 'ios-home';
          } else if (routeName === 'Profile') {
            iconName = 'person';
          } else if (routeName === 'Upload') {
            iconName = 'ios-add-circle';
          } else if (routeName === 'Likes') {
            iconName = 'ios-heart';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={28} style={{color: focused ? '#000' : '#d1cece'}} color={color}/>;
        },
      }),
      tabBarOptions: {
        activeTintColor: '#000',
        inactiveTintColor: '#d1cece',
      },
    },
);

TabNavigator.navigationOptions = ({navigation}) => {
  const {routeName} = navigation.state.routes[navigation.state.index];

  // You can do whatever you like here to pick the title based on the route name
  const headerTitle = routeName;

  return {
    headerTitle,
  };
};

const StackNavigator = createStackNavigator(
    // RouteConfigs
    {
      Home: {
        screen: TabNavigator,
        navigationOptions: {
          headerMode: 'none', // this will hide the header
          headerLeft: ()=>{}, // this will hide back button
        },
      },
      Search: {
        screen: Search,
      },
      Post: {
        screen: Post,
      },
      MyFiles: {
        screen: MyFiles,
      },
      Modify: {
        screen: Modify,
      },
      Logout: {
        screen: Login,
      },
    },
);

const Navigator = createSwitchNavigator(
    {
      AuthLoading: AuthLoading,
      App: StackNavigator,
      Auth: Login,
    },
    {
      initialRouteName: 'AuthLoading',
    },
);

export default createAppContainer(Navigator);
