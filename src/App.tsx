import Navbar from "./components/Navbar"
import Home from "./pages/Home";
import MineTask from "./pages/MineTask";
import Alert from "./components/Alert";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";


function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Alert />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/mytask" element={<MineTask />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/services" element={<Services />}></Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
