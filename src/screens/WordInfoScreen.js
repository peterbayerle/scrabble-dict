import { View, ScrollView, StyleSheet } from 'react-native';
import { DictCard } from '../components/DictCard';
import { Text } from 'react-native-elements';

export const WordInfoScreen = ({word, dicts}) => {
  let description = (filteredWords) => (
    <View>
     { filteredWords.map(({word_friendly, pos_friendly, definition_friendly}, idx) => 
        <Text style={styles.wordBlock} key={idx}>
          <Text style={styles.word}>{word_friendly}</Text>
          <Text style={styles.dot}> • </Text>
          <Text style={styles.pos}>{pos_friendly.replaceAll('_', ' ')  + '\n'}</Text>
          <Text>{definition_friendly}</Text>
        </Text>
      )}
    </View>
  );

  return (
    <ScrollView>
      {
        Object.entries(dicts)
          .filter(([_, {selected, words, includesWord}]) => selected && words && includesWord)
          .map(([_, {name, words}], idx) => {
            return (
              <View 
                key={idx}
                style={{marginTop: idx > 0 ? '-5%' : null}}
              >
                <DictCard 
                  name={name} 
                  description={
                    (w = words.filter(({definition_friendly}) => definition_friendly)).length > 0
                    ? description(w)
                    : <Text>No definition provided</Text>
                  } 
                  truncateTitle={false} 
                  backgroundColor="rbga(0, 0, 0, 0.0)"
                />
              </View>
            )}
        )
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wordBlock: {
    marginTop: '3%',
    fontSize: 17
  },

  word: {
    fontWeight: '700',
  },

  dot: {
    fontWeight: '500'
  },
  
  pos: {
    fontStyle: 'italic',
    fontWeight: '300'
  }
})