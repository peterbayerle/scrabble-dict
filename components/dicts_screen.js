import { useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Icon } from 'react-native-elements';

export default function DictsScreen({ dicts, navigation }) {
  const [ pressed, setPressed ] = useState(
    Object.fromEntries(
      Object.entries(dicts).map(([id, {name}]) => [ name, false ])
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
        Object.entries(dicts).map((d, i) => {
          const [id, {name, description}] = d;
          return (
            <Pressable 
              key={i} 
              onPressIn={() => {handlePress(name, true) }}
              onPressOut={() => {handlePress(name, false); navigation.navigate('DictInfoScreen', {id}) } }
            >
              <Card 
                key={i}
                containerStyle={{...styles.cardContainer, backgroundColor: pressed[name] ? "#cccccc" : "white"}} 
                inputContainerStyle={styles.cardInputContainer}  
              >
                <View style={styles.row}>
                  <View style={styles.textColumn}>
                    <Card.Title h3 numberOfLines={1} ellipsizeMode='tail' style={styles.cardTitle}>{ name }</Card.Title>
                    <Text style={styles.cardDescription}>{ description }</Text>
                  </View>
                  <View style={styles.chevronColumn}>
                    <Icon name='chevron-right' />
                  </View>
                </View>
                
              </Card>
            </Pressable>
          )}
        )
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