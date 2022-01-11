import { View, StyleSheet } from 'react-native';
import { Text, Card, Switch } from 'react-native-elements';

export default function DictInfoScreen({ route, dicts, switchDict, forceUpdateId }) {
  const { id } = route.params;
  const { name, selected, description } = dicts[id]
  return (
    <View>
      <Card 
        containerStyle={styles.cardContainer}
        inputContainerStyle={styles.cardInputContainer} 
      >
        <View style={styles.row}>
          <View style={styles.column}>
            <Card.Title h3 style={styles.cardTitle}>{ name }</Card.Title>
            <Text style={styles.cardDescription}>{ description }</Text>  
          </View>
          <View style={styles.switchColumn}>
            <Switch
              style={styles.switch}
              value={ selected == 1 }
              onChange={() => switchDict(id)}
            />
          </View>
        </View>
      </Card>
    </View>
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