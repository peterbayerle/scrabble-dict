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

  fetchDicts = (callback) => {
    // fetch list of dictionaries and their attributes (decription, selected, wordCount)
    this.db.transaction((tx) => {
      tx.executeSql(
        `with word_counts as (
          select dictid, count(*) as wordCount
          from words
          group by dictid
        )
      
        select
          dicts.*,
          word_counts.wordCount
        from dicts 
        join word_counts 
          on dicts.dictid = word_counts.dictid;`,
        [],
        (_, { rows: { _array } }) => { callback(_array) },
      );
    });
  }

  switchDict = (dictid, setto, callback) => {
    // update database to mark dictionary as switched on or off
    this.db.transaction((tx) => {
      tx.executeSql(
        `update dicts 
        set selected = ?
        where dictid = ?;`,
        [setto, dictid],
        callback
      );
    });
  };
  
  fetchWordInclusion = (word, callback) => { 
    this.db.transaction((tx) => {
      tx.executeSql(`
        select dictid,
        (
        select count(*)
        from words
        where
            word = ?
            and words.dictid = dicts.dictid
        ) as includesWord
        from dicts`,
        [word],
        (_, { rows: { _array } }) => { callback(_array); }
      );
    });
  };

  fetchDefinitions = (word, callback) => { 
    this.db.transaction((tx) => {
      tx.executeSql(`
        select dictid,
        (
        select min(definition)
        from words
        where
            word = ?
            and words.dictid = dicts.dictid
        ) as definition
        from dicts`,
        [word],
        (_, { rows: { _array } }) => { callback(_array); }
      );
    });
  };
};

  


