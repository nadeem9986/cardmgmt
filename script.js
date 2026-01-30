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
    extractResult.style.display = 'block';

    // Smooth scroll to results
    setTimeout(() => {
        extractResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
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

    // Category Breakdown
    html += '<h4 style="margin-bottom: 1rem; font-size: 1.25rem;">📊 Category Breakdown</h4>';
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

    analyzeResultContent.innerHTML = html;
    analyzeResult.style.display = 'block';

    // Smooth scroll to results
    setTimeout(() => {
        analyzeResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function showAnalyzeError(message) {
    analyzeError.textContent = `❌ Error: ${message}`;
    analyzeError.style.display = 'block';
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
