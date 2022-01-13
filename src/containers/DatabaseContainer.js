import { useState, useEffect } from 'react';
import * as dbHelpers from './databaseHelpers';

export default DatabaseContainer = ({ routes }) => {
  const [ dicts, setDicts ] = useState([]);
  const [word, setWord] = useState("")
  const [ db, setDb ] = useState({
    transaction: () => {
      return {
        executeSql: () => {},
      };
  }});

  const updateDictsFromArray = (a) => { setDicts(dbHelpers.updateDictsFromArray(dicts, a)); };
  const updateDictsFromObject = (o, name) => { setDicts(dbHelpers.updateDictsFromObject(dicts, o, name));  };
  
  const switchDict = (rowid) => { 
    dbHelpers.switchDict(
      db, 
      rowid, 
      !dicts[rowid].selected,
      () => {
        dbHelpers.fetchDicts(db, (_array) => { 
          updateDictsFromArray(_array)
        });
      }
    ); 
  };

  useEffect(() => {
    // on component mount, open database
    dbHelpers.openDatabase().then((value) => {
      setDb(value);
    });
  }, []);
  
  useEffect(() => {
    // on database loaded, fetch dicts from database 
    dbHelpers.fetchDicts(db, (_array) => { 
      updateDictsFromArray(_array)
      setWord("ka"); 
    });
  }, [db]);

  useEffect(() => {
    dbHelpers.fetchWordInclusion(db, word, (_array) => {
      if (_array.length) {
        let {word, ...rest} = _array[0];
        updateDictsFromObject(rest, "includesWord")
      } else {
        let rest = Object.entries(dicts).map(([rowid]) => { return {rowid, includesWord: false}});
        updateDictsFromArray(rest)
      }
    })
  }, [word]);

  return (
    <>
      { routes({dicts, word, setWord, switchDict}) }
    </>
  );

};
