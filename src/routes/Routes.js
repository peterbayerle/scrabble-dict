import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import DictsScreen from '../screens/DictsScreen';
import DictInfoScreen from '../screens/DictInfoScreen';
import SearchScreen from '../screens/SearchScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

let screenOptions = ({ route }) => ({
  tabBarIcon: ({ color, size }) => {
    let iconName = route.name === 'Word Search Tab' ? 'search' : 'book'

    return <Ionicons name={iconName} size={size} color={color} />;
  },
});

export default Routes = (p) => (
    <NavigationContainer>
    <Tab.Navigator
      screenOptions={screenOptions}
    >
      <Tab.Screen name="Word Search Tab" options={{ headerShown: false, title: 'Word Search'}}>
        {() => <Stack.Navigator>
            <Stack.Screen name="Word Search">
              {(props) => <SearchScreen {...props} {...p} />} 
            </Stack.Screen>
          </Stack.Navigator>}
      </Tab.Screen>

      <Tab.Screen name="Dictionaries Tab" options={{ headerShown: false, title: 'Dictionaries' }}>
        {() => <Stack.Navigator>
          <Stack.Screen name="Dictionaries">
            {(props) => <DictsScreen {...props} {...p} />} 
          </Stack.Screen>
          <Stack.Screen name="DictInfoScreen" options={{ title: '' }}>
            {(props) => <DictInfoScreen {...props} {...p} />}
          </Stack.Screen>
        </Stack.Navigator>}
      </Tab.Screen>

    </Tab.Navigator>
  </NavigationContainer>
);