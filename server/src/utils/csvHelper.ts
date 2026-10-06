/**
 * CSV Helper to safely serialize arrays of records to RFC 4180 compliant CSV
 */

export function toCsvString(headers: { key: string; label: string }[], data: any[]): string {
  const headerLine = headers.map((h) => escapeCsvValue(h.label)).join(',');
  const rowLines = data.map((row) => {
    return headers
      .map((h) => {
        const val = getNestedValue(row, h.key);
        return escapeCsvValue(val);
      })
      .join(',');
  });

  return [headerLine, ...rowLines].join('\r\n');
}

function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) {
    return '""';
  }
  let str = String(val);
  if (val instanceof Date) {
    str = val.toISOString();
  }
  // If string contains comma, double quote, or newline, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

function getNestedValue(obj: any, path: string): any {
  if (!obj) return '';
  const parts = path.split('.');
  let curr = obj;
  for (const part of parts) {
    if (curr === null || curr === undefined) return '';
    curr = curr[part];
  }
  return curr;
}
