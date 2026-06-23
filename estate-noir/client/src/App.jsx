import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EstateDetail from './pages/EstateDetail';
import Portfolio from './pages/Portfolio';
import NewEstate from './pages/NewEstate';
import EditEstate from './pages/EditEstate';
import Account from './pages/Account';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/properties/:id" element={<EstateDetail />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Portfolio />
            </PrivateRoute>
          }
        />
        <Route
          path="/properties/new"
          element={
            <PrivateRoute>
              <NewEstate />
            </PrivateRoute>
          }
        />
        <Route
          path="/properties/:id/edit"
          element={
            <PrivateRoute>
              <EditEstate />
            </PrivateRoute>
          }
        />
        <Route
          path="/account"
          element={
            <PrivateRoute>
              <Account />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
