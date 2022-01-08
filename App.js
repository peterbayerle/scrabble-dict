import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DictScreen from './components/dict_screen';
import SearchScreen from './components/search_screen';
import dict from "./dictionary.json"

const Tab = createBottomTabNavigator();

export default function App() {
  const [ selectedDicts, setSelectedDicts ] = useState(
    Object.fromEntries(
      Object.entries(dict)
      .map(([ key, val ]) => [ key, true ])
    )
  );

  const switchDict = (d) => {
    setSelectedDicts(prevState => {
      return {...prevState, [d]: !prevState[d]}
    });
  }
  
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = route.name === "Word Search" ? "search" : "book"

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Word Search"> 
          {() => <SearchScreen dict={dict} selectedDicts={selectedDicts} />} 
        </Tab.Screen>

        <Tab.Screen name="Dictionaries"> 
          {() => <DictScreen dict={dict} selectedDicts={selectedDicts} switchDict={switchDict}  />} 
        </Tab.Screen>

      </Tab.Navigator>
    </NavigationContainer>
  );
}