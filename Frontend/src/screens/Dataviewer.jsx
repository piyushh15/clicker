import  { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

const Dataviewer = () => {
    const [clickData, setClickData] = useState(null);
    const chartRef = useRef(null); // Reference to the chart instance

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authToken = localStorage.getItem('authToken');
                const headers = {
                    Authorization: authToken,
                };
                const response = await axios.get('https://backend-clicker.onrender.com/data', { headers });
                setClickData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (clickData) {
            // Group click data by dates
            const groupedData = {};
            clickData.forEach(entry => {
                const date = entry.date;
                if (groupedData[date]) {
                    groupedData[date] += entry.count;
                } else {
                    groupedData[date] = entry.count;
                }
            });

            // Extract labels and data for chart
            const labels = Object.keys(groupedData);
            const data = Object.values(groupedData);
            // console.log(labels);
            // console.log(data);

            // Destroy existing chart if it exists
            if (chartRef.current !== null) {
                chartRef.current.destroy();
            }

            // Render the chart
            const ctx = document.getElementById('clicksPerDayChart').getContext('2d');
            chartRef.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Clicks per Day',
                        data: data,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }, [clickData]);

    return (
        <div>
            <h1>Data Viewer</h1>
            <canvas id="clicksPerDayChart"></canvas>
        </div>
    );
}

export default Dataviewer;
