import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import DictsScreen from './components/dicts_screen';
import DictInfoScreen from './components/dict_info_screen';
import SearchScreen from './components/search_screen';
import dict from "./dictionary.json";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [ selectedDicts, setSelectedDicts ] = useState(
    Object.fromEntries(
      Object.entries(dict)
      .map(([ key ]) => [ key, true ])
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
            let iconName = route.name === "Word Search Tab" ? "search" : "book"

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Word Search Tab" options={{headerShown: false, title: "Word Search"}}>
          {() => <Stack.Navigator>
              <Stack.Screen name="Word Search">
                {() => <SearchScreen dict={dict} selectedDicts={selectedDicts} />} 
              </Stack.Screen>
            </Stack.Navigator>}
        </Tab.Screen>

        <Tab.Screen name="Dictionaries Tab" options={{headerShown: false, title: "Dictionaries" }}>
          {() => <Stack.Navigator>
            <Stack.Screen name="Dictionaries">
              {(props) => <DictsScreen {...props} dict={dict} selectedDicts={selectedDicts} switchDict={switchDict}  />} 
            </Stack.Screen>
            <Stack.Screen name="DictInfoScreen" options={{ title: '' }}>
              {(props) => <DictInfoScreen {...{...props, selectedDicts, switchDict}}></DictInfoScreen>}
            </Stack.Screen>
          </Stack.Navigator>}
        </Tab.Screen>

      </Tab.Navigator>
    </NavigationContainer>
  );
}