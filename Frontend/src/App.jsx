import { Routes, Route } from 'react-router-dom'
import { Container } from '@mui/material'
import Navbar from './components/Navbar'
import DeviceList from './pages/DeviceList'
import DeviceForm from './pages/DeviceForm'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'

function App() {
    const { user } = useAuth();

    return (
        <>
            {user && <Navbar />}
            <Container sx={{ mt: 4, mb: 4 }}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/devices" element={
                        <ProtectedRoute>
                            <DeviceList />
                        </ProtectedRoute>
                    } />
                    <Route path="/add" element={
                        <ProtectedRoute>
                            <DeviceForm />
                        </ProtectedRoute>
                    } />
                    <Route path="/edit/:id" element={
                        <ProtectedRoute>
                            <DeviceForm />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Container>
        </>
    )
}

export default App
