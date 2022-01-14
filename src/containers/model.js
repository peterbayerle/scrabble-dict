import * as SQLite from 'expo-sqlite';
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

  fetchWordCounts(a, callback) {
    let innerQuery = a.map(({ rowid }) => 
      `select \'${rowid}\' as rowid, count(*) as numWords from words where "${rowid}" = 1`
    ).join(' union ');

    let fullQuery = `select rowid, dicts.*, numwordsInDicts.numWords
      from dicts
      join ( ${innerQuery} ) numWordsInDicts
      on dicts.rowid = numWordsInDicts.rowid`;

    // second, execute the query
    this.db.transaction((tx) => {
      tx.executeSql(
        fullQuery,
        [],
        (_, { rows: { _array: _arrayInner } }) => { callback(_arrayInner); },
        (_, e) => console.log(e)
      );
    });
  }

  fetchDicts = (callback) => {
    this.db.transaction((tx) => {
      tx.executeSql(
        `select rowid, * from dicts;`,
        [],
        (_, { rows: { _array: _arrayOuter } }) => { return this.fetchWordCounts(_arrayOuter, callback) },
      );
    });
  }

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

  


