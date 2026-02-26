import { useState, useEffect } from 'react';
import {
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Chip,
    Box,
    TextField,
    InputAdornment
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { getDevices, deleteDevice } from '../services/api';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function DeviceList() {
    const { user } = useAuth();
    const [devices, setDevices] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            const response = await getDevices();
            setDevices(response.data);
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this device?')) {
            try {
                await deleteDevice(id);
                fetchDevices();
            } catch (error) {
                console.error('Error deleting device:', error);
            }
        }
    };

    const filteredDevices = devices.filter(device =>
        device.model?.toLowerCase().includes(search.toLowerCase()) ||
        device.serialNumber?.toLowerCase().includes(search.toLowerCase()) ||
        device.brand?.toLowerCase().includes(search.toLowerCase()) ||
        device.assignedUser?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'success';
            case 'Under Repair': return 'warning';
            case 'Retired': return 'error';
            default: return 'default';
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Add Title
        doc.setFontSize(18);
        doc.text('Office Device Inventory Report', 14, 22);

        // Add Date
        doc.setFontSize(11);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        // Default styling for PDF table
        const tableColumn = ["Type", "Brand & Model", "S/N", "Dept", "User", "OS", "RAM/Storage", "Status"];
        const tableRows = [];

        filteredDevices.forEach(device => {
            const deviceData = [
                device.deviceType,
                `${device.brand} ${device.model}`,
                device.serialNumber,
                device.department,
                device.assignedUser || '-',
                device.hardwareConfig?.operatingSystem || '-',
                `${device.hardwareConfig?.ram || '-'} / ${device.hardwareConfig?.storageCapacity || '-'}`,
                device.status
            ];
            tableRows.push(deviceData);
        });

        doc.autoTable({
            startY: 35,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [25, 118, 210] } // MUI Primary color matches
        });

        doc.save(`device_inventory_report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Device Inventory</Typography>
                <TextField
                    size="small"
                    placeholder="Search devices..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: 300 }}
                />
                <Box>
                    <Button
                        variant="outlined"
                        onClick={generatePDF}
                        sx={{ mr: user?.role === 'Admin' ? 2 : 0 }}
                    >
                        Export PDF
                    </Button>
                    {user?.role === 'Admin' && (
                        <Button
                            variant="contained"
                            color="primary"
                            component={RouterLink}
                            to="/add"
                        >
                            Add New Device
                        </Button>
                    )}
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Device Type</TableCell>
                            <TableCell>Brand & Model</TableCell>
                            <TableCell>Serial Number</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Assigned User</TableCell>
                            <TableCell>OS</TableCell>
                            <TableCell>RAM/Storage</TableCell>
                            <TableCell>Status</TableCell>
                            {user?.role === 'Admin' && <TableCell align="right">Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDevices.map((device) => (
                            <TableRow key={device._id}>
                                <TableCell>{device.deviceType}</TableCell>
                                <TableCell>{`${device.brand} ${device.model}`}</TableCell>
                                <TableCell>{device.serialNumber}</TableCell>
                                <TableCell>{device.department}</TableCell>
                                <TableCell>{device.assignedUser || '-'}</TableCell>
                                <TableCell>
                                    {device.hardwareConfig?.operatingSystem || '-'}
                                </TableCell>
                                <TableCell>
                                    {device.hardwareConfig?.ram ? `${device.hardwareConfig.ram} / ` : ''}
                                    {device.hardwareConfig?.storageCapacity || ''}
                                    {device.hardwareConfig?.storageType ? ` (${device.hardwareConfig.storageType})` : ''}
                                </TableCell>
                                <TableCell>
                                    <Chip label={device.status} color={getStatusColor(device.status)} size="small" />
                                </TableCell>
                                {user?.role === 'Admin' && (
                                    <TableCell align="right">
                                        <IconButton component={RouterLink} to={`/edit/${device._id}`} size="small" color="primary">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(device._id)} size="small" color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                        {filteredDevices.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={user?.role === 'Admin' ? 9 : 8} align="center">
                                    <Typography variant="body2" sx={{ py: 2 }}>No devices found</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
export default DeviceList;
