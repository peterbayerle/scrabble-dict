import { View, StyleSheet } from "react-native";
import { Text, Card } from "react-native-elements";

export const DictCard = ({ name, description, backgroundColor = "white", children }) => (
  <Card 
    containerStyle={{...styles.cardContainer, backgroundColor}}
    inputContainerStyle={styles.cardInputContainer} 
  >
    <View style={styles.row}>
    <View style={styles.column}>
      <Card.Title h3 style={styles.cardTitle}>{ name }</Card.Title>
      <Text style={styles.cardDescription}>{ description }</Text>  
    </View>
    <View style={styles.childColumn}>
      { children }
    </View>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10, 
    borderWidth: 0, 
    shadowColor: "rgba(0,0,0, 0.0)",
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

  childColumn: {
    flexDirection: "column", 
    justifyContent: "center", 
    alignItems: "center"
  },
});