import { View, StyleSheet, KeyboardAvoidingView, FlatList } from 'react-native';
import { SearchBar, Text, Card, Button } from 'react-native-elements';
import { useState } from 'react';
import { useHeaderHeight } from '@react-navigation/elements';

export const SearchScreen = ({ dicts, word, setWord, navigation }) => {
	const [search, setSearch] = useState('')
	const headerHeight = useHeaderHeight();

  let wordInAtLeastOneDict = () => {
    return Object.entries(dicts).map(([_, {includesWord}]) => includesWord).some(x => x)
  }

  let titleAndDefineButton = () => (
    <View style={styles.titleRow}>
    <Text h1 numberOfLines={1} ellipsizeMode='tail' style={styles.wordCardTitle}>
      { word }
    </Text >
    { wordInAtLeastOneDict()
      ? <View style={styles.defineColumn} >
          <Button 
            title="Define" icon={{name: 'chevron-right', color: '#007AFF'}}
            onPress={() => navigation.navigate('WordInfoScreen', {word, dicts})}
            iconRight 
            buttonStyle={{backgroundColor: 'rgba(0, 0, 0, 0)', borderRadius: 3 }} 
            titleStyle={{ color: '#007AFF', fontSize: 16 }}>
          </Button>
        </View>
      : null
    }
    </View>

    
  );

  let dictsList = () => (
    <FlatList
      style={styles.flatList}
      keyExtractor={(_, index) => index}
      data={Object.entries(dicts).filter(([_, {selected}]) => selected)}
      renderItem={({item: [_, {name, includesWord}]}) => {
        return (
          <View style={styles.row}>
            <View style={styles.column}>
              <Text h5 numberOfLines={1} ellipsizeMode="tail" style={{textAlign: 'right'}}>{ name }</Text>
            </View>
            <View style={styles.column}>
              <Text h4 style={{color: includesWord ? '#18a558' : '#e43d40', marginLeft: '10%'}}>
                { includesWord ? 'Yes' : 'No' }  
              </Text>
            </View> 
          </View>
        )}}
    />
  );

  let searchBar = () => (
    <KeyboardAvoidingView 
      keyboardVerticalOffset={headerHeight}
      behavior="padding"
      style={ styles.searchBarView }
		>
      <SearchBar
        placeholder="Enter word"
        onChangeText={(text) => { setSearch(text.replace(/ +/g, '')) }}
        onSubmitEditing={() => { search ? setWord(search) : null; } }
        value={search}
        platform="ios"
        returnKeyType="search"
        containerStyle={ styles.searchBar }
        autoCorrect={false}
      />
		</KeyboardAvoidingView>
  );

	return (
		<View style={ styles.searchView }>
      <View style={styles.cardView}>
        <Card containerStyle={ styles.wordCard }>
          { titleAndDefineButton() }
          <Card.Divider />
          { dictsList() }
        </Card> 
      </View>
			{ searchBar() }
		</View>
	);
};

const styles = StyleSheet.create({
  searchView: {
    flexDirection: 'column', 
    flexGrow: 1, 	
    justifyContent: 'space-between'
  },

  row: {
    flexDirection: 'row',
  },

  titleRow: { 
    flexDirection: 'row',
    marginBottom:'3%'
  },

 column: {
    flexDirection: 'column', 
    flex: 1,
    justifyContent: 'center', 
  },

  defineColumn: {
    flexDirection:'row', 
    alignItems: 'center', 
    justifyContent: 'center'
  },

  flatList: {
    maxHeight: '75%'
  },

	wordCard: {
		borderRadius: 10, 
		borderWidth: 0, 
		width: '92.5%',
		shadowColor: 'rgba(0,0,0, 0.0)',
	},

  cardView: {
    flex: 1, 
    maxHeight:'50%'
  },

	wordCardTitle: {
    marginLeft: '2%',
    fontWeight: 'bold', 
    flex: 1, 
    textTransform: 'lowercase', 
    textAlign: 'left'
	},

	searchBarView: {
		alignItems: 'center',
	},

	searchBar: {
		backgroundColor: 'rgba(0,0,0,0)',
		width: '97%',
	}
});