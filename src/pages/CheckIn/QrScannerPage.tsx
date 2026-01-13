import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
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

  // Oprire scaner și eliberare cameră
  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        // Curățăm elementul DOM creat de bibliotecă
        scannerRef.current.clear();
      } catch (err) {
        console.error('Eroare la oprirea scanerului:', err);
      } finally {
        scannerRef.current = null;
      }
    }
  }, []);

  const handleScan = useCallback(
    async (code: string) => {
      if (!eventId) return;

      // Oprim scanarea vizuală pentru a procesa rezultatul
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.pause();
      }

      setStatus('PROCESSING');
      try {
        const response = await ticketService.checkIn(code, eventId);
        setResult({
          valid: response?.valid ?? false,
          message: response?.message ?? t('checkin.errors.unknown'),
          studentName: response?.studentName,
          timestamp: new Date(),
        });
        setStatus(response?.valid ? 'SUCCESS' : 'ERROR');
      } catch (error) {
        setResult({
          valid: false,
          message: error instanceof Error ? error.message : t('checkin.errors.processing'),
          timestamp: new Date(),
        });
        setStatus('ERROR');
      }
    },
    [eventId, t],
  );

  const startScanner = useCallback(async () => {
    // Verificăm dacă browserul suportă mediaDevices (necesar pentru mobil)
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasPermission(false);
      return;
    }

    if (scannerRef.current?.isScanning) return;

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerContainerId);
      }

      await scannerRef.current.start(
        { facingMode: 'environment' }, // Forțează camera din spate pe mobil
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => handleScan(decodedText),
        () => {},
      );

      setHasPermission(true);
      setStatus('SCANNING');
    } catch (err) {
      console.error('Eroare cameră mobil:', err);
      setHasPermission(false);
      setStatus('IDLE');
    }
  }, [handleScan]);

  // const renderScannerArea = () => {
  //   if (mode === 'MANUAL') {
  //     return (
  //       <div className="flex-1 bg-card flex flex-col items-center justify-center p-8">
  //         <div className="w-full max-w-xs">
  //           <label className="label">{t('checkin.manual.label')}</label>
  //           <input
  //             type="text"
  //             className="input-field"
  //             value={manualCode}
  //             onChange={(e) => setManualCode(e.target.value)}
  //             placeholder="TICKET-..."
  //           />
  //           <button onClick={() => handleScan(manualCode)} className="btn btn-primary w-full mt-4">
  //             {t('common.confirm')}
  //           </button>
  //         </div>
  //       </div>
  //     );
  //   }
  //
  //   return (
  //     <div className="relative w-full h-full min-h-[400px] bg-black">
  //       <div id={scannerContainerId} className="w-full h-full" />
  //
  //       {/* BUTON DE ACTIVARE DACĂ AUTO-START EȘUEAZĂ */}
  //       {(hasPermission === null || hasPermission === false) && (
  //         <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-gray-900 text-center text-white">
  //           <Camera size={48} className="text-muted mb-4" />
  //           <h3 className="text-h3 mb-2">{t('checkin.camera.inactiveTitle')}</h3>
  //           <p className="mb-6 text-sm opacity-80">{t('checkin.camera.inactiveDesc')}</p>
  //           <button
  //             onClick={() => {
  //               // Forțăm startul printr-o interacțiune directă a utilizatorului
  //               startScanner();
  //             }}
  //             className="btn btn-primary px-8 py-4"
  //           >
  //             {t('checkin.camera.activateBtn')}
  //           </button>
  //         </div>
  //       )}
  //
  //       {status === 'SCANNING' && (
  //         <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
  //           <div className="w-64 h-64 border-2 border-accent/50 rounded-3xl relative">
  //             <div className="absolute inset-0 border-2 border-accent rounded-3xl animate-pulse" />
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  // Controlerul principal pentru Lifecycle-ul camerei
  useEffect(() => {
    if (mode === 'CAMERA' && (user?.role === 'ORGANIZER' || user?.role === 'ADMIN')) {
      // Timeout mic pentru a asigura că elementul DOM #qr-reader-viewport este randat
      const timer = setTimeout(() => startScanner(), 200);
      return () => {
        clearTimeout(timer);
        stopScanner();
      };
    } else {
      stopScanner();
    }
  }, [mode, startScanner, stopScanner, user]);

  const resetScanner = async () => {
    setResult(null);
    setManualCode('');
    if (mode === 'CAMERA' && scannerRef.current) {
      try {
        scannerRef.current.resume();
        setStatus('SCANNING');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        startScanner();
      }
    } else {
      setStatus('IDLE');
    }
  };

  // UI pentru lipsă acces (bazat pe index.css)
  if (user?.role !== 'ORGANIZER' && user?.role !== 'ADMIN') {
    return (
      <div className="layout-container flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-red-100 text-destructive rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={32} />
        </div>
        <h1 className="text-h2 text-destructive mb-2">{t('common.access_denied')}</h1>
        <button className="btn btn-secondary mt-6" onClick={() => navigate(-1)}>
          {t('common.go_back')}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page flex flex-col pb-10">
      {/* Header Mobil & Desktop */}
      {/*<div className="bg-card border-b border-border p-4">*/}
      {/*  <div className="layout-container flex items-center justify-between">*/}
      {/*    <button onClick={() => navigate(-1)} className="btn btn-ghost p-2">*/}
      {/*      /!*<ArrowLeft size={24} />*!/*/}
      {/*    </button>*/}
      {/*    <h1 className="text-h3">{t('checkin.pageTitle')}</h1>*/}
      {/*    <div className="w-10" />*/}
      {/*  </div>*/}
      {/*</div>*/}

      <main className="flex-1 flex flex-col md:py-8">
        <div className="layout-container max-w-4xl w-full flex-1 flex flex-col md:flex-row gap-6">
          {/* Zona Principală de Scanare */}
          <div className="card p-0 bg-black overflow-hidden relative flex flex-col shadow-xl">
            {mode === 'CAMERA' ? (
              <>
                {/* Viewport-ul Camerei */}
                <div id={scannerContainerId} className="w-full h-full" />

                {/* 1. BUTON ACTIVARE (SOLUȚIA PENTRU MOBIL) */}
                {(status === 'IDLE' || hasPermission === null) && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-gray-900/90 text-center text-white backdrop-blur-sm">
                    <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6">
                      <Camera size={40} className="text-accent" />
                    </div>
                    <h3 className="text-h3 text-white mb-2">{t('checkin.camera.readyTitle')}</h3>
                    <p className="mb-8 text-gray-300 max-w-xs">{t('checkin.camera.readyDesc')}</p>
                    <button
                      onClick={() => startScanner()}
                      className="btn btn-primary px-10 py-4 text-lg shadow-[0_0_20px_rgba(63,191,246,0.4)]"
                    >
                      {t('checkin.camera.activateBtn')}
                    </button>
                  </div>
                )}

                {/* 2. EROARE PERMISIUNE (Dacă a dat REJECT) */}
                {hasPermission === false && (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-gray-950 text-center text-white">
                    <AlertTriangle size={48} className="text-destructive mb-4" />
                    <p className="mb-6 text-gray-300">{t('checkin.errors.cameraPermission')}</p>
                    <button
                      onClick={() => {
                        setHasPermission(null);
                        startScanner();
                      }}
                      className="btn btn-secondary"
                    >
                      {t('checkin.actions.scanAgain')}
                    </button>
                  </div>
                )}

                {/* 3. OVERLAY SCANARE ACTIVĂ */}
                {status === 'SCANNING' && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    <div className="w-64 h-64 mt-8 border-accent/50 rounded-3xl relative">
                      {/* Colțuri animate */}
                      {/*<div className="absolute inset-0 border-2 border-accent rounded-3xl animate-pulse" />*/}
                      {/*/!* Linia de scanare *!/*/}
                      {/*<div className="absolute top-0 left-0 right-0 h-1 bg-accent/60 shadow-[0_0_15px_#3FBFF6] animate-[scan_2s_infinite]" />*/}
                    </div>
                    <p className="mt-8 text-white bg-black/60 px-6 py-2 rounded-full text-sm backdrop-blur-md border border-white/10">
                      {t('checkin.camera.alignInstruction')}
                    </p>
                  </div>
                )}

                {/* 4. LOADING LA PROCESARE */}
                {status === 'PROCESSING' && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <Loader2 className="w-12 h-12 text-accent animate-spin" />
                    <p className="mt-4 text-white font-medium italic">
                      {t('checkin.status.verifying')}
                    </p>
                  </div>
                )}
              </>
            ) : (
              /* MOD MANUAL */
              <div className="flex-1 bg-card flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-xs">
                  <div className="mb-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-bg-muted rounded-full flex items-center justify-center mb-4">
                      <Keyboard className="text-muted" size={32} />
                    </div>
                    <h3 className="text-h3">{t('checkin.manual.title')}</h3>
                    <p className="text-caption mt-1">{t('checkin.manual.description')}</p>
                  </div>

                  <label className="label">{t('checkin.manual.label')}</label>
                  <input
                    type="text"
                    className="input-field text-center text-xl tracking-widest uppercase font-bold"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder={t('checkin.manual.placeholder')}
                    autoFocus
                  />
                  <button
                    onClick={() => handleScan(manualCode)}
                    disabled={!manualCode || status === 'PROCESSING'}
                    className="btn btn-primary w-full mt-6 py-4 text-lg"
                  >
                    {status === 'PROCESSING' ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      t('common.confirm')
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Control */}
          <div className="w-full md:w-80 flex flex-col gap-4">
            <div className="card space-y-4 bg-card">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted border-b border-border pb-2">
                {t('checkin.method')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                <button
                  onClick={() => setMode('CAMERA')}
                  className={cn(
                    'btn w-full justify-start py-4 border-2 transition-all',
                    mode === 'CAMERA'
                      ? 'btn-primary border-accent'
                      : 'btn-secondary border-transparent',
                  )}
                >
                  <ScanLine size={20} /> {t('checkin.methods.camera')}
                </button>
                <button
                  onClick={() => setMode('MANUAL')}
                  className={cn(
                    'btn w-full justify-start py-4 border-2 transition-all',
                    mode === 'MANUAL'
                      ? 'btn-primary border-accent'
                      : 'btn-secondary border-transparent',
                  )}
                >
                  <Keyboard size={20} /> {t('checkin.methods.manual')}
                </button>
              </div>
            </div>

            <div className="card bg-bg-muted border-none p-4">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle size={16} className="text-accent" /> {t('checkin.tips.title')}
              </h4>
              <ul className="text-caption space-y-2 list-disc pl-4">
                <li>{t('checkin.tips.light')}</li>
                <li>{t('checkin.tips.distance')}</li>
                <li>{t('checkin.tips.damaged')}</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Rezultat Overlay (Modal) */}
      {(status === 'SUCCESS' || status === 'ERROR') && result && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="card w-full max-w-sm bg-card shadow-2xl animate-in zoom-in-95 duration-300 border-2 border-border">
            <div
              className={cn(
                'flex flex-col items-center p-10 rounded-t-lg',
                result.valid ? 'bg-green-500/10' : 'bg-destructive/10',
              )}
            >
              <div
                className={cn(
                  'w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner',
                  result.valid ? 'bg-green-500/20' : 'bg-destructive/20',
                )}
              >
                {result.valid ? (
                  <CheckCircle2 size={56} className="text-green-500" />
                ) : (
                  <XCircle size={56} className="text-destructive" />
                )}
              </div>
              <h2
                className={cn(
                  'text-h2 text-center uppercase tracking-tight',
                  result.valid ? 'text-green-600' : 'text-destructive',
                )}
              >
                {result.valid ? t('checkin.status.success') : t('checkin.status.error')}
              </h2>
              <p className="text-main font-semibold mt-3 text-lg text-center">{result.message}</p>
            </div>

            <div className="p-8 space-y-8">
              {result.studentName && (
                <div className="flex items-center gap-4 p-5 bg-bg-muted rounded-xl border border-border">
                  <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-sm">
                    <UserCircle2 className="text-accent" size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted">
                      {t('checkin.status.validatedStudent')}
                    </p>
                    <p className="font-bold text-main text-xl leading-none mt-1">
                      {result.studentName}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={resetScanner}
                  className="btn btn-primary w-full py-5 text-lg font-bold shadow-lg"
                >
                  <RefreshCcw size={20} className="mr-2" /> {t('checkin.actions.scanNext')}
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="btn btn-ghost w-full py-3 text-muted"
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
