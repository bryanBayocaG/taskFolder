import Navbar from "./components/Navbar"
import Home from "./pages/Home";
import MineTask from "./pages/MineTask";
import Alert from "./components/Alert";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Alert />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/mytask" element={<MineTask />}></Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
