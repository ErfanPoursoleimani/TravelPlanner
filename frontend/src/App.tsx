import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
// import { NotFound } from './pages/NotFound';
import Navbar from './components/Nav/Navbar';
import MobileNavbar from './components/Nav/MobileNavbar';
import Destinations from './pages/Destinations';
import Map from './pages/Map';
import Itineraries from './pages/Itineraries';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';

function App() {
  // return <div>Hello Vite!</div>;
  return (
    <Router>
      <div className="bg-gray-50 select-none">
        <Navbar />
        <main className="relative">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/itineraries"
              element={
                <ProtectedRoute>
                  <Itineraries />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/map" element={<Map />} />
          </Routes>
        </main>
        <MobileNavbar />
        <div className='h-20 md:hidden'></div>
      </div>
    </Router>
  );
}

export default App;