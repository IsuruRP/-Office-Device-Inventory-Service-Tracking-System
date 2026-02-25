import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DevicesIcon from '@mui/icons-material/Devices';

function Navbar() {
    return (
        <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)', bgcolor: 'white', color: 'text.primary' }}>
            <Toolbar>
                <DevicesIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                    Office Device Inventory
                </Typography>
                <Box>
                    <Button component={RouterLink} to="/" color="inherit">
                        Inventory
                    </Button>
                    <Button component={RouterLink} to="/add" variant="contained" sx={{ ml: 2 }}>
                        Add Device
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
