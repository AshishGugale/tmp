import "./App.css";
import { createContext } from "react";
import Homepage from "./pages/Homepage";
import { Route, Routes } from "react-router-dom";

function App() {
  const DataContext = createContext();
  const [data, setData] = useState(null);
  
  return (
    <DataContext.Provider value = {data}>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* <Route path="/addlisting" element={ </>} /> */}
      </Routes>
    </DataContext.Provider>
  );
}

export default App;
