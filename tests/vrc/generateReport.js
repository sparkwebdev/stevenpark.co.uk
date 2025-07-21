import { writeFileSync } from 'fs';
import path from 'path';

/**
 * Generate HTML report for Visual Regression Testing results
 * @param {Array} results - Array of test result objects
 * @param {string} outputDir - Directory where report and images are stored
 * @returns {string} Path to generated report file
 */
export function generateReport(results, outputDir) {
  const reportPath = path.join(outputDir, 'vrc-report.html');
  
  // Calculate summary statistics
  const stats = results.reduce((acc, result) => {
    acc[result.status] = (acc[result.status] || 0) + 1;
    acc.total++;
    return acc;
  }, { pass: 0, diff: 0, error: 0, total: 0 });

  const successRate = stats.total > 0 ? ((stats.pass / stats.total) * 100).toFixed(1) : 0;
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visual Regression Test Report</title>
  <style>
    * { box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      margin: 0; 
      padding: 20px; 
      background: #f5f5f5; 
    }
    .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: #2563eb; color: white; padding: 20px; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 5px 0 0; opacity: 0.9; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; padding: 20px; }
    .stat { text-align: center; padding: 20px; border-radius: 6px; }
    .stat-pass { background: #dcfce7; color: #15803d; }
    .stat-diff { background: #fef3c7; color: #d97706; }
    .stat-error { background: #fecaca; color: #dc2626; }
    .stat-total { background: #e5e7eb; color: #374151; }
    .stat-number { font-size: 28px; font-weight: bold; margin-bottom: 5px; }
    .stat-label { font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
    .results { padding: 0 20px 20px; }
    .result { margin-bottom: 30px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 6px; }
    .result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .result-title { font-size: 18px; font-weight: 600; }
    .result-url { font-size: 14px; color: #6b7280; margin-top: 4px; font-family: monospace; }
    .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; text-transform: uppercase; }
    .status-pass { background: #dcfce7; color: #15803d; }
    .status-diff { background: #fef3c7; color: #d97706; }
    .status-error { background: #fecaca; color: #dc2626; }
    .images { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 15px; }
    .image-container { text-align: center; }
    .image-label { font-size: 12px; color: #6b7280; margin-bottom: 8px; text-transform: uppercase; font-weight: 500; }
    .image { max-width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 4px; }
    .no-image { padding: 40px; background: #f9fafb; color: #6b7280; font-size: 12px; border: 1px dashed #d1d5db; border-radius: 4px; }
    .error-message { background: #fef2f2; color: #991b1b; padding: 12px; border-radius: 4px; font-size: 14px; margin-top: 10px; }
    .diff-info { background: #fef3c7; color: #92400e; padding: 8px 12px; border-radius: 4px; font-size: 14px; margin-top: 10px; }
    .device-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
    .filter-buttons { padding: 20px; border-bottom: 1px solid #e5e7eb; }
    .filter-btn { margin-right: 10px; padding: 8px 16px; border: 1px solid #d1d5db; background: white; border-radius: 4px; cursor: pointer; font-size: 14px; }
    .filter-btn.active { background: #2563eb; color: white; border-color: #2563eb; }
    .filter-btn:hover { background: #f3f4f6; }
    .filter-btn.active:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Visual Regression Test Report</h1>
      <p>Generated: ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="stats">
      <div class="stat stat-total">
        <div class="stat-number">${stats.total}</div>
        <div class="stat-label">Total Tests</div>
      </div>
      <div class="stat stat-pass">
        <div class="stat-number">${stats.pass}</div>
        <div class="stat-label">Passed</div>
      </div>
      <div class="stat stat-diff">
        <div class="stat-number">${stats.diff || 0}</div>
        <div class="stat-label">Differences</div>
      </div>
      <div class="stat stat-error">
        <div class="stat-number">${stats.error || 0}</div>
        <div class="stat-label">Errors</div>
      </div>
    </div>

    <div class="filter-buttons">
      <button class="filter-btn active" onclick="filterResults('all')">All</button>
      <button class="filter-btn" onclick="filterResults('diff')">Differences Only</button>
      <button class="filter-btn" onclick="filterResults('error')">Errors Only</button>
      <button class="filter-btn" onclick="filterResults('pass')">Passed Only</button>
    </div>
    
    <div class="results">
      ${results.map(result => `
        <div class="result" data-status="${result.status}">
          <div class="result-header">
            <div>
              <div class="result-title">${result.name} - ${result.device}</div>
              <div class="result-url">${result.devUrl}</div>
            </div>
            <span class="status status-${result.status}">${result.status}</span>
          </div>
          
          ${result.status === 'error' ? `
            <div class="error-message">
              Error: ${result.errorMessage || 'Unknown error occurred'}
            </div>
          ` : ''}
          
          ${result.status === 'diff' ? `
            <div class="diff-info">
              ${result.diffPixels} pixels different
            </div>
            <div class="images">
              <div class="image-container">
                <div class="image-label">Development</div>
                <img class="image" src="${result.devScreenshotFile}" alt="Development screenshot" loading="lazy" />
              </div>
              <div class="image-container">
                <div class="image-label">Production</div>
                <img class="image" src="${result.liveScreenshotFile}" alt="Production screenshot" loading="lazy" />
              </div>
              <div class="image-container">
                <div class="image-label">Difference</div>
                <img class="image" src="${result.diffScreenshotFile}" alt="Difference screenshot" loading="lazy" />
              </div>
            </div>
          ` : ''}
          
          ${result.status === 'pass' ? `
            <div style="color: #15803d; font-size: 14px;">✅ Visual test passed - no differences detected</div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  </div>

  <script>
    function filterResults(status) {
      const buttons = document.querySelectorAll('.filter-btn');
      const results = document.querySelectorAll('.result');
      
      // Update active button
      buttons.forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
      
      // Filter results
      results.forEach(result => {
        if (status === 'all' || result.dataset.status === status) {
          result.style.display = 'block';
        } else {
          result.style.display = 'none';
        }
      });
    }
  </script>
</body>
</html>`;

  writeFileSync(reportPath, html);
  return reportPath;
}