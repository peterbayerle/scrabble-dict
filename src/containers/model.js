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

export class Connection {
  constructor(db) {
    this.db = db;
  };

  fetchDicts = (callback) => {
    this.db.transaction((tx) => {
      tx.executeSql(
        `select rowid, * from dicts;`,
        [],
        (_, { rows: { _array } }) => { callback(_array); }
      );
    });
  };

  switchDict = (rowid, setTo, callback) => {
    // update database to mark dictionary as switched on or off
    this.db.transaction((tx) => {
      tx.executeSql(
        `update dicts set selected = ? where rowid = ?;`,
        [setTo, rowid],
        (_, { rows: { _array } }) => { callback(_array); }
      );
    });
  };
  
  fetchWordInclusion = (word, callback) => { 
    this.db.transaction((tx) => {
      tx.executeSql(
        `select * from words where word = ?`,
        [word],
        (_, { rows: { _array } }) => { callback(_array); }
      );
    });
  };
};

  


