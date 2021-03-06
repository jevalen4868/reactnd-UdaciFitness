import React from 'react'
import { StatusBar, View } from 'react-native';
import AddEntry from "./components/AddEntry";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from './reducers'
import History from "./components/History";
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createStackNavigator,
  createDrawerNavigator,
} from "react-navigation";
import { purple, white } from './utils/colors'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { isAndroid, isIos } from './utils/helpers'
import { Constants } from 'expo'
import EntryDetail from './components/EntryDetail'
import Live from "./components/Live";

const UdaciStatusBar = ({ backgroundColor, ...props }) => (
  <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props}/>
  </View>
)

const RouteConfigs = {
  History: {
    screen: History,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'History',
      tabBarIcon: ({ tintColor }) => <Ionicons name='ios-bookmarks' size={30} color={tintColor}/>
    })
  },
  AddEntry: {
    screen: AddEntry,
    navigationOptions: () => ({
      headerTitle: 'Add Entry',
      tabBarIcon: ({ tintColor }) => <FontAwesome name='plus-square' size={30} color={tintColor}/>
    })
  },
  Live: {
    screen: Live,
    navigationOptions: {
      tabBarLabel: 'Live',
      tabBarIcon: ({ tintColor }) => <Ionicons name='ios-speedometer' size={30} color={tintColor}/>
    }
  }
}

const tabNavigatorConfigIos = {
  tabBarOptions: {
    showIcon: true,
    showLabel: true,
    activeTintColor: purple,
    tabStyle: {
      backgroundColor: white,
      height: 56,
    }
  }
}

const tabNavigatorConfigAndroid = {
  tabBarOptions: {
    showIcon: true,
    showLabel: true,
    activeTintColor: white,
    tabStyle: {
      backgroundColor: purple,
      height: 56,
      shadowColor: 'rgba(0,0,0,0.24)',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowRadius: 6,
      shadowOpacity: 1,
      paddingTop: 40,
      paddingBottom: 30,
    }
  }
}

const Tabs = isIos
  ? createBottomTabNavigator(RouteConfigs, tabNavigatorConfigIos)
  : createMaterialTopTabNavigator(RouteConfigs, tabNavigatorConfigAndroid)

const MainNavigation = createStackNavigator({
  Home: {
    screen: Tabs,
    navigationOptions: {
      headerTintColor: white,
      header: null,
    },
  },
  EntryDetail: {
    screen: EntryDetail,
    navigationOptions: {
      headerTintColor: white,
      headerStyle: {
        backgroundColor: purple,
      },
      headerLeft: isAndroid ? null : this.headerLeft,
    },
  }
})

export default class App extends React.Component {
  render() {
    return (
      <Provider
        store={createStore(reducer)}>
        <View style={{ flex: 1 }}>
          <UdaciStatusBar backgroundColor={purple} barStyle={'light-content'}/>
          <MainNavigation/>
        </View>
      </Provider>
    )
  }
}