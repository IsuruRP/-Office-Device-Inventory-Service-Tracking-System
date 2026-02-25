import { Routes, Route } from 'react-router-dom'
import { Container } from '@mui/material'
import Navbar from './components/Navbar'
import DeviceList from './pages/DeviceList'
import DeviceForm from './pages/DeviceForm'

function App() {
    return (
        <>
            <Navbar />
            <Container sx={{ mt: 4, mb: 4 }}>
                <Routes>
                    <Route path="/" element={<DeviceList />} />
                    <Route path="/add" element={<DeviceForm />} />
                    <Route path="/edit/:id" element={<DeviceForm />} />
                </Routes>
            </Container>
        </>
    )
}

export default App
