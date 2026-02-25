import { useState, useEffect } from 'react';
import {
    Typography,
    Paper,
    TextField,
    Button,
    Box,
    Grid,
    MenuItem,
    Divider
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { createDevice, getDeviceById, updateDevice } from '../services/api';

const statusOptions = ['Active', 'Under Repair', 'Retired'];

function DeviceForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        deviceType: '',
        brand: '',
        model: '',
        serialNumber: '',
        assetTag: '',
        department: '',
        assignedUser: '',
        status: 'Active',
        hardwareConfig: {
            cpu: '',
            ram: '',
            storageType: '',
            storageCapacity: '',
            operatingSystem: ''
        }
    });

    useEffect(() => {
        if (isEdit) {
            fetchDevice();
        }
    }, [id]);

    const fetchDevice = async () => {
        try {
            const response = await getDeviceById(id);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching device:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await updateDevice(id, formData);
            } else {
                await createDevice(formData);
            }
            navigate('/');
        } catch (error) {
            console.error('Error saving device:', error);
            alert('Error saving device. Make sure serial number is unique.');
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 3 }}>
                    {isEdit ? 'Edit Device' : 'Add New Device'}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Basic Information */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Basic Information</Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Device Type"
                                name="deviceType"
                                value={formData.deviceType}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Status"
                                name="status"
                                select
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                {statusOptions.map(option => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Model"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Serial Number"
                                name="serialNumber"
                                value={formData.serialNumber}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Asset Tag"
                                name="assetTag"
                                value={formData.assetTag}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Assigned User"
                                name="assignedUser"
                                value={formData.assignedUser}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Hardware Configuration */}
                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Hardware Configuration</Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="CPU"
                                name="hardwareConfig.cpu"
                                value={formData.hardwareConfig?.cpu}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="RAM"
                                name="hardwareConfig.ram"
                                value={formData.hardwareConfig?.ram}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="OS"
                                name="hardwareConfig.operatingSystem"
                                value={formData.hardwareConfig?.operatingSystem}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Storage Type"
                                name="hardwareConfig.storageType"
                                value={formData.hardwareConfig?.storageType}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Storage Capacity"
                                name="hardwareConfig.storageCapacity"
                                value={formData.hardwareConfig?.storageCapacity}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button onClick={() => navigate('/')} variant="outlined">
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained">
                                {isEdit ? 'Update Device' : 'Create Device'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}

export default DeviceForm;
