import { View, StyleSheet } from 'react-native';
import { Text, Card, Switch } from 'react-native-elements';


export default function DictInfoScreen({ route, switchDict, selectedDicts }) {
  const { dictName, description } = route.params;
  return (
    <Card 
      containerStyle={styles.cardContainer}
      inputContainerStyle={styles.cardInputContainer}  
    >
      <View style={styles.row}>
        <View style={styles.column}>
          <Card.Title h3 style={styles.cardTitle}>{ dictName }</Card.Title>
          <Text style={styles.cardDescription}>{ description }</Text>  
        </View>
        <View style={styles.switchColumn}>
          <Switch
            style={styles.switch}
            value={selectedDicts[dictName]}
            onChange={() => switchDict(dictName)}
          />
        </View>
      </View>
      
    </Card>
  );
}


const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10, 
    borderWidth: 0, 
    shadowColor: 'rgba(0,0,0, 0.0)',
    backgroundColor: 'rgba(0,0,0, 0.0)'
  },

  cardInputContainer: {
    borderBottomWidth: 0,
  },

  cardTitle: {
    textAlign: "left",
    marginRight: "5%"
  },

  cardDescription: {
    textAlign: "left", 
    marginRight: "20%"
  },

  row: {
    flexDirection: "row",
  },

  column: {
    flexDirection: "column", 
    flex: 1
  },


  switchColumn: {
    flexDirection: "column", 
    justifyContent: 'center', 
    alignItems: 'center'
  },
});