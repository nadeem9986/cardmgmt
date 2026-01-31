// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE_URL = 'http://localhost:5000';

// ============================================================================
// FEATURE 1: STATEMENT DATA EXTRACTION
// ============================================================================

const extractUploadZone = document.getElementById('extractUploadZone');
const extractFileInput = document.getElementById('extractFileInput');
const extractPreview = document.getElementById('extractPreview');
const extractPreviewImage = document.getElementById('extractPreviewImage');
const extractRemoveBtn = document.getElementById('extractRemoveBtn');
const extractBtn = document.getElementById('extractBtn');
const extractLoading = document.getElementById('extractLoading');
const extractResult = document.getElementById('extractResult');
const extractResultContent = document.getElementById('extractResultContent');
const extractError = document.getElementById('extractError');

let extractFile = null;

// Upload zone click handler
extractUploadZone.addEventListener('click', () => {
    if (!extractFile) {
        extractFileInput.click();
    }
});

// File input change handler
extractFileInput.addEventListener('change', (e) => {
    handleExtractFile(e.target.files[0]);
});

// Drag and drop handlers
extractUploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    extractUploadZone.classList.add('drag-over');
});

extractUploadZone.addEventListener('dragleave', () => {
    extractUploadZone.classList.remove('drag-over');
});

extractUploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    extractUploadZone.classList.remove('drag-over');
    handleExtractFile(e.dataTransfer.files[0]);
});

// Remove button handler
extractRemoveBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    extractFile = null;
    extractFileInput.value = '';
    extractPreview.style.display = 'none';
    extractUploadZone.querySelector('.upload-content').style.display = 'block';
    extractBtn.disabled = true;
    extractResult.style.display = 'none';
    extractError.style.display = 'none';
});

// Extract button handler
extractBtn.addEventListener('click', async () => {
    if (!extractFile) return;

    // Hide previous results
    extractResult.style.display = 'none';
    extractError.style.display = 'none';
    extractLoading.style.display = 'block';
    extractBtn.disabled = true;

    try {
        const formData = new FormData();
        formData.append('image', extractFile);

        const response = await fetch(`${API_BASE_URL}/api/extract`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.status === 'success') {
            displayExtractResults(result.data);
        } else {
            showExtractError(result.message);
        }
    } catch (error) {
        showExtractError('Failed to connect to the server. Make sure the backend is running on http://localhost:5000');
    } finally {
        extractLoading.style.display = 'none';
        extractBtn.disabled = false;
    }
});

function handleExtractFile(file) {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        showExtractError('Invalid file type. Please upload PNG, JPG, JPEG, or WEBP image.');
        return;
    }

    extractFile = file;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        extractPreviewImage.src = e.target.result;
        extractUploadZone.querySelector('.upload-content').style.display = 'none';
        extractPreview.style.display = 'block';
        extractBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

function displayExtractResults(data) {
    extractResultContent.innerHTML = `
        <div class="result-item">
            <div class="result-label">Customer Name</div>
            <div class="result-value">${data.customer_name}</div>
        </div>
        <div class="result-item">
            <div class="result-label">Card Account Number</div>
            <div class="result-value">${data.card_account_number}</div>
        </div>
        <div class="result-item">
            <div class="result-label">Statement Date</div>
            <div class="result-value">${data.statement_date}</div>
        </div>
        <div class="result-item">
            <div class="result-label">Total Amount Due</div>
            <div class="result-value">${data.total_amount_due}</div>
        </div>
        <div class="result-item">
            <div class="result-label">Minimum Amount Due</div>
            <div class="result-value">${data.minimum_amount_due}</div>
        </div>
        <div class="result-item">
            <div class="result-label">Due Date</div>
            <div class="result-value">${data.due_date}</div>
        </div>
    `;

    // Hide placeholder and show results
    const placeholder = document.getElementById('extractPlaceholder');
    if (placeholder) placeholder.style.display = 'none';
    extractResult.style.display = 'block';
}

function showExtractError(message) {
    extractError.textContent = `❌ Error: ${message}`;
    extractError.style.display = 'block';
}

// ============================================================================
// FEATURE 2: SPENDING ANALYSIS
// ============================================================================

