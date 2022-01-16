import { View, ScrollView } from 'react-native';
import { DictCard } from "../components/DictCard";

export const WordInfoScreen = ({word, dicts}) => {
  return (
    <ScrollView>
      {
        Object.entries(dicts)
          .filter(([_, {selected, definition}]) => selected && definition !== null)
          .map((d, idx) => {
            const [id, {name, definition}] = d;
            return (
              <View 
                key={id}
                style={{marginTop: idx > 0 ? '-5%' : null}}
              >
                <DictCard 
                  name={name} 
                  description={`${word} | ${definition}`} 
                  truncateTitle={false} 
                  backgroundColor="rbga(0, 0, 0, 0.0)"
                />
              </View>
            )}
        )
      }
    </ScrollView>
  );
}