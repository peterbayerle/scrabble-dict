import { View, StyleSheet, KeyboardAvoidingView, FlatList } from 'react-native';
import { SearchBar, Text, Card } from 'react-native-elements';
import { useState } from 'react';
import { useHeaderHeight } from '@react-navigation/elements';


export default function SearchScreen({ dict, selectedDicts }) {
	const [search, setSearch] = useState("")
	const [word, setWord] = useState("")
	const headerHeight = useHeaderHeight();

	const wordInDict = (word, dictWords) => {
		return dictWords.includes(word.toLowerCase())
	}

	const displayWord = () => {
		if (!word) {
			setWord("ka");
		}
		return word;
	}

	return (
		
		<View style={ styles.searchView }>
      <View style={styles.cardView}>
        <Card containerStyle={ styles.wordCard }>
          <Card.Title h1 numberOfLines={1} ellipsizeMode='tail' style={ styles.wordCardTitle }>{ displayWord() }</Card.Title >
          <Card.Divider />
          <FlatList
            style={styles.flatList}
            data={Object.entries(dict)}
            keyExtractor={ (index) => index }
            renderItem={({ item }) => {
              const [dictName, {words: dictWords}] = item;
              return (
                selectedDicts[dictName] 
                ? <View style={styles.row}>
                    <View style={styles.column}>
                      <Text h5 numberOfLines={1} ellipsizeMode='tail' style={{textAlign: "right"}}> { dictName } </Text>
                    </View>
                    <View style={styles.column}>
                      <Text h4 style={{color: wordInDict(word, dictWords) ? "#18a558" : "#e43d40", marginLeft: '10%'}}>
                        { wordInDict(word, dictWords) ? "Yes" : "No" }  
                      </Text>
                    </View>
                  </View>
                : null 
              )}}/>
        </Card> 
      </View>
			
			<KeyboardAvoidingView 
				keyboardVerticalOffset={headerHeight}
				behavior={"padding"} 
				style={ styles.searchBarView }
			>
				<SearchBar
					placeholder="Enter word"
					onChangeText={(text) => { setSearch(text) }}
					onSubmitEditing={() => { setWord(search) } }
					value={search}
					platform="ios"
					returnKeyType="search"
					containerStyle={ styles.searchBar }
          autoCorrect={false}
				/>
			</KeyboardAvoidingView>
		</View>
	);
}

const styles = StyleSheet.create({
  searchView: {
    flexDirection: 'column', 
    flexGrow: 1, 	
    justifyContent: "space-between"
  },

  row: {
    flexDirection: "row",
  },

 column: {
    flexDirection: "column", 
    flex: 1,
    justifyContent: 'center', 
  },

  flatList: {
    maxHeight: "75%"
  },

	wordCard: {
		borderRadius: 10, 
		borderWidth: 0, 
		width: "92.5%",
		shadowColor: 'rgba(0,0,0, 0.0)',
	},

  cardView: {
    flex: 1, 
    maxHeight:"50%"
  },

	wordCardTitle: {
		textTransform: "lowercase", 
		textAlign: "left",
    marginLeft: "2%"
	},

	searchBarView: {
		alignItems: 'center',
	},

	searchBar: {
		backgroundColor: "rgba(0,0,0,0)",
		width: "97%",
	}
});