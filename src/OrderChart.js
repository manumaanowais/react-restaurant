import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function OrderChart({ takeAwayCount, dineInCount, takeAwayTotalPrice, dineInTotalPrice }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            const totalOrders = takeAwayCount + dineInCount;
            const totalPrice = takeAwayTotalPrice + dineInTotalPrice;
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Take Away', 'Dine In'],
                    datasets: [
                        {
                            label: 'RS.' + totalPrice + ', Orders : ' + totalOrders + ' Orders',
                            data: [takeAwayCount, dineInCount],
                            backgroundColor: ['#FF5733', '#33FF57'],
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false,
                            suggestedMin: 10,
                            suggestedMax: 20,
                            title: {
                                display: true,
                                text: 'Total Orders',
                            },
                        },
                    },
                },
            });
        }
    }, [takeAwayCount, dineInCount, takeAwayTotalPrice, dineInTotalPrice]);

    return (
        <div className="chart-container">
            <canvas ref={chartRef} id="orderChart" width={400} height={200}></canvas>
        </div>
    );
}

export default OrderChart;
