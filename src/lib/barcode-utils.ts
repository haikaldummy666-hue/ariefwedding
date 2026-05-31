// Generate a unique barcode ID (short and memorable)
export function generateBarcodeId(): string {
  // Generate random 8-character barcode ID
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Create barcode data (can be used for both 1D and 2D codes)
export function createBarcodeData(guestId: string, guestName: string): string {
  const timestamp = new Date().toISOString();
  return `GUEST|${guestId}|${guestName}|${timestamp}`;
}

// Decode barcode data
export function decodeBarcodeData(data: string): {
  type: string;
  guestId: string;
  guestName: string;
  timestamp: string;
} | null {
  try {
    const parts = data.split('|');
    if (parts.length === 4 && parts[0] === 'GUEST') {
      return {
        type: parts[0],
        guestId: parts[1],
        guestName: parts[2],
        timestamp: parts[3],
      };
    }
  } catch (error) {
    console.error('Failed to decode barcode data:', error);
  }
  return null;
}

// Format date for display
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
