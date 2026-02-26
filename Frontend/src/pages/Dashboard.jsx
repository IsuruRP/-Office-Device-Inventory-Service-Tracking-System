import { useState, useEffect } from 'react';
import {
    Typography,
    Grid,
    Paper,
    Box,
    Card,
    CardContent,
    CircularProgress,
    useTheme
} from '@mui/material';
import {
    PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { getDashboardAnalytics } from '../services/api';

function Dashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await getDashboardAnalytics();
                setAnalytics(response.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!analytics) {
        return <Typography color="error">Failed to load analytics data.</Typography>;
    }

    // Format data for Recharts
    const statusData = Object.keys(analytics.statusCounts).map(key => ({
        name: key,
        value: analytics.statusCounts[key]
    }));

    const typeData = Object.keys(analytics.typeCounts).map(key => ({
        name: key,
        value: analytics.typeCounts[key]
    }));

    const STATUS_COLORS = {
        'Active': theme.palette.success.main,
        'Under Repair': theme.palette.warning.main,
        'Retired': theme.palette.error.main
    };

    const TYPE_COLORS = [
        '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'
    ];

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Dashboard Overview</Typography>

            <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card elevation={3} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Total Devices</Typography>
                            <Typography variant="h3" fontWeight="bold">{analytics.totalDevices}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Could add more summary cards here if we had more high-level metrics */}
            </Grid>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Device Status Distribution</Typography>
                        <ResponsiveContainer width="100%" height="85%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || theme.palette.grey[500]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Devices by Type</Typography>
                        <ResponsiveContainer width="100%" height="85%">
                            <BarChart data={typeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill={theme.palette.secondary.main}>
                                    {typeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Dashboard;
