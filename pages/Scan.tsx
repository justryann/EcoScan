
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X, Camera, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import { useStore } from '../store';
import { translations, LangKey } from '../services/translations';

const SCANNER_ID = "eco-scan-qr-reader";

const Scan: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useStore();
  const [manualBarcode, setManualBarcode] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const retryCount = useRef(0);
  const mountedRef = useRef(true);

  const t = (key: LangKey) => translations[language][key] || key;

  const startCamera = async () => {
    if (!mountedRef.current || !containerRef.current) return;

    setIsInitializing(true);
    setCameraError(null);
    
    // Safety check: ensure DOM element is ready and visible in the layout
    if (containerRef.current.clientWidth === 0 || containerRef.current.clientHeight === 0) {
      if (retryCount.current < 10) {
        retryCount.current += 1;
        setTimeout(startCamera, 300);
        return;
      }
      setCameraError("Camera display failed to initialize. Please check permissions and reload.");
      setIsInitializing(false);
      return;
    }

    // Clean up any existing scanner instance
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
      } catch (e) {
        console.warn("Cleanup warning during re-init", e);
      }
    }

    try {
      // CRITICAL FIX: html5-qrcode constructor requires a string ID matching the element in the DOM.
      // Passing the DOM element directly results in "[object HTMLDivElement] not found" error.
      const html5QrCode = new Html5Qrcode(SCANNER_ID, {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
        ],
        verbose: false
      });
      scannerRef.current = html5QrCode;

      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        throw new Error("No cameras found on this device.");
      }

      // Preference: Back camera (environment), fallback to the first available device.
      const cameraConfig = devices.length > 1 
        ? { facingMode: "environment" } 
        : { deviceId: { exact: devices[0].id } };

      await html5QrCode.start(
        cameraConfig,
        {
          fps: 15,
          qrbox: { width: 260, height: 260 }
        },
        (decodedText) => {
          if (window.navigator.vibrate) window.navigator.vibrate(50);
          stopCamera().then(() => {
            if (mountedRef.current) navigate(`/result/${decodedText}`);
          });
        },
        () => {} // silent ignore of frame-by-frame errors
      );
      
      if (mountedRef.current) {
        setIsCameraActive(true);
        setIsInitializing(false);
      }
    } catch (err: any) {
      console.error("Camera start failed:", err);
      if (mountedRef.current) {
        setCameraError(err.message || "Camera access denied or device busy.");
        setIsInitializing(false);
        setIsCameraActive(false);
      }
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        // clear() helps with some internal cleanup in html5-qrcode
        scannerRef.current.clear();
      } catch (e) {
        console.error("Stop error during cleanup:", e);
      }
      if (mountedRef.current) setIsCameraActive(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    // Slight delay to ensure React has fully committed the DOM with the ID
    const timer = setTimeout(startCamera, 800);
    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
      stopCamera();
    };
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      stopCamera().then(() => {
        if (mountedRef.current) navigate(`/result/${manualBarcode.trim()}`);
      });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-160px)] bg-slate-950 flex flex-col items-center overflow-hidden rounded-[40px] shadow-2xl">
      {/* Container must have an ID that matches SCANNER_ID */}
      <div 
        id={SCANNER_ID} 
        ref={containerRef} 
        className="w-full h-full min-h-[500px] absolute inset-0 object-cover z-0"
      ></div>
      
      <AnimatePresence>
        {(isInitializing || cameraError) && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-10 text-center"
          >
            {isInitializing ? (
              <div className="space-y-6">
                <RefreshCw className="w-12 h-12 text-emerald-500 animate-spin mx-auto" />
                <h3 className="text-xl font-black text-white">{t('performingAudit')}</h3>
              </div>
            ) : (
              <div className="space-y-8 max-w-sm">
                <AlertCircle className="w-14 h-14 text-rose-500 mx-auto" />
                <h3 className="text-2xl font-black text-white">{cameraError}</h3>
                <div className="flex flex-col gap-3">
                  <button onClick={startCamera} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black transition-all hover:bg-emerald-500 active:scale-95">
                    {t('refresh')}
                  </button>
                  <button onClick={() => setShowManual(true)} className="text-slate-400 font-bold hover:text-white transition-colors">
                    {t('enterManual')}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-10 w-full flex flex-col items-center gap-2 px-6 text-center z-30 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/60 backdrop-blur-xl px-6 py-3 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-3"
        >
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
          {t('precisionScan')}
        </motion.div>
        <p className="text-white/60 text-xs font-bold mt-2">{t('alignBarcode')}</p>
      </div>

      <div className="absolute bottom-12 w-full flex flex-col items-center gap-6 px-6 z-30">
        <button 
          onClick={() => setShowManual(true)}
          className="flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-3xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95"
        >
          <Keyboard className="w-5 h-5 text-emerald-600" />
          {t('enterManual')}
        </button>
      </div>

      <AnimatePresence>
        {showManual && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-6"
          >
            <motion.div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[48px] p-10 shadow-2xl border border-slate-100 dark:border-slate-800 relative">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white">{t('audit')}</h3>
                <button onClick={() => setShowManual(false)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 transition-colors hover:text-rose-500"><X /></button>
              </div>
              <form onSubmit={handleManualSubmit} className="space-y-8">
                <input 
                  autoFocus
                  type="number" 
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  placeholder="Barcode..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[24px] px-8 py-5 text-2xl font-black text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-colors"
                />
                <button type="submit" className="w-full bg-slate-900 dark:bg-emerald-600 text-white py-6 rounded-[28px] font-black text-xl hover:bg-emerald-500 transition-colors shadow-lg active:scale-95">
                  {t('audit')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Scan;
