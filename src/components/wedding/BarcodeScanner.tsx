import { useEffect, useRef, useState, useCallback } from 'react';
import jsQR from 'jsqr';
import { toast } from 'sonner';
import { Loader2, AlertCircle, Activity, Camera } from 'lucide-react';
import cv from '@techstark/opencv-js';

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
  onError?: (error: string) => void;
  isLoading?: boolean;
}

interface ScanMetrics {
  fps: number;
  detectionRate: number;
  averageTime: number;
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
  const [isScanning, setIsScanning] = useState(false);
  const [metrics, setMetrics] = useState<ScanMetrics>({ fps: 0, detectionRate: 0, averageTime: 0 });
  
  const lastScanRef = useRef<string | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scanAnimationFrame = useRef<number | null>(null);
  
  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(Date.now());
  const detectionCountRef = useRef<number>(0);
  const scanTimesRef = useRef<number[]>([]);

  // Play beep sound
  const playBeep = (frequency = 1000, duration = 200) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.debug('Beep sound failed:', error);
    }
  };

  const startCamera = async () => {
    try {
      setHasError(false);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
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
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
      if (scanAnimationFrame.current) {
        cancelAnimationFrame(scanAnimationFrame.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const processFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      scanAnimationFrame.current = requestAnimationFrame(processFrame);
      return;
    }

    const startTime = performance.now();
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    detectionCountRef.current++;

    try {
      // OpenCV Image Preprocessing
      const src = cv.matFromImageData(imageData);
      const dst = new cv.Mat();
      
      // 1. Convert to Grayscale
      cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
      
      // 2. Histogram Equalization for better contrast
      cv.equalizeHist(dst, dst);
      
      // 3. Gaussian Blur to reduce noise
      cv.GaussianBlur(dst, dst, new cv.Size(3, 3), 0, 0, cv.BORDER_DEFAULT);

      // Convert back to RGBA to feed into jsQR
      const rgba = new cv.Mat();
      cv.cvtColor(dst, rgba, cv.COLOR_GRAY2RGBA, 0);
      
      const processedImgData = new ImageData(
        new Uint8ClampedArray(rgba.data),
        rgba.cols,
        rgba.rows
      );

      // Scan with jsQR
      const code = jsQR(processedImgData.data, processedImgData.width, processedImgData.height, {
        inversionAttempts: "dontInvert",
      });

      const scanTime = performance.now() - startTime;
      scanTimesRef.current.push(scanTime);
      if (scanTimesRef.current.length > 30) {
        scanTimesRef.current.shift();
      }

      frameCountRef.current++;
      if (frameCountRef.current % 30 === 0) {
        const now = Date.now();
        const elapsed = now - lastTimeRef.current;
        const fps = Math.round((30 / elapsed) * 1000);
        const averageTime = scanTimesRef.current.reduce((a, b) => a + b, 0) / scanTimesRef.current.length;
        const detectionRate = Math.round((detectionCountRef.current / frameCountRef.current) * 100);

        setMetrics({ fps, detectionRate, averageTime });
        lastTimeRef.current = now;
      }

      if (code && lastScanRef.current !== code.data) {
        lastScanRef.current = code.data;
        setIsScanning(true);
        playBeep(1500, 100);
        
        onScan(code.data);

        if (scanTimeoutRef.current) {
          clearTimeout(scanTimeoutRef.current);
        }

        scanTimeoutRef.current = setTimeout(() => {
          lastScanRef.current = null;
          setIsScanning(false);
        }, 1500);
      }

      // Clean up OpenCV memory
      src.delete();
      dst.delete();
      rgba.delete();

    } catch (error) {
      // Silently handle processing errors to keep stream running
      // console.debug('OpenCV processing error:', error);
    }

    scanAnimationFrame.current = requestAnimationFrame(processFrame);
  }, [onScan]);

  const handleVideoPlay = () => {
    setIsInitialized(true);
    if (!scanAnimationFrame.current) {
      scanAnimationFrame.current = requestAnimationFrame(processFrame);
    }
  };

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-lg border-2 border-red-200 bg-red-50">
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Gagal Akses Kamera
        </h3>
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
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
            <p className="text-white text-sm">Memproses data...</p>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{metrics.fps}</div>
          <div className="text-xs text-blue-700">FPS</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{metrics.detectionRate}%</div>
          <div className="text-xs text-purple-700">Detection</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{metrics.averageTime.toFixed(0)}ms</div>
          <div className="text-xs text-green-700">Avg Time</div>
        </div>
      </div>

      {/* Scanning Indicator */}
      <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <Activity className={`w-5 h-5 ${isScanning ? 'text-blue-600 animate-pulse' : 'text-blue-400'}`} />
        <span className="text-sm font-medium text-blue-900">
          {isScanning ? '🔄 Memproses scan...' : (isInitialized ? '✅ Siap scan (OpenCV Active)' : 'Menghubungkan Kamera...')}
        </span>
      </div>

      {/* Camera Scanner */}
      <div className="w-full rounded-lg overflow-hidden border-4 border-sage/30 shadow-lg relative bg-black flex justify-center">
        {!isInitialized && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <Camera className="w-12 h-12 text-gray-500 animate-pulse" />
          </div>
        )}
        <video 
          ref={videoRef} 
          onPlay={handleVideoPlay}
          className="w-full max-w-full h-auto object-cover" 
          playsInline 
          muted 
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Advanced Features Notice */}
      <div className="text-center text-sm space-y-2 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
        <p className="font-semibold text-green-900">⚡ Teknologi OpenCV Aktif</p>
        <ul className="text-xs text-green-800 space-y-1">
          <li>✨ OpenCV Grayscale Conversion</li>
          <li>🎯 OpenCV Histogram Equalization</li>
          <li>📡 OpenCV Gaussian Blur Noise Reduction</li>
          <li>⚙️ Direct Browser Camera API</li>
        </ul>
        <p className="text-xs text-green-700 mt-3 font-medium">
          💻 Jarak ideal: 10-30cm | Pencahayaan: Cukup terang | Hasil: Instant detection
        </p>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm space-y-2 bg-amber-50 p-4 rounded-lg border border-amber-200">
        <p className="font-medium text-amber-900">📸 Tips Pemindaian Optimal</p>
        <ul className="text-xs text-amber-800 space-y-1">
          <li>✓ Arahkan kamera langsung ke barcode/QR code</li>
          <li>✓ Pastikan pencahayaan cukup terang</li>
          <li>✓ Jarak ideal: 10-30cm dari barcode</li>
          <li>✓ Scanning otomatis & akurat (tidak perlu tombol)</li>
          <li>✓ Sistem akan langsung mendeteksi dan memproses</li>
        </ul>
      </div>
    </div>
  );
}
