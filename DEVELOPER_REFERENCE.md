# 🔧 Developer Reference - Barcode Feature API

Quick reference untuk developer yang ingin extend atau maintain fitur barcode.

## 📡 Database Queries Reference

### Guests Table

#### Insert Guest
```typescript
const { data, error } = await supabase
  .from('guests')
  .insert([
    {
      name: 'John Doe',
      barcode_id: 'ABC12345',
      barcode_data: 'GUEST|ABC12345|John Doe|2026-05-31T10:00:00Z',
      status: 'invited',
      notes: 'VIP Guest'
    }
  ])
  .select()
  .single();
```

#### Get All Guests
```typescript
const { data } = await supabase
  .from('guests')
  .select('*')
  .order('created_at', { ascending: false });
```

#### Find by Barcode ID
```typescript
const { data } = await supabase
  .from('guests')
  .select('*')
  .eq('barcode_id', 'ABC12345')
  .single();
```

#### Update Guest
```typescript
const { data } = await supabase
  .from('guests')
  .update({ status: 'reminded' })
  .eq('id', guestId)
  .select()
  .single();
```

### Attendance Table

#### Record Check-in
```typescript
const { data, error } = await supabase
  .from('attendance')
  .insert([
    {
      guest_id: guestId,
      checked_in_at: new Date().toISOString()
    }
  ])
  .select()
  .single();
```

#### Get Today's Check-ins
```typescript
const today = new Date();
today.setHours(0, 0, 0, 0);

const { data } = await supabase
  .from('attendance')
  .select(`
    id,
    guest_id,
    checked_in_at,
    guests(name)
  `)
  .gte('checked_in_at', today.toISOString())
  .order('checked_in_at', { ascending: false });
```

#### Check if Already Checked-in Today
```typescript
const today = new Date();
today.setHours(0, 0, 0, 0);

const { data } = await supabase
  .from('attendance')
  .select('id')
  .eq('guest_id', guestId)
  .gte('checked_in_at', today.toISOString())
  .single();
```

#### Get Attendance Stats
```typescript
// Total attended
const { data: attended } = await supabase
  .from('attendance')
  .select('id', { count: 'exact', head: true });

// Total guests
const { data: guests } = await supabase
  .from('guests')
  .select('id', { count: 'exact', head: true });

// Attendance rate
const rate = (attended.length / guests.length) * 100;
```

## 🛠️ Utility Functions

### Barcode Generation

```typescript
import { generateBarcodeId } from '@/lib/barcode-utils';

// Generate random 8-char barcode
const barcodeId = generateBarcodeId(); // e.g., "ABC12345"
```

### Barcode Data Encoding

```typescript
import { createBarcodeData } from '@/lib/barcode-utils';

// Create data string for QR code
const data = createBarcodeData('ABC12345', 'John Doe');
// Result: "GUEST|ABC12345|John Doe|2026-05-31T10:00:00Z"
```

### Barcode Data Decoding

```typescript
import { decodeBarcodeData } from '@/lib/barcode-utils';

// Parse QR code data
const decoded = decodeBarcodeData(scannedData);
// Result: { type: 'GUEST', guestId: 'ABC12345', guestName: 'John Doe', timestamp: '...' }

if (!decoded) {
  // Data invalid or not barcode format
}
```

### Date Formatting

```typescript
import { formatDateTime } from '@/lib/barcode-utils';

// Format to Indonesian locale
const formatted = formatDateTime('2026-05-31T10:00:00Z');
// Result: "31 Mei 2026 10:00"
```

## 🎨 Component Usage

### Barcode Display

```typescript
import { BarcodeDisplay } from '@/components/wedding/BarcodeGenerator';

<BarcodeDisplay
  value="ABC12345"              // Barcode value
  format="CODE128"              // Barcode format (default)
  width={2}                     // Bar width
  height={100}                  // Barcode height
  displayValue={true}           // Show number below
/>
```

### QR Code Display

```typescript
import { QRCodeDisplay } from '@/components/wedding/BarcodeGenerator';

<QRCodeDisplay
  value="GUEST|ABC12345|John|2026-05-31T..."  // Data to encode
  size={200}                    // QR code size
  level="M"                     // Error correction level (L/M/Q/H)
  includeMargin={true}          // Add white margin
/>
```

### Barcode Scanner

```typescript
import { BarcodeScanner } from '@/components/wedding/BarcodeScanner';

const [isLoading, setIsLoading] = useState(false);

<BarcodeScanner
  onScan={(decodedText) => {
    console.log('Scanned:', decodedText);
    // Process the scanned data
  }}
  onError={(error) => {
    console.error('Scan error:', error);
  }}
  isLoading={isLoading}
/>
```

### Guest Generator

```typescript
import { GuestGenerator } from '@/components/wedding/GuestGenerator';

<GuestGenerator />
```

### Check-in Panel

```typescript
import { CheckInPanel } from '@/components/wedding/CheckInPanel';

<CheckInPanel />
```

## 📊 Complete Workflow Example