const analyzeUploadZone = document.getElementById('analyzeUploadZone');
const analyzeFileInput = document.getElementById('analyzeFileInput');
const analyzePreview = document.getElementById('analyzePreview');
const analyzePreviewImage = document.getElementById('analyzePreviewImage');
const analyzeRemoveBtn = document.getElementById('analyzeRemoveBtn');
const reductionPercentage = document.getElementById('reductionPercentage');
const analyzeBtn = document.getElementById('analyzeBtn');
const analyzeLoading = document.getElementById('analyzeLoading');
const analyzeResult = document.getElementById('analyzeResult');
const analyzeResultContent = document.getElementById('analyzeResultContent');
const analyzeError = document.getElementById('analyzeError');

let analyzeFile = null;

// Upload zone click handler
analyzeUploadZone.addEventListener('click', () => {
    if (!analyzeFile) {
        analyzeFileInput.click();
    }
});

// File input change handler
analyzeFileInput.addEventListener('change', (e) => {
    handleAnalyzeFile(e.target.files[0]);
});

// Drag and drop handlers
analyzeUploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    analyzeUploadZone.classList.add('drag-over');
});

analyzeUploadZone.addEventListener('dragleave', () => {
    analyzeUploadZone.classList.remove('drag-over');
});

analyzeUploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    analyzeUploadZone.classList.remove('drag-over');
    handleAnalyzeFile(e.dataTransfer.files[0]);
});

// Remove button handler
analyzeRemoveBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    analyzeFile = null;
    analyzeFileInput.value = '';
    analyzePreview.style.display = 'none';
    analyzeUploadZone.querySelector('.upload-content').style.display = 'block';
    updateAnalyzeButton();
    analyzeResult.style.display = 'none';
    analyzeError.style.display = 'none';
});

// Reduction percentage input handler
reductionPercentage.addEventListener('input', updateAnalyzeButton);

// Analyze button handler
analyzeBtn.addEventListener('click', async () => {
    if (!analyzeFile) return;

    const percentage = parseFloat(reductionPercentage.value);
    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
        showAnalyzeError('Please enter a valid reduction percentage between 1 and 100');
        return;
    }

    // Hide previous results
    analyzeResult.style.display = 'none';
    analyzeError.style.display = 'none';
    analyzeLoading.style.display = 'block';
    analyzeBtn.disabled = true;

    try {
        const formData = new FormData();
        formData.append('image', analyzeFile);
        formData.append('reduction_percentage', percentage);

        const response = await fetch(`${API_BASE_URL}/api/analyze`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.status === 'success') {
            displayAnalyzeResults(result.data);
        } else {
            showAnalyzeError(result.message);
        }
    } catch (error) {
        showAnalyzeError('Failed to connect to the server. Make sure the backend is running on http://localhost:5000');
    } finally {
        analyzeLoading.style.display = 'none';
        updateAnalyzeButton();
    }
});

function handleAnalyzeFile(file) {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        showAnalyzeError('Invalid file type. Please upload PNG, JPG, JPEG, or WEBP image.');
        return;
    }

    analyzeFile = file;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        analyzePreviewImage.src = e.target.result;
        analyzeUploadZone.querySelector('.upload-content').style.display = 'none';
        analyzePreview.style.display = 'block';
        updateAnalyzeButton();
    };
    reader.readAsDataURL(file);
}

function updateAnalyzeButton() {
    const percentage = parseFloat(reductionPercentage.value);
    analyzeBtn.disabled = !analyzeFile || isNaN(percentage) || percentage <= 0 || percentage > 100;
}

