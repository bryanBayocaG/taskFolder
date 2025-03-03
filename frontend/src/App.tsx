import Navbar from "./components/Navbar"
import Home from "./pages/Home";
import MineTask from "./pages/MineTask";
import Alert from "./components/Alert";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import AuthRoute from "./components/AuthRoute";
import NotFoundPage from "./pages/NotFoundPage";
import Myboards from "./pages/Myboards";


function App() {
  return (
    <>
      <BrowserRouter>
        <div className="h-screen w-full">
          <Navbar />
          <Alert />
          <Routes>
            <Route path="/" element={<AuthRoute element={<Home />} />} />
            <Route path="/myboard" element={<Myboards />}></Route>
            <Route path="/mytask/:name/:id" element={<MineTask />}></Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>

    </>
  )
}

export default App
