import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { toast } from 'sonner';
import { AlertCircle, Camera } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
  onError?: (error: string) => void;
  isLoading?: boolean;
}

export function BarcodeScanner({
  onScan,
  onError,
  isLoading = false,
}: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'ready' | 'detected'>('idle');

  // Use refs to avoid stale closure issues in requestAnimationFrame loop
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  const lastScanRef = useRef<string | null>(null);
  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isProcessingRef = useRef(false);

  // Play beep sound on successful scan
  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 1500;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } catch { /* silent */ }
  };

  const startCamera = async () => {
    try {
      setHasError(false);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setHasError(true);
      const errorMsg = 'Tidak dapat mengakses kamera. Pastikan browser memiliki izin akses.';
      toast.error(errorMsg);
      onError?.(errorMsg);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Core scanning loop
  const processFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      animFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Strategy 1: Try raw image first (fastest & most reliable for clean QR codes)
    let code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    // Strategy 2: If raw fails, try with OpenCV preprocessing
    if (!code) {
      try {
        const cv = (window as any).cv;
        if (cv && cv.matFromImageData) {
          const src = cv.matFromImageData(imageData);
          const gray = new cv.Mat();
          const enhanced = new cv.Mat();

          // Convert to grayscale
          cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

          // Adaptive threshold for better QR detection in poor lighting
          cv.adaptiveThreshold(gray, enhanced, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 51, 10);

          // Convert back to RGBA for jsQR
          const rgba = new cv.Mat();
          cv.cvtColor(enhanced, rgba, cv.COLOR_GRAY2RGBA, 0);

          const processedData = new ImageData(
            new Uint8ClampedArray(rgba.data),
            rgba.cols,
            rgba.rows
          );

          code = jsQR(processedData.data, processedData.width, processedData.height, {
            inversionAttempts: 'attemptBoth',
          });

          // Clean up OpenCV memory
          src.delete();
          gray.delete();
          enhanced.delete();
          rgba.delete();
        }
      } catch {
        // OpenCV not ready or failed - that's ok, raw scan might still work next frame
      }
    }

    // Process detected QR code
    if (code && code.data && !isProcessingRef.current) {
      // Only process if it's a new code (different from last scan)
      if (lastScanRef.current !== code.data) {
        isProcessingRef.current = true;
        lastScanRef.current = code.data;
        setScanStatus('detected');
        playBeep();

        // Call the parent handler via ref (avoids stale closure!)
        try {
          onScanRef.current(code.data);
        } catch (err) {
          console.error('onScan callback error:', err);
        }

        // Cooldown: prevent re-scanning same code for 8 seconds
        if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
        scanTimeoutRef.current = setTimeout(() => {
          lastScanRef.current = null;
          isProcessingRef.current = false;
          setScanStatus('ready');
        }, 8000);
      }
    }

    animFrameRef.current = requestAnimationFrame(processFrame);
  };

  const handleVideoPlay = () => {
    setIsInitialized(true);
    setScanStatus('ready');
    if (!animFrameRef.current) {
      animFrameRef.current = requestAnimationFrame(processFrame);
    }
  };

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-lg border-2 border-red-200 bg-red-50">
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">Gagal Akses Kamera</h3>
        <p className="text-sm text-red-700 text-center mb-4">
          Browser tidak dapat mengakses kamera. Pastikan:
        </p>
        <ul className="text-sm text-red-700 list-disc list-inside mb-4">
          <li>Anda telah memberikan izin akses kamera</li>
          <li>Menggunakan HTTPS atau localhost</li>
          <li>Tidak ada aplikasi lain yang menggunakan kamera</li>
        </ul>
        <button
          onClick={startCamera}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Scanning Status */}
      <div className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-colors ${
        scanStatus === 'detected'
          ? 'bg-green-100 border border-green-400'
          : 'bg-blue-50 border border-blue-200'
      }`}>
        <span className={`text-sm font-medium ${
          scanStatus === 'detected' ? 'text-green-800' : 'text-blue-800'
        }`}>
          {scanStatus === 'idle' && '⏳ Menghubungkan Kamera...'}
          {scanStatus === 'ready' && '📷 Siap scan — Arahkan QR Code ke kamera'}
          {scanStatus === 'detected' && '✅ QR Code Terdeteksi!'}
        </span>
      </div>

      {/* Camera + Overlay */}
      <div className="w-full rounded-lg overflow-hidden border-4 border-sage/30 shadow-lg relative bg-black aspect-[4/3]">
        {!isInitialized && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <Camera className="w-12 h-12 text-gray-500 animate-pulse" />
          </div>
        )}
        <video
          ref={videoRef}
          onPlay={handleVideoPlay}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Scanning Box Overlay */}
        {isInitialized && (
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
            <div
              className="absolute inset-0"
              style={{ boxShadow: 'inset 0 0 0 9999px rgba(0, 0, 0, 0.5)' }}
            />
            <div
              className={`relative w-64 h-64 sm:w-72 sm:h-72 border-2 rounded-xl flex items-center justify-center shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] overflow-hidden transition-colors ${
                scanStatus === 'detected' ? 'border-green-400' : 'border-white'
              }`}
            >
              {/* Corner brackets */}
              <div className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 rounded-tl-lg ${scanStatus === 'detected' ? 'border-green-400' : 'border-green-400'}`} />
              <div className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 rounded-tr-lg ${scanStatus === 'detected' ? 'border-green-400' : 'border-green-400'}`} />
              <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 rounded-bl-lg ${scanStatus === 'detected' ? 'border-green-400' : 'border-green-400'}`} />
              <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 rounded-br-lg ${scanStatus === 'detected' ? 'border-green-400' : 'border-green-400'}`} />

              {/* Scanning laser line */}
              {scanStatus === 'ready' && (
                <div className="w-full h-0.5 bg-green-500/80 shadow-[0_0_8px_2px_rgba(34,197,94,0.5)] animate-[scan_2s_ease-in-out_infinite]" />
              )}

              {/* Success check overlay */}
              {scanStatus === 'detected' && (
                <div className="text-green-400 text-6xl">✓</div>
              )}
            </div>

            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="text-white text-sm font-medium drop-shadow-md bg-black/40 inline-block px-4 py-1.5 rounded-full">
                {scanStatus === 'detected' ? 'QR Code berhasil dipindai!' : 'Arahkan QR Code ke dalam kotak'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="text-center text-sm space-y-2 bg-amber-50 p-4 rounded-lg border border-amber-200">
        <p className="font-medium text-amber-900">📸 Tips Pemindaian</p>
        <ul className="text-xs text-amber-800 space-y-1">
          <li>✓ Arahkan kamera langsung ke QR code</li>
          <li>✓ Pastikan pencahayaan cukup terang</li>
          <li>✓ Jarak ideal: 10-30cm dari QR code</li>
          <li>✓ Scanning otomatis tanpa perlu tombol</li>
        </ul>
      </div>
    </div>
  );
}