function displayAnalyzeResults(data) {
    let html = '';

    // Statement Summary
    html += `
        <div class="result-grid" style="margin-bottom: 2rem;">
            <div class="result-item">
                <div class="result-label">Total Debits</div>
                <div class="result-value">INR ${data.statement_summary.total_debits.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div class="result-item">
                <div class="result-label">Total Credits</div>
                <div class="result-value">INR ${data.statement_summary.total_credits.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div class="result-item">
                <div class="result-label">Closing Balance</div>
                <div class="result-value">INR ${data.statement_summary.closing_balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
        </div>
    `;

    // Category Breakdown with Chart
    html += `
        <h4 style="margin-bottom: 1.5rem; font-size: 1.25rem;">📊 Category Breakdown</h4>
        <div style="max-width: 400px; margin: 0 auto 2rem auto; padding: 1.5rem; background: rgba(255, 255, 255, 0.03); border-radius: 20px; border: 1px solid var(--border-color);">
            <canvas id="categoryChart"></canvas>
        </div>
    `;

    data.category_breakdown.forEach(cat => {
        html += `
            <div class="category-card">
                <div class="category-header">
                    <span class="category-name">${cat.category}</span>
                    <span class="category-amount">INR ${cat.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${cat.percentage}%"></div>
                </div>
                <p style="font-size: 0.875rem; color: var(--text-muted);">${cat.percentage.toFixed(1)}% of total spending</p>
            </div>
        `;
    });

    // Reduction Target
    html += `
        <div style="margin: 2rem 0; padding: 1.5rem; background: rgba(102, 126, 234, 0.1); border-radius: 12px; border: 1px solid rgba(102, 126, 234, 0.3);">
            <h4 style="margin-bottom: 1rem; font-size: 1.25rem;">🎯 Reduction Target</h4>
            <div class="result-grid">
                <div class="result-item">
                    <div class="result-label">Current Spending</div>
                    <div class="result-value">INR ${data.reduction_target.current_spending.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Reduction Target</div>
                    <div class="result-value">${data.reduction_target.reduction_percentage}%</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Target Spending</div>
                    <div class="result-value">INR ${data.reduction_target.target_spending.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Amount to Save</div>
                    <div class="result-value">INR ${data.reduction_target.amount_to_save.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
            </div>
        </div>
    `;

    // Recommendations
    html += '<h4 style="margin-bottom: 1rem; font-size: 1.25rem;">💡 AI-Powered Recommendations</h4>';
    data.recommendations.forEach(rec => {
        html += `
            <div class="recommendation-card">
                <div class="recommendation-header">
                    <span class="recommendation-category">${rec.category}</span>
                    <span class="recommendation-badge">-${rec.reduction_percentage}%</span>
                </div>
                <div class="recommendation-stats">
                    <div class="stat-box">
                        <div class="stat-box-label">Current</div>
                        <div class="stat-box-value">INR ${rec.current_spending.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-box-label">Save</div>
                        <div class="stat-box-value">INR ${rec.amount_to_save.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-box-label">New Target</div>
                        <div class="stat-box-value">INR ${rec.new_spending.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                </div>
                <div class="recommendation-advice">
                    💬 ${rec.advice}
                </div>
            </div>
        `;
    });

    // Total Savings Summary
    html += `
        <div class="summary-box">
            <h4>🎉 Total Projected Savings</h4>
            <p>INR ${data.total_projected_savings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
    `;

    // Export Buttons
    html += `
        <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
            <button onclick="exportToPDF(${JSON.stringify(data).replace(/"/g, '&quot;')})" class="export-btn export-pdf-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Download PDF Report
            </button>
            <button onclick="exportChartAsPNG()" class="export-btn export-chart-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                Download Chart (PNG)
            </button>
        </div>
    `;

    analyzeResultContent.innerHTML = html;

    // Hide placeholder and show results
    const placeholder = document.getElementById('analyzePlaceholder');
    if (placeholder) placeholder.style.display = 'none';
    analyzeResult.style.display = 'block';

    // Create the donut chart
    setTimeout(() => {
        createCategoryChart(data.category_breakdown);
        animateProgressBars();
    }, 100);

    // Smooth scroll to results
    setTimeout(() => {
        analyzeResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
}

function showAnalyzeError(message) {
    analyzeError.textContent = `❌ Error: ${message}`;
    analyzeError.style.display = 'block';
}

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

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

/**
 * Export analysis results as PDF
 */
async function exportToPDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    // Helper function to add new page if needed
    const checkPageBreak = (height) => {
        if (yPos + height > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
            return true;
        }
        return false;
    };

    // Header with gradient background (simulated)
    doc.setFillColor(0, 122, 255);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Credit Card Analysis Report', margin, 25);

    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, margin, 33);

    yPos = 50;

    // Statement Summary Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('📊 Statement Summary', margin, yPos);
    yPos += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Debits: INR ${data.statement_summary.total_debits.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, margin, yPos);
    yPos += 7;
    doc.text(`Total Credits: INR ${data.statement_summary.total_credits.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, margin, yPos);
    yPos += 7;
    doc.text(`Closing Balance: INR ${data.statement_summary.closing_balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, margin, yPos);
    yPos += 15;

    // Capture chart as image
    checkPageBreak(80);
    const canvas = document.getElementById('categoryChart');
    if (canvas) {
        try {
            const chartImage = canvas.toDataURL('image/png');
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('📈 Category Breakdown Chart', margin, yPos);
            yPos += 10;

            const imgWidth = pageWidth - (2 * margin);
            const imgHeight = 80;
            doc.addImage(chartImage, 'PNG', margin, yPos, imgWidth, imgHeight);
            yPos += imgHeight + 15;
        } catch (error) {
            console.error('Error adding chart to PDF:', error);
        }
    }

    // Category Breakdown Table
    checkPageBreak(20);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('💳 Category Details', margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    data.category_breakdown.forEach((cat, index) => {
        checkPageBreak(15);

        // Alternating row colors
        if (index % 2 === 0) {
            doc.setFillColor(245, 245, 247);
            doc.rect(margin, yPos - 5, pageWidth - (2 * margin), 12, 'F');
        }

        doc.setFont('helvetica', 'bold');
        doc.text(cat.category, margin + 5, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(`INR ${cat.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (${cat.percentage.toFixed(1)}%)`, pageWidth - margin - 60, yPos);
        yPos += 12;
    });

    yPos += 10;

    // Reduction Target
    checkPageBreak(40);
    doc.setFillColor(0, 122, 255);
    doc.rect(margin, yPos - 5, pageWidth - (2 * margin), 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('🎯 Reduction Target', margin + 5, yPos + 5);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPos += 15;
    doc.text(`Current: INR ${data.reduction_target.current_spending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, margin + 5, yPos);
    doc.text(`Target: ${data.reduction_target.reduction_percentage}%`, pageWidth / 2, yPos);
    yPos += 7;
    doc.text(`New Target: INR ${data.reduction_target.target_spending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, margin + 5, yPos);
    doc.text(`Save: INR ${data.reduction_target.amount_to_save.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, pageWidth / 2, yPos);

    yPos += 20;
    doc.setTextColor(0, 0, 0);

    // Recommendations
    checkPageBreak(20);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('💡 AI Recommendations', margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    data.recommendations.forEach((rec, index) => {
        checkPageBreak(30);

        // Recommendation box
        doc.setFillColor(175, 82, 222);
        doc.rect(margin, yPos - 5, pageWidth - (2 * margin), 8, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(`${rec.category} (-${rec.reduction_percentage}%)`, margin + 5, yPos);
        yPos += 10;

        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.text(`Current: INR ${rec.current_spending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, margin + 5, yPos);
        yPos += 6;
        doc.text(`Save: INR ${rec.amount_to_save.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, margin + 5, yPos);
        yPos += 6;
        doc.text(`New Target: INR ${rec.new_spending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, margin + 5, yPos);
        yPos += 8;

        // Advice text (word wrap)
        const adviceLines = doc.splitTextToSize(rec.advice, pageWidth - (2 * margin) - 10);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        adviceLines.forEach(line => {
            checkPageBreak(6);
            doc.text(line, margin + 5, yPos);
            yPos += 5;
        });

        yPos += 10;
    });

    // Total Savings Summary
    checkPageBreak(25);
    doc.setFillColor(52, 199, 89);
    doc.rect(margin, yPos - 5, pageWidth - (2 * margin), 20, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('🎉 Total Projected Savings', margin + 5, yPos + 5);
    doc.setFontSize(18);
    doc.text(`INR ${data.total_projected_savings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, margin + 5, yPos + 15);

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated by Credit Card AI Analyzer', pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Save PDF
    doc.save(`credit-card-analysis-${new Date().toISOString().split('T')[0]}.pdf`);
}

/**
 * Export chart as PNG image
 */
async function exportChartAsPNG() {
    const canvas = document.getElementById('categoryChart');
    if (!canvas) {
        alert('No chart available to export');
        return;
    }

    try {
        // Convert canvas to blob
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `spending-chart-${new Date().toISOString().split('T')[0]}.png`;
            link.click();
            URL.revokeObjectURL(url);
        });
    } catch (error) {
        console.error('Error exporting chart:', error);
        alert('Failed to export chart. Please try again.');
    }
}

// ============================================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============================================================================
// INITIALIZATION
// ============================================================================

console.log('✅ Credit Card AI Analyzer initialized');
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('📝 Make sure the Flask backend is running on http://localhost:5000');
