import  { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

const Dataviewer = () => {
    const [clickData, setClickData] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [hourlyData, setHourlyData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

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

    useEffect(() => {
        if (clickData.length > 0) {
            renderBarChart();
        }
    }, [clickData]);

    useEffect(() => {
        if (selectedDate !== '') {
            filterHourlyData(selectedDate);
        }
    }, [selectedDate]);

    const renderBarChart = () => {
        const groupedData = {};
        clickData.forEach(entry => {
            const date = entry.date;
            if (groupedData[date]) {
                groupedData[date]++;
            } else {
                groupedData[date] = 1;
            }
        });
    
        const labels = Object.keys(groupedData);
        const data = Object.values(groupedData);
    
        // Get canvas element
        const canvas = document.getElementById('clicksPerDateChart');
        const ctx = canvas.getContext('2d');
    
        // Destroy existing chart if it exists
        if (canvas.chart) {
            canvas.chart.destroy();
        }
    
        // Render the bar chart
        canvas.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels, 
                borderWidth: 2,
                borderRadius: 5,
                datasets: [{
                    label: 'Clicks per Date',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(5, 192, 192, 1)',
                    borderWidth: 2,
                    borderRadius:14,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                weight: 'bold', // Make y-axis labels bold
                                color:'black'
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                weight: 'bold', // Make x-axis labels bold
                                color:'black'
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        enabled: true,
                        titleFont: { weight: 'bold', color: 'black' },
                        bodyFont: { weight: 'bold', color: 'black' }
                    }
                }
            }
        });
    };


    const filterHourlyData = (date) => {
        const filteredData = clickData.filter(entry => entry.date === date);
        const hourlyCounts = new Array(24).fill(0);
        filteredData.forEach(entry => {
            const timeParts = entry.time.split(':');
            const hour = parseInt(timeParts[0]); // Extract hour from the time
            if (!isNaN(hour) && hour >= 0 && hour < 24) {
                hourlyCounts[hour]++;
            }
        });
        setHourlyData(hourlyCounts);
    };
    




    const handleDateSelect = (e) => {
        setSelectedDate(e.target.value);
    };

    const renderPieChart = () => {
        // Get the canvas element
        const canvas = document.getElementById('hourlyPieChart');
        const ctx = canvas.getContext('2d');
    
        // Destroy the previous chart if it exists
        if (canvas.chart) {
            canvas.chart.destroy();
        }
    
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // Check if no data is available for the selected date
        if (hourlyData.length === 0) {
            // Exit early if no data is available
            return;
        }
    
        // Prepare labels for each hour
        const hourLabels = [...Array(24).keys()].map(hour => `${hour}:00 - ${hour + 1}:00`);
    
        // Render the pie chart with tooltips
        canvas.chart = new Chart(ctx, {
            type: 'pie', // Use 'doughnut' type for a circle pie chart
            data: {
                labels: hourLabels,
                datasets: [{
                    data: hourlyData,
                    backgroundColor: [
                        'rgba(25, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(245, 40, 36, 0.8)',
                        'rgba(16, 192, 36, 0.95)',
                        'rgba(16, 192, 198, 0.95)',
                        'rgba(1, 32, 115, 0.95)',
                        'rgba(109, 28, 11, 0.47)',
                        'rgba(2, 119, 2, 47)',
                        'rgba(21, 29, 72, 0.93)',
                        'rgba(241, 86, 5, 0.93)',
                        'rgba(5, 241, 77, 0.93)',
                        'rgba(11, 113, 112, 0.93)',
                        'rgba(9, 18, 12, 0.93)',
                        'rgba(245, 0, 36, 0.8)',
                        'rgba(245, 670, 36, 0.8)',
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    callbacks: {
                        label: (tooltipItem, data) => {
                            const dataIndex = tooltipItem.index;
                            const value = data.datasets[0].data[dataIndex];
                            const hour = hourLabels[dataIndex];
                            return `Value: ${value}, Time: ${hour}`;
                        }
                    }
                }
            }
        });
    };
    
    
    
    return (
        <div className='padding text-center font-montserrat'>
            <h1 className='font-montserrat font-bold text-2xl'>Footfall Counter</h1>

            <div className='flex  flex-col '>
                <div className='w-100'>
                    <canvas className=''id="clicksPerDateChart"></canvas>
                </div>
                <div className='padding flex justify-center items-center flex-col'>
                    <h2 className='font-palanquin font-bold text-2xl'>Select Date for Pie Chart showing footfall according to time:</h2>
                    <select className="border-slate-950 border-solid" value={selectedDate} onChange={handleDateSelect}>
                        <option value="">Select a Date</option>
                        {/* Populate dropdown with available dates */}
                        {Array.from(new Set(clickData.map(entry => entry.date))).map(date => (
                            <option key={date} value={date}>{date}</option>
                        ))}
                    </select>
                </div>
                <div className='flex justify-center items-center'>
                    {selectedDate && <button className='flex w-40 justify-center items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'onClick={renderPieChart}>Generate Pie Chart</button>}
                </div>
                <div>
                    <canvas id="hourlyPieChart" width="400" height="400"></canvas>
                </div>
            </div>
           
        </div>
    );
};

export default Dataviewer;





