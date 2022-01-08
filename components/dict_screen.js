import { View, Switch} from 'react-native';
import { Text } from 'react-native-elements';

export default function DictScreen(props) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        { Object.entries(props.dict).map(([dictName, {words: dictWords}], i) => {
          return (
            <View key={i} style={{flexDirection: "row", padding: 10}}>
              <Text h3 style={{marginRight: 25}}> { `${dictName}: ` } 
                <Text h4> { dictWords.reduce(
                  (prev, cur) => `${prev}, ${cur}`) } 
                </Text> 
              </Text>
              <Switch
                value={props.selectedDicts[dictName]}
                onChange={() => props.switchDict(dictName)}
              />
            </View>
          )})}
      </View>
    );
  }