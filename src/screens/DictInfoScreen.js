import { View } from "react-native";
import { Switch } from "react-native-elements";
import { DictCard } from "../components/DictCard";

export default function DictInfoScreen({ route, dicts, switchDict }) {
  const { id } = route.params;
  const { name, selected, description } = dicts[id];
  const n = dicts[id].numWords;
  
  return (
    <View>
      <DictCard name={name} description={description} subtitle={`${(n ? n : 0).toLocaleString()} words`} backgroundColor="rbga(0, 0, 0, 0.0)">
        <Switch
          value={selected == 1}
          onChange={() => switchDict(id)}
        />
      </DictCard>
    </View>
  );
};