import { useState, useEffect } from 'react';
import { openDatabase, Connection } from './model';

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
    setDicts(Object.fromEntries(a.map(({dictid, ...rest}) => 
      [dictid, {...dicts[dictid], ...rest}]
    )));
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
        conn.fetchDefinitions(word, updateFromArray);
      }
    ), [word]
  );

  return (
    <>
      { routes({dicts, word, setWord, switchDict}) }
    </>
  );
};
