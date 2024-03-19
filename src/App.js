
import './App.css';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import { BrowserRouter, Routes, Router, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    
    <div className="App">
      <BrowserRouter>
        <Routes> <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
 
      <ToastContainer />
    </div>
  );
}

export default App;
