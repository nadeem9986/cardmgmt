// ============================================================================
// CHART VISUALIZATION FUNCTIONS
// ============================================================================

let categoryChart = null;

/**
 * Create a beautiful donut chart for category breakdown
 */
function createCategoryChart(categories) {
    const canvas = document.getElementById('categoryChart');
    if (!canvas) return;

    // Destroy existing chart if it exists
    if (categoryChart) {
        categoryChart.destroy();
    }

    // Apple-inspired color palette
    const colors = [
        '#007AFF', // Blue
        '#5856D6', // Indigo
        '#AF52DE', // Purple
        '#FF2D55', // Pink
        '#FF9500', // Orange
        '#34C759', // Green
        '#5AC8FA', // Teal
        '#FF3B30', // Red
    ];

    const labels = categories.map(cat => cat.category);
    const data = categories.map(cat => cat.amount);
    const backgroundColors = colors.slice(0, categories.length);

    categoryChart = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 2,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        font: {
                            family: "'Inter', sans-serif",
                            size: 13,
                            weight: '500'
                        },
                        padding: 16,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: INR ${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

/**
 * Create animated progress bars for categories
 */
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach((bar, index) => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 100 + (index * 100));
    });
}
