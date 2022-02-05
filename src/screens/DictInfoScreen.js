import { View, Text, StyleSheet } from "react-native";
import { Switch } from "react-native-elements";
import { DictCard } from "../components/DictCard";

export const DictInfoScreen = ({ route, dicts, switchDict }) => {
  const { id } = route.params;
  const { name, selected, description } = dicts[id];
  const n = dicts[id].wordCount;
  const isNaspaDict = id == 1 || id == 2
  
  return (
    <View style={styles.dictInfoScreen}>
      <DictCard name={name} description={description} subtitle={`${(n || 0).toLocaleString()} words`} backgroundColor="rbga(0, 0, 0, 0.0)">
        <Switch
          value={selected == 1}
          onChange={() => switchDict(id)}
        />
      </DictCard>
      { isNaspaDict && 
        <View style={styles.notice}>
          <Text style={styles.noticeText}>NASPA Word List 2020 Edition © NASPA 2020. The copy included in this app is licensed for personal use. You may not use it for any commercial purposes.</Text> 
        </View> 
      }
    </View>
  );
};

const styles= StyleSheet.create({
  dictInfoScreen: {
    flexGrow: 1, 
    justifyContent: 'space-between'
  },

  notice: {
    padding: '5%'
  },

  noticeText: {
    fontSize: 14, 
    fontWeight: '300'
  }
})