```typescript
// 1. Generate Guest
async function addGuest(name: string) {
  const barcodeId = generateBarcodeId();
  const barcodeData = createBarcodeData(barcodeId, name);
  
  const { data, error } = await supabase
    .from('guests')
    .insert([{ name, barcode_id: barcodeId, barcode_data: barcodeData }])
    .select()
    .single();
  
  return data;
}

// 2. Scan Barcode
async function handleBarcodeScan(scannedData: string) {
  // Try decode
  const decoded = decodeBarcodeData(scannedData);
  let guestId = null;
  
  if (decoded) {
    // QR code format
    guestId = decoded.guestId;
  } else {
    // Plain barcode
    const { data: guest } = await supabase
      .from('guests')
      .select('id')
      .eq('barcode_id', scannedData)
      .single();
    guestId = guest?.id;
  }
  
  return guestId;
}

// 3. Record Attendance
async function checkInGuest(guestId: string) {
  const { data, error } = await supabase
    .from('attendance')
    .insert([{ guest_id: guestId }])
    .select()
    .single();
  
  return data;
}

// 4. Get Statistics
async function getAttendanceStats() {
  const { data: all } = await supabase.from('guests').select('id');
  const { data: attended } = await supabase.from('attendance').select('id');
  
  return {
    total: all?.length || 0,
    attended: attended?.length || 0,
    rate: ((attended?.length || 0) / (all?.length || 1)) * 100
  };
}
```

## 🔍 Data Export Examples

### CSV Format
```csv
No,Nama Tamu,Status Kehadiran,Waktu Check-in,Status Tamu,Catatan
1,John Doe,Hadir,31 Mei 2026 10:00,invited,VIP
2,Jane Doe,Tidak Hadir,-,invited,
```

### SQL Query for Export
```sql
SELECT 
  ROW_NUMBER() OVER (ORDER BY g.created_at) as no,
  g.name,
  CASE WHEN a.id IS NOT NULL THEN 'Hadir' ELSE 'Tidak Hadir' END as status_kehadiran,
  TO_CHAR(a.checked_in_at, 'DD Mon YYYY HH24:MI') as waktu_checkin,
  g.status,
  g.notes
FROM guests g
LEFT JOIN attendance a ON g.id = a.guest_id
ORDER BY a.checked_in_at DESC NULLS LAST;
```

## 🚀 Adding New Features

### Add Email Notification
```typescript
// Add to attendance insert
async function checkInWithNotification(guestId: string) {
  // Record attendance
  const { data } = await supabase
    .from('attendance')
    .insert([{ guest_id: guestId }])
    .select()
    .single();
  
  // Get guest info
  const { data: guest } = await supabase
    .from('guests')
    .select('name')
    .eq('id', guestId)
    .single();
  
  // Send notification (integrate with email service)
  // sendEmail({ to: 'admin@wedding.com', subject: `${guest.name} check-in` });
  
  return data;
}
```

### Add SMS Notification
```typescript
import twilio from 'twilio'; // or other SMS service

async function sendAttendanceAlert(guestName: string, phone: string) {
  const message = `${guestName} sudah check-in pada acara pernikahan`;
  
  // Send SMS via Twilio or other service
  // await twilioClient.messages.create({...});
}
```

### Add Analytics Dashboard
```typescript
async function getAnalytics() {
  // Attendance by hour
  const { data: byHour } = await supabase.rpc('attendance_by_hour');
  
  // Most attended location
  const { data: byLocation } = await supabase.rpc('attendance_by_location');
  
  // Peak hours
  const { data: peakHours } = await supabase.rpc('peak_attendance_hours');
  
  return { byHour, byLocation, peakHours };
}
```

## 🧪 Unit Test Examples

```typescript
import { generateBarcodeId, createBarcodeData, decodeBarcodeData } from '@/lib/barcode-utils';

describe('Barcode Utils', () => {
  test('generateBarcodeId returns 8 chars', () => {
    const id = generateBarcodeId();
    expect(id).toHaveLength(8);
    expect(/^[A-Z0-9]{8}$/.test(id)).toBe(true);
  });
  
  test('createBarcodeData formats correctly', () => {
    const data = createBarcodeData('ABC12345', 'John Doe');
    expect(data).toContain('GUEST|ABC12345|John Doe');
  });
  
  test('decodeBarcodeData parses correctly', () => {
    const data = createBarcodeData('ABC12345', 'John Doe');
    const decoded = decodeBarcodeData(data);
    expect(decoded?.guestId).toBe('ABC12345');
    expect(decoded?.guestName).toBe('John Doe');
  });
});
```

## 🔗 API Endpoints (if migrating to REST API)

```typescript
// POST /api/guests
// Body: { name: string, notes?: string }
// Returns: { id, barcode_id, barcode_data }

// GET /api/guests
// Returns: Guest[]

// GET /api/guests/:id
// Returns: Guest

// POST /api/attendance/check-in
// Body: { guest_id: string }
// Returns: { attendance_id, guest_name, checked_in_at }

// GET /api/attendance
// Returns: Attendance[]

// GET /api/attendance/stats
// Returns: { total, attended, rate }

// GET /api/attendance/export
// Returns: CSV file
```

## 🎯 Performance Tips

1. **Use Indexes** - Already added in migration
   - `idx_guests_barcode_id` - Fast barcode lookup
   - `idx_guests_name` - Fast guest search
   - `idx_attendance_guest_id` - Fast attendance query

2. **Optimize Queries**
   ```typescript
   // Good - select only needed fields
   const { data } = await supabase
     .from('guests')
     .select('id, name, barcode_id')
     .limit(100);
   
   // Avoid - select all fields
   const { data } = await supabase.from('guests').select('*');
   ```

3. **Batch Operations**
   ```typescript
   // Insert multiple guests at once
   const guests = [
     { name: 'Guest 1', barcode_id: 'A1B2C3D4', ... },
     { name: 'Guest 2', barcode_id: 'E5F6G7H8', ... }
   ];
   
   await supabase.from('guests').insert(guests);
   ```

## 📱 Mobile Considerations

- Test camera access on iOS Safari
- Test camera access on Android Chrome
- Ensure touch-friendly button sizes (48px minimum)
- Handle orientation changes
- Cache data for offline capability

---

**Last Updated**: May 31, 2026  
**Version**: 1.0  
**Status**: Production Ready
