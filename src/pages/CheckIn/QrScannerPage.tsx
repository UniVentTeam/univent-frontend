import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { ticketService } from '@/api/ticketService';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/authStore';
import {
  UserCircle2,
  ScanLine,
  Keyboard,
  Camera,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  RefreshCcw,
} from 'lucide-react';

type ScanStatus = 'IDLE' | 'SCANNING' | 'PROCESSING' | 'SUCCESS' | 'ERROR';

interface ScanResultData {
  valid: boolean;
  message: string;
  studentName?: string;
  timestamp: Date;
}

const QrScannerPage = () => {
  const { t } = useTranslation();
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // State
  const [status, setStatus] = useState<ScanStatus>('IDLE');
  const [result, setResult] = useState<ScanResultData | null>(null);
  const [mode, setMode] = useState<'CAMERA' | 'MANUAL'>('CAMERA');
  const [manualCode, setManualCode] = useState('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Scanner Refs
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-reader-viewport';
  const isMounted = useRef(false);

  // 1. Check Permissions & Roles on Mount
  useEffect(() => {
    isMounted.current = true;
    if (user?.role !== 'ORGANIZER' && user?.role !== 'ADMIN') {
      return;
    }

    // Check camera permissions
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (isMounted.current) {
          setHasPermission(devices && devices.length > 0);
        }
      })
      .catch((err) => {
        console.error('Permission error', err);
        if (isMounted.current) setHasPermission(false);
      });

    return () => {
      isMounted.current = false;
      // Cleanup is handled by the effect below or explicit unmount
    };
  }, [user]);

  const handleScan = useCallback(
    async (code: string) => {
      if (!eventId || !scannerRef.current) return;

      // Pause scanning visually
      if (scannerRef.current.isScanning) {
        await scannerRef.current.pause();
      }

      setStatus('PROCESSING');

      try {
        const response = await ticketService.checkIn(code, eventId);

        setResult({
          valid: response?.valid ?? false,
          message: response?.message ?? t('scanner.unknown_error'),
          studentName: response?.studentName,
          timestamp: new Date(),
        });
        setStatus(response?.valid ? 'SUCCESS' : 'ERROR');
      } catch (error) {
        setResult({
          valid: false,
          message: error instanceof Error ? error.message : t('scanner.error_processing'),
          timestamp: new Date(),
        });
        setStatus('ERROR');
      }
    },
    [eventId, t],
  );

  const startScanner = useCallback(async () => {
    // Prevent starting if already running or scanner instance exists and is scanning
    if (scannerRef.current?.isScanning) return;

    try {
      // If instance doesn't exist, create it
      if (!scannerRef.current) {
        const formatsToSupport = [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.CODE_128,
        ];
        scannerRef.current = new Html5Qrcode(scannerContainerId, {
          verbose: false,
          formatsToSupport,
        });
      }

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleScan(decodedText);
        },
        () => {
          // ignore frame errors
        },
      );
      if (isMounted.current) {
        setStatus('SCANNING');
        setHasPermission(true);
      }
    } catch (err) {
      console.error('Failed to start scanner', err);
      // Only set permission false if it's a permission error
      if (isMounted.current) {
        setHasPermission(false);
      }
    }
  }, [handleScan]);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (err) {
        console.error('Error stopping scanner', err);
      }
      scannerRef.current = null;
    }
  }, []);

  // 2. Control Scanner based on Mode
  useEffect(() => {
    if (!hasPermission) return;

    if (mode === 'CAMERA') {
      // Small timeout to allow DOM to render the container
      const timer = setTimeout(() => {
        startScanner();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [mode, hasPermission, startScanner, stopScanner]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim() || !eventId) return;
    // Manual submission acts like a scan
    setStatus('PROCESSING');

    try {
      const response = await ticketService.checkIn(manualCode, eventId);
      setResult({
        valid: response?.valid ?? false,
        message: response?.message ?? t('scanner.unknown_error'),
        studentName: response?.studentName,
        timestamp: new Date(),
      });
      setStatus(response?.valid ? 'SUCCESS' : 'ERROR');
    } catch (error) {
      setResult({
        valid: false,
        message: error instanceof Error ? error.message : t('scanner.error_processing'),
        timestamp: new Date(),
      });
      setStatus('ERROR');
    }
  };

  const resetScanner = async () => {
    setStatus('SCANNING');
    setResult(null);
    setManualCode('');
    if (mode === 'CAMERA' && scannerRef.current) {
      try {
        // Resume if paused
        await scannerRef.current.resume();
      } catch (e) {
        // If resume fails (or wasn't paused properly), just ensure started
        console.warn('Resume failed, ensuring started', e);
        startScanner();
      }
    }
  };

  // Unauthorized State
  if (user?.role !== 'ORGANIZER' && user?.role !== 'ADMIN') {
    return (
      <div className="layout-container flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-red-100 text-destructive rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={32} />
        </div>
        <h1 className="text-h2 text-destructive mb-2">{t('common.access_denied')}</h1>
        <p className="text-muted">{t('scanner.unauthorized_message')}</p>
        <button className="btn btn-secondary mt-6" onClick={() => navigate(-1)}>
          {t('common.go_back')}
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        // Mobile: Fixed Full Screen Overlay (z-index 100)
        'fixed inset-0 z-[100] bg-black flex flex-col',
        // Desktop: Static, In-Flow, Normal Background
        'md:static md:z-auto md:bg-page md:h-auto md:min-h-[calc(100vh-100px)] md:py-8',
      )}
    >
      {/* Mobile Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-12 sm:pt-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent md:hidden">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-black/40 hover:bg-white/10 transition-colors backdrop-blur-sm text-white"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold text-white tracking-wide shadow-sm">
          {mode === 'CAMERA' ? t('scanner.scan_qr') : t('scanner.enter_code')}
        </h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block layout-container mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted hover:text-main mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>{t('common.go_back')}</span>
        </button>
        <h1 className="text-h2">{t('scanner.page_title')}</h1>
      </div>

      {/* Main Content Area */}
      <div
        className={cn(
          'flex-1 relative flex flex-col',
          // Desktop: Centered Card Layout
          'md:layout-container md:max-w-4xl md:mx-auto md:w-full md:bg-card md:border md:border-border md:rounded-2xl md:overflow-hidden md:shadow-sm md:flex-row md:h-[600px]',
        )}
      >
        {/* Scanner / Manual Input Area */}
        <div
          className={cn(
            'flex-1 relative flex flex-col bg-black',
            // Desktop: Ensure bg matches mode
            mode === 'MANUAL' ? 'bg-page md:bg-page' : 'md:bg-black',
          )}
        >
          {mode === 'CAMERA' ? (
            <>
              Camera Viewport
              <div
                id={scannerContainerId}
                className="w-full h-full bg-black object-cover"
                style={{ minHeight: '100%' }}
              />
              {/* Permission Error */}
              {hasPermission === false && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-gray-900 text-center">
                  <Camera size={48} className="text-muted mb-4" />
                  <h3 className="text-h3 text-white mb-2">{t('scanner.camera_error_title')}</h3>
                  <p className="text-gray-400 max-w-xs mb-6">{t('scanner.camera_error_desc')}</p>
                  <button
                    onClick={() => {
                      setHasPermission(null);
                      startScanner();
                    }}
                    className="btn btn-primary"
                  >
                    {t('scanner.scan_again')}
                  </button>
                </div>
              )}
              {/* Scanning Overlay (Viewfinder) */}
              {status === 'SCANNING' && hasPermission !== false && (
                <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center">
                  <div className="relative w-64 h-64 border-2 border-white/30 rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 border-[3px] border-accent rounded-3xl opacity-50 animate-pulse" />
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-accent shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-[scan_2s_infinite]" />
                  </div>
                  <p className="mt-8 text-sm text-white/70 bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
                    {t('scanner.align_qr_code')}
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Manual Entry Form - Uses Theme Colors */
            <div className="flex-1 flex flex-col items-center justify-center p-6 w-full h-full">
              <div className="w-full max-w-sm">
                <label className="label text-muted mb-2">{t('scanner.manual_code_label')}</label>
                <form onSubmit={handleManualSubmit} className="relative">
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="ex: TICKET-123456"
                    className="w-full bg-card border-2 border-border text-main rounded-xl px-4 py-4 text-lg focus:border-accent focus:outline-none transition-colors shadow-sm"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!manualCode.trim() || status === 'PROCESSING'}
                    className="absolute right-2 top-2 bottom-2 aspect-square bg-accent text-white rounded-lg flex items-center justify-center hover:bg-accent/90 disabled:opacity-50 transition-all"
                  >
                    {status === 'PROCESSING' ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <CheckCircle2 />
                    )}
                  </button>
                </form>
                <p className="mt-4 text-xs text-center text-muted">
                  {t('scanner.manual_code_help')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Controls (Desktop) / Bottom Controls (Mobile) */}
        <div
          className={cn(
            'bg-card p-6 pb-8 border-t border-border z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.1)]',
            // Desktop: Sidebar on the right
            'md:w-80 md:border-t-0 md:border-l md:shadow-none md:flex md:flex-col md:justify-center md:pb-6',
          )}
        >
          <div className="flex justify-center gap-4 md:flex-col md:gap-6">
            <h3 className="hidden md:block text-h3 text-center mb-4">Input Method</h3>
            <button
              onClick={() => {
                if (mode !== 'CAMERA') {
                  setMode('CAMERA');
                  setStatus('SCANNING');
                }
              }}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-2xl min-w-[5rem] transition-all md:flex-row md:w-full md:px-4 md:py-4',
                mode === 'CAMERA'
                  ? 'bg-muted text-accent ring-2 ring-accent/20'
                  : 'text-muted hover:text-main hover:bg-muted/50',
              )}
            >
              <ScanLine size={24} className="md:w-5 md:h-5" />
              <span className="text-xs font-medium md:text-sm">Scanner</span>
            </button>
            <button
              onClick={() => {
                if (mode !== 'MANUAL') {
                  setMode('MANUAL');
                  // stopScanner handled by useEffect
                }
              }}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-2xl min-w-[5rem] transition-all md:flex-row md:w-full md:px-4 md:py-4',
                mode === 'MANUAL'
                  ? 'bg-muted text-accent ring-2 ring-accent/20'
                  : 'text-muted hover:text-main hover:bg-muted/50',
              )}
            >
              <Keyboard size={24} className="md:w-5 md:h-5" />
              <span className="text-xs font-medium md:text-sm">Manual Code</span>
            </button>
          </div>

          <div className="hidden md:block mt-8 p-4 bg-muted/50 rounded-xl text-center">
            <p className="text-xs text-muted">
              Use the camera to scan the QR code on the student's ticket, or enter the alphanumeric
              code manually.
            </p>
          </div>
        </div>
      </div>

      {/* Result Overlay / Modal */}
      {(status === 'SUCCESS' || status === 'ERROR') && result && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-end sm:justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
            {/* Header Status */}
            <div
              className={cn(
                'p-6 flex flex-col items-center text-center',
                result.valid ? 'bg-green-50 dark:bg-green-950/30' : 'bg-red-50 dark:bg-red-950/30',
              )}
            >
              <div
                className={cn(
                  'w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-sm',
                  result.valid
                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                    : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400',
                )}
              >
                {result.valid ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
              </div>
              <h2
                className={cn(
                  'text-2xl font-bold mb-1',
                  result.valid
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-red-700 dark:text-red-400',
                )}
              >
                {result.valid ? 'Acces Permis' : 'Acces Respins'}
              </h2>
              <p
                className={cn(
                  'font-medium',
                  result.valid
                    ? 'text-green-600 dark:text-green-500'
                    : 'text-red-600 dark:text-red-500',
                )}
              >
                {result.message}
              </p>
            </div>

            {/* Ticket Details */}
            <div className="p-6 bg-card">
              {result.studentName && (
                <div className="mb-6 flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                    <UserCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider font-semibold">
                      Student
                    </p>
                    <p className="text-lg font-bold text-main">{result.studentName}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={resetScanner}
                  className={cn(
                    'btn w-full py-4 text-base shadow-lg hover:shadow-xl transition-all',
                    result.valid
                      ? 'btn-primary'
                      : 'bg-destructive text-white hover:bg-destructive/90',
                  )}
                  autoFocus
                >
                  <RefreshCcw size={20} className="mr-2" />
                  {t('scanner.scan_next')}
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="btn btn-ghost w-full text-muted hover:text-main"
                >
                  {t('common.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrScannerPage;
