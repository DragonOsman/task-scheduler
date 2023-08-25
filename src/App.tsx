import "./App.css";
import Home from "./components/Home";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route element={<Home />} path="/" />
      </Routes>
    </>
  );
}

export default App;
