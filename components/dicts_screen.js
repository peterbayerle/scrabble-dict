import { useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Icon } from 'react-native-elements';

export default function DictsScreen({ dict, navigation }) {
  const [ pressed, setPressed ] = useState(
    Object.fromEntries(
      Object.entries(dict)
      .map(([ key ]) => [ key, false ])
    )
  );

  const handlePress = (d, b) => {
    setPressed(prevState => {
      return {...prevState, [d]: b}
    });
  }

  return (
    <ScrollView>
      {
        Object.entries(dict).map(([dictName, {description: description}], i) => (
            <Pressable 
              key={i} 
              onPressIn={() => { handlePress(dictName, true) }}
              onPressOut={() => {handlePress(dictName, false); navigation.navigate('DictInfoScreen', { dictName, description }) } }
            >
              <Card 
                key={i}
                containerStyle={{...styles.cardContainer, backgroundColor: pressed[dictName] ? "#cccccc" : "white"}} 
                inputContainerStyle={styles.cardInputContainer}  
              >
                <View style={styles.row}>
                  <View style={styles.textColumn}>
                    <Card.Title h3 numberOfLines={1} ellipsizeMode='tail' style={styles.cardTitle}>{ dictName }</Card.Title>
                    <Text style={styles.cardDescription}>{ description }</Text>
                  </View>
                  <View style={styles.chevronColumn}>
                    <Icon name='chevron-right' />
                  </View>
                </View>
                
              </Card>
            </Pressable>
        ))
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10, 
    borderWidth: 0, 
    shadowColor: 'rgba(0,0,0, 0.0)',
  },

  cardInputContainer: {
    borderBottomWidth: 0,
  },
  
  row: {
    flexDirection: "row"
  },

  textColumn: {
    flexDirection: "column", flex: 1
  },

  cardTitle: {
    textAlign: "left",
    marginRight: "5%"
  },

  cardDescription: {
    textAlign: "left", 
    marginRight: "20%"
  },

  chevronColumn: {
    flexDirection: "column", 
    justifyContent: 'center', 
    alignItems: 'center'
  }

});