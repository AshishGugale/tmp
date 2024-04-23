import "./App.css";
import Homepage from "./pages/Homepage";
import { Route, Routes } from "react-router-dom";


function App() {
  return (
    <DataContext.Provider value = {data}>
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </DataContext.Provider>
  );
}

export default App;
