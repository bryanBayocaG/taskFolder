import Navbar from "./components/Navbar"
import Home from "./pages/Home";
import MineTask from "./pages/MineTask";

import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/mytask" element={<MineTask />}></Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
