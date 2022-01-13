import DatabaseContainer from "./src/containers/DatabaseContainer";
import Routes from "./src/routes/Routes.js";

export default function App() {
  return (
    <DatabaseContainer routes={(props) => { 
      return <Routes {...props} /> 
    }} />
  );
};