import { useState, useEffect } from 'react';
import { openDatabase, Connection } from './model';

export default DatabaseContainer = ({ routes }) => {
  const [ dicts, setDicts ] = useState({});
  const [word, setWord] = useState("");
  const [ conn, setConn ] = useState({
    fetchDicts: () => {},
    switchDict: () => {},
    fetchWordInclusion: () => {},
  });

  updateFromArray = (a) => {
    // helper function to parse database results and update dicts state
    // a = [{rowid, ...}, ...]
    setDicts({...dicts, ...Object.fromEntries(a.map(({rowid, ...rest}) => 
      [rowid, {...dicts[rowid], ...rest}]
    ))});
  };
  
  const switchDict = (rowid) => { 
    conn.switchDict(
      rowid, 
      !dicts[rowid].selected,
      () => {
        conn.fetchDicts((_array) => { 
          updateFromArray(_array);
        });
      },
    ); 
  };

  useEffect(() => {
    // on component mount, open database
    openDatabase().then((db) => {
      setConn(new Connection(db));
    });
  }, []);
  
  useEffect(() => {
    // on database loaded, fetch dicts from database 
    conn.fetchDicts((_array) => { 
      updateFromArray(_array);
      setWord("ka"); 
    });
  }, [conn]);

  useEffect(() => {
    conn.fetchWordInclusion(word, (_array) => {
      let [{word, ...rest}] = _array.length > 0 ? _array : [{word: null}]
      updateFromArray(Object.entries(dicts).map(([rowid]) => {
        return {rowid, ...dicts[rowid], includesWord: word !== null ? rest[rowid] : false}
      }));
    })
  }, [word]);

  return (
    <>
      { routes({dicts, word, setWord, switchDict}) }
    </>
  );
};
