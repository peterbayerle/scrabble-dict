import * as SQLite from "expo-sqlite";
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

export async function openDatabase() {
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }
  await FileSystem.downloadAsync(
    Asset.fromModule(require('../assets/banana-dict.db')).uri,
    FileSystem.documentDirectory + 'SQLite/banana-dict.db'
  );
  return SQLite.openDatabase('banana-dict.db');
};

export const fetchDicts = (db, callback) => { 
  // retrieve dictionaries and their data from database
  db.transaction((tx) => {
    tx.executeSql(
      `select rowid, * from dicts;`,
      [],
      (_, { rows: { _array } }) => { callback(_array); }
    );
  });
};

export const switchDict = (db, rowid, setTo, callback) => {
  // update database to mark dictionary as switched on or off
  db.transaction((tx) => {
    tx.executeSql(
      `update dicts set selected = ? where rowid = ?;`,
      [setTo, rowid],
      (_, { rows: { _array } }) => { callback(_array); }
    );
  });
};

export const fetchWordInclusion = (db, word, callback) => { 
  db.transaction((tx) => {
    tx.executeSql(
      `select * from words where word = ?`,
      [word],
      (_, { rows: { _array } }) => { callback(_array); },
    );
  });
};

export const updateDictsFromArray = (dicts, a) => {
  // helper function to parse database results and update dicts state
  // a = [{rowid, ...}, ...]
  return Object.fromEntries(a.map(({rowid, ...rest}) => 
    [rowid, {...dicts[rowid], ...rest}]
  ));
};

export const updateDictsFromObject = (dicts, o, fieldName) => {
  // helper function to parse database results and update dicts state
  // o = {rowid: value, ...}
  return Object.fromEntries(
    Object.entries(o).map(([rowid, value]) => 
      [rowid, {...dicts[rowid], [fieldName]: value}]
    )
  );
};