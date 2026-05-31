import { useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeDisplayProps {
  value: string;
  format?: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
}

export function BarcodeDisplay({
  value,
  format = 'CODE128',
  width = 2,
  height = 100,
  displayValue = true,
}: BarcodeDisplayProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format,
          width,
          height,
          displayValue,
          margin: 10,
          background: '#ffffff',
          lineColor: '#000000',
        });
      } catch (error) {
        console.error('Error generating barcode:', error);
      }
    }
  }, [value, format, width, height, displayValue]);

  return (
    <div className="flex justify-center bg-white p-4 rounded-lg">
      <svg ref={svgRef}></svg>
    </div>
  );
}

// QR Code component
import QRCode from 'qrcode.react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
}

export function QRCodeDisplay({
  value,
  size = 200,
  level = 'M',
  includeMargin = true,
}: QRCodeDisplayProps) {
  return (
    <div className="flex justify-center bg-white p-4 rounded-lg">
      <QRCode
        value={value}
        size={size}
        level={level}
        includeMargin={includeMargin}
        quietZone={10}
      />
    </div>
  );
}
