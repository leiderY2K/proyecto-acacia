// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import SideNavbar from './components/SideNavbar';
import ProyectosList from './components/ProyectosList';
import InvestigadoresList from './components/InvestigadoresList';
import HomePage from './components/HomePage';
import InvestigadoresForm from './components/InvestigadorForm';
import ProyectosForm from './components/ProyectoForm';
import EstadisticasDashboard from './components/EstadisticasDashboard';
import LoginView from './components/LoginView';
import MenuPrincipal from './components/MenuPrincipal';
import PrivateRoute from './components/PrivateRoute';

const drawerWidth = 340;

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <SideNavbar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginView />} />
            
            {/* Rutas públicas */}
            <Route path="/proyectos" element={<ProyectosList />} />
            <Route path="/investigadores" element={<InvestigadoresList />} />
            <Route path="/estadisticas" element={<EstadisticasDashboard />} />

            {/* Rutas protegidas */}
            <Route path="/reg-investigador" element={
                //<PrivateRoute>
                  <InvestigadoresForm />
                //</PrivateRoute>
              }
            />
            <Route
              path="/menu"
              element={
                //<PrivateRoute>
                  <MenuPrincipal />
                //</PrivateRoute>
              }
            />
            <Route
              path="/reg-proyecto"
              element={
                //<PrivateRoute>
                  <ProyectosForm />
                //</PrivateRoute>
              }
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
