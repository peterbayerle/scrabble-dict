import DatabaseContainer from "./src/containers/DatabaseContainer";
import Routes from "./src/routes/Routes.js";
import { StatusBar } from "react-native";

export default function App() {
  return (
    <DatabaseContainer routes={(props) => { 
      return (
        <>
          <StatusBar
            barStyle="dark-content"
            hidden={true}
          />
          <Routes {...props} />
        </>
      ) 
    }} />
  );
};