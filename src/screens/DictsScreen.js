import { useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { DictCard } from "../components/DictCard";

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
              <DictCard name={name} description={description} truncateTitle={true} backgroundColor={pressed[name] ? "#cccccc" : "white"}>
                <Icon name='chevron-right' />
              </DictCard>
            </Pressable>
          )}
        )
      }
    </ScrollView>
  );
};