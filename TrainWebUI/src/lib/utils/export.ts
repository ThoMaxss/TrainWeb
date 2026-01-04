/**
 * Export utilities for CSV/Excel downloads
 */

export function generateCSV(data: any[], headers?: string[]): string {
  if (data.length === 0) return '';

  // Auto-detect headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create header row
  const headerRow = csvHeaders.join(',');
  
  // Create data rows
  const dataRows = data.map(item => {
    return csvHeaders.map(header => {
      const value = item[header];
      // Escape commas and quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? '';
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
}

export function downloadCSV(data: any[], filename: string, headers?: string[]): void {
  const csv = generateCSV(data, headers);
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadJSON(data: any, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printElement(elementId: string): void {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const printWindow = window.open('', '', 'height=600,width=800');
  if (!printWindow) return;
  
  printWindow.document.write('<html><head><title>In tài liệu</title>');
  printWindow.document.write('<style>body { font-family: Arial, sans-serif; padding: 20px; }</style>');
  printWindow.document.write('</head><body>');
  printWindow.document.write(element.innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
}
