import { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

const Dataviewer = () => {
    const [gateways, setGateways] = useState([]);
    const [selectedGateway, setSelectedGateway] = useState('');
    const [clickData, setClickData] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        fetchGateways();
    }, []);

    const fetchGateways = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const headers = { Authorization: authToken };
            const response = await axios.get('https://backend-clicker.onrender.com/gateways', { headers });
            setGateways(response.data.flat());
        } catch (error) {
            console.error('Error fetching gateways:', error);
        }
    };


    const handleGatewaySelect = async (gatewayId) => {
        setSelectedGateway(gatewayId);
        try {
            const authToken = localStorage.getItem('authToken');
            const headers = {
                Authorization: authToken,
                GatewayId: gatewayId,
            };
            const response = await axios.get('https://backend-clicker.onrender.com/data', { headers });
            setClickData(response.data);
        } catch (error) {
            console.error('Error fetching click data:', error);
        }
    };

    useEffect(() => {
        if (clickData.length > 0) {
            renderBarChart();
        }
    }, [clickData]);


    const handleDateSelect = (e) => {
        setSelectedDate(e.target.value);
    };


    const renderBarChart = () => {
        const groupedData = new Map();

        clickData.forEach(entry => {
            const dateString = new Date(entry.timestamp).toISOString().split('T')[0];
            if (groupedData.has(dateString)) {
                groupedData.set(dateString, groupedData.get(dateString) + 1);
            } else {
                groupedData.set(dateString, 1);
            }
        });

        const labels = Array.from(groupedData.keys());
        const data = Array.from(groupedData.values());
        const canvas = document.getElementById('barChart');
        const ctx = canvas.getContext('2d');

        if (canvas.chart) {
            canvas.chart.destroy();
        }

        canvas.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Clicks per Date',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(5, 192, 192, 1)',
                    borderWidth: 2,
                    borderRadius: 14,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                weight: 'bold', 
                                color: 'black' 
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                weight: 'bold', 
                                color: 'black' 
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'black', 
                            font: {
                                weight: 'bold' 
                            }
                        }
                    },
                    tooltip: {
                        enabled: true,
                        titleFont: { weight: 'bold', color: 'black' },
                        bodyFont: { weight: 'bold', color: 'black' }
                    }
                }
            }
        });
    };



    const renderPieChart = () => {

        const selectedData = clickData.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            const dateString = entryDate.toISOString().split('T')[0];
            return dateString === selectedDate;
        });


        const hourlyCounts = new Array(24).fill(0);
        selectedData.forEach(entry => {
            const time = entry.timestamp.split('T')[1].split('.')[0];
            const hour = parseInt(time.split(':')[0]);
            hourlyCounts[hour]++;
        });


        const hourLabels = [...Array(24).keys()].map(hour => `${hour}:00 - ${hour + 1}:00`);

        const canvas = document.getElementById('pieChart');
        const ctx = canvas.getContext('2d');

        if (canvas.chart) {
            canvas.chart.destroy();
        }

        if (hourlyCounts.every(count => count === 0)) {
            return;
        }

        canvas.chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: hourLabels,
                datasets: [{
                    data: hourlyCounts,
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
                legend: {
                    labels: {
                        color: 'black'
                    }
                },
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
        <div className='padding text-center font-montserrat min-h-screen'>
            <h1 className='font-montserrat font-bold text-2xl bg-primary rounded-xl'>Footfall Counter</h1>
            <div className=' px-1 pb-10 flex justify-center items-center flex-col bg-primary paddin'>
                <h2 className='font-palanquin font-bold text-2xl'>Select Gateway:</h2>
                <select className="border-slate-950 border-solid" value={selectedGateway} onChange={(e) => handleGatewaySelect(e.target.value)}>
                    <option value="">Select a Gateway</option>
                    {gateways.map((gatewayId, index) => (
                        <option key={index} value={gatewayId}>{gatewayId}</option>
                    ))}
                </select>
            </div>
            {selectedGateway && (
                <>
                    <div className='w-100  bg-primary'>
                        <canvas id="barChart"></canvas>
                    </div>
                    <div className='pt-10 pb-10 flex justify-center items-center flex-col bg-primary paddin'>
                        <h2 className='font-palanquin font-bold text-2xl'>Select Date for Pie Chart showing footfall according to time:</h2>
                        <select className="border-slate-950 border-solid" value={selectedDate} onChange={handleDateSelect}>
                            <option value="">Select a Date</option>
                            {Array.from(new Set(clickData.map(entry => new Date(entry.timestamp).toISOString().split('T')[0]))).map(date => (
                                <option key={date} value={date}>{date}</option>
                            ))}
                        </select>

                    </div>
                    <div className='flex justify-center items-center bg-primary'>
                        {selectedDate && <button onClick={renderPieChart} className='flex w-40 justify-center items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>Generate Pie Chart</button>}
                    </div>
                    <div className='bg-primary padding rounded-xl'>
                        <canvas id="pieChart"></canvas>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dataviewer;





