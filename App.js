import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import * as SQLite from "expo-sqlite";
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

import DictsScreen from './components/dicts_screen';
import DictInfoScreen from './components/dict_info_screen';
import SearchScreen from './components/search_screen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [ dicts, setDicts ] = useState([]);
  const [word, setWord] = useState("")
  const [ db, setDb ] = useState({
    transaction: () => {
      return {
        executeSql: () => {},
      };
  }});

  const updateDictsFromArray = (a) => {
    // a = [{rowid, ...}, ...]
    setDicts(
      Object.fromEntries(a.map(({rowid, ...rest}) => [rowid, {...dicts[rowid], ...rest}]))
    );
  };

  const updateDictsFromObject = (o, fieldName) => {
    // o = {rowid: value, ...}
    setDicts(
      Object.fromEntries(
        Object.entries(o).map(([rowid, value]) => [rowid, {...dicts[rowid], [fieldName]: value}])
      )
    );
  }

  const fetchDicts = (callback) => {
    // retrieve dictionaries and their data from database
    db.transaction((tx) => {
      tx.executeSql(
        `select rowid, * from dicts;`,
        [],
        (_, { rows: { _array } }) => { updateDictsFromArray(_array); callback ? callback() : null; }
      );
    });
  };

  const switchDict = (rowid) => {
    // update database to mark dictionary as switched on or off
    db.transaction((tx) => {
      tx.executeSql(
        `update dicts set selected = ? where rowid = ?;`,
        [!dicts[rowid].selected, rowid],
        fetchDicts()
      );
    });
  }
  
  useEffect(() => {
    openDatabase().then((value) => {
      setDb(value);
    });
  }, []);
  
  useEffect(() => {
    fetchDicts(() => {setWord("ka")});
  }, [db]);

  const updateWordInclusion = (a, length) => {
    // callback to query that runs when the search word is updated. 
    // this is used to update the screen that shows word inclusion in each dictionary
    if (length) {
      let {word, ...rest} = a[0]; 
      updateDictsFromObject(rest, 'includesWord'); 
    } else {
      let rest = Object.entries(dicts).map(([rowid]) => { return {rowid, includesWord: false}});
      updateDictsFromArray(rest);
    }
  }

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from words where word = ?`,
        [word],
        (_, { rows: { _array, length } }) => { updateWordInclusion(_array, length) }
      );
    });
  }, [word])
  
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = route.name === "Word Search Tab" ? "search" : "book"

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Word Search Tab" options={{headerShown: false, title: "Word Search"}}>
          {() => <Stack.Navigator>
              <Stack.Screen name="Word Search">
                {(props) => <SearchScreen {...{...props, dicts, word, setWord}} />} 
              </Stack.Screen>
            </Stack.Navigator>}
        </Tab.Screen>

        <Tab.Screen name="Dictionaries Tab" options={{headerShown: false, title: "Dictionaries" }}>
          {() => <Stack.Navigator>
            <Stack.Screen name="Dictionaries">
              {(props) => <DictsScreen {...{...props, dicts, switchDict}} />} 
            </Stack.Screen>
            <Stack.Screen name="DictInfoScreen" options={{ title: '' }}>
              {(props) => <DictInfoScreen {...{...props, dicts, switchDict }}></DictInfoScreen>}
            </Stack.Screen>
          </Stack.Navigator>}
        </Tab.Screen>

      </Tab.Navigator>
    </NavigationContainer>
  );
}

async function openDatabase() {
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }
  await FileSystem.downloadAsync(
    Asset.fromModule(require('./assets/banana-dict.db')).uri,
    FileSystem.documentDirectory + 'SQLite/banana-dict.db'
  );
  return SQLite.openDatabase('banana-dict.db');
}