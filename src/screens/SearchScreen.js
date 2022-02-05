import { View, StyleSheet, KeyboardAvoidingView, ScrollView, ActivityIndicator } from 'react-native';
import { SearchBar, Text, Card, Button } from 'react-native-elements';
import { useState } from 'react';
import { useHeaderHeight } from '@react-navigation/elements';

export const SearchScreen = ({ dicts, word, setWord, navigation }) => {
	const [search, setSearch] = useState('')
	const headerHeight = useHeaderHeight();

  let wordInAtLeastOneDict = () => {
    return Object.entries(dicts).map(([_, {includesWord}]) => includesWord).some(x => x)
  }

  let TitleAndDefineButton = () => (
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
            buttonStyle={styles.defineButton} 
            titleStyle={styles.defineButtonText}>
          </Button>
        </View>
      : null
    }
    </View>
  );

  let DictsList = () => (
    <ScrollView contentContainerStyle={styles.dictsListScrollView}>
      <View>
        { Object.entries(dicts).filter(([_, {selected}]) => selected).map(([dictid, {name, includesWord}]) => 
          <View key={dictid} style={styles.row}>
            <View style={{...styles.column, ...styles.left}}>
              <Text h5 numberOfLines={1} ellipsizeMode="tail" style={styles.dictName}>{ name }</Text>
            </View>
            <View style={{...styles.column, ...styles.right}}>
              <Text h4 style={{color: includesWord ? '#18a558' : '#e43d40'}}>
                { includesWord ? 'Yes' : 'No' }  
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );

  let WordSearchBar = () => (
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
		<View style={styles.searchView}>
      <View style={styles.cardView}>
        <Card containerStyle={styles.wordCard}>
          <TitleAndDefineButton />
          <Card.Divider />
          <DictsList />
        </Card> 
      </View>
			{ WordSearchBar() }
		</View>
	);
};

const styles = StyleSheet.create({
  searchView: {
    flexDirection: 'column', 
    flexGrow: 1, 	
    justifyContent: 'space-between'
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

  // word + define button
  titleRow: { 
    flexDirection: 'row',
    marginBottom:'3%'
  },

  wordCardTitle: {
    marginLeft: '2%',
    fontWeight: 'bold', 
    flex: 1, 
    textTransform: 'lowercase', 
    textAlign: 'left'
	},

  defineColumn: {
    flexDirection:'row', 
    alignItems: 'center', 
    justifyContent: 'center'
  },

  defineButton: {
    backgroundColor: 'rgba(0, 0, 0, 0)', 
    borderRadius: 3 
  },

  defineButtonText: { 
    color: '#007AFF', 
    fontSize: 17
  },

  // dicts list
  dictsListScrollView: {
    display: 'flex',
    alignItems: 'center'
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  column: {
    flexDirection: 'column', 
  },

  right: {
    minWidth: '10%',
  },

  left: {
    marginRight: '5%',
  },
  
  dictName: {
    textAlign: 'right',
    fontSize: 17,
  },

  // search bar
	searchBarView: {
		alignItems: 'center',
	},

	searchBar: {
		backgroundColor: 'rgba(0,0,0,0)',
		width: '97%',
	},

});