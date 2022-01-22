import { useState, useEffect } from 'react';
import { openDatabase, Connection } from './model';

let groupBy = (x,f)=>x.reduce((a,b)=>((a[f(b)]||=[]).push(b),a), []);

export default DatabaseContainer = ({ routes }) => {
  const [ dicts, setDicts ] = useState({});
  const [word, setWord] = useState('');
  const [ conn, setConn ] = useState({
    fetchDicts: () => {},
    switchDict: () => {},
    fetchWordInclusion: () => {},
  });

  updateFromArray = (a) => {
    // helper function to parse database results and update dicts state
    // a = [{dictid, ...}, ...]
    let newDicts = {...dicts}
    for (let {dictid, ...rest} of a) {
      newDicts[dictid] = {...newDicts[dictid], ...rest}
    }
    setDicts(newDicts);
  };
  
  const switchDict = (dictid) => conn.switchDict(
    dictid, 
    !dicts[dictid].selected, 
    () => {
      conn.fetchDicts((_array) => { 
        updateFromArray(_array);
      });
    },
  ); 

  useEffect(() =>
    // on component mount, open database
    openDatabase().then((db) => {
      setConn(new Connection(db));
    }), []);
  
  useEffect(() => 
    // on database loaded, fetch dicts from database 
    conn.fetchDicts((_array) => { 
      updateFromArray(_array);
      setWord('ka'); 
    }), [conn]);

  useEffect(() =>
    conn.fetchWordInclusion(
      word, 
      (_array) => {
        updateFromArray(_array);
        conn.fetchDefinitions(word, (_array) => {
          let groupedWords = groupBy(_array, x => x.dictid);
          let a = Object.entries(groupedWords).map(([dictid, words]) => {
              return {dictid, words} 
          });
          updateFromArray(a);
        });
      }
    ), [word]
  );

  return (
    <>
      { routes({dicts, word, setWord, switchDict}) }
    </>
  );
};
