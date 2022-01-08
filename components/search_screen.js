import { View } from 'react-native';
import { SearchBar, Text } from 'react-native-elements';
import { useState } from 'react';


export default function SearchScreen(props) {
    const [search, setSearch] = useState("")
    const [word, setWord] = useState("")
  
    const updateSearch = (search) => {
      setSearch(search)
      setWord(search);
    };
  
    const wordInDict = (word, dictWords) => {
      let b = dictWords.includes(word.toLowerCase())
      return b ? "Yes" : "No"
    }
  
    const displayWord = () => {
      if (!word) {
        setWord("ka");
      }
      return word;
    }
  
    return (
      
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{flex: 1, marginVertical: 50 }}> 
          <Text h1 style={{textTransform: "capitalize"}}>{displayWord()}</Text>
          { Object.entries(props.dict).map(([dictName, {words: dictWords}], i) => 
            props.selectedDicts[dictName] 
                ? <Text key={i}> { `${dictName}: ${wordInDict(word, dictWords)}` } </Text>
                : null
          )}
        </View>
        
        <View style={{flex: 10, alignItems: 'center'}}>
          <SearchBar
            placeholder="Enter word"
            onChangeText={updateSearch}
            value={search}
            platform="ios"
            returnKeyType="search"
            containerStyle={{ 
              backgroundColor: "rgba(0,0,0,0)",
              width: "90%",
            }}
          />
        </View>
      </View>
    );
  }