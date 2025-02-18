import Navbar from "./components/Navbar"
import Home from "./pages/Home";
import MineTask from "./pages/MineTask";
import Alert from "./components/Alert";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import AuthRoute from "./components/AuthRoute";


function App() {
  return (
    <>
      <BrowserRouter>
        <div className="h-screen w-full">
          <Navbar />
          <Alert />
          <Routes>
            <Route path="/" element={<AuthRoute element={<Home />} />} />
            <Route path="/mytask/:uid" element={<MineTask />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/contact" element={<Contact />}></Route>
            <Route path="/services" element={<Services />}></Route>
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>

    </>
  )
}

export default App
