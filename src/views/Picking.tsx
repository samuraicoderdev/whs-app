import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScanBarcode, CheckCircle2, ChevronRight, PackageCheck, AlertCircle, Camera, Keyboard, Layers, Map, CalendarClock, Box } from 'lucide-react';
import { api, type PickingMode, type PickingTask } from '../api/api';
import type { Product } from '../types';
import { Html5Qrcode } from 'html5-qrcode';

type ScannerMode = 'hardware' | 'camera';

const playSound = (type: 'success' | 'error') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    console.error("Audio synth error", e);
  }
};

const CameraScanner = ({ onScan }: { onScan: (val: string) => void }) => {
  useEffect(() => {
    const html5QrCode = new Html5Qrcode("camera-reader");
    let isMounted = true;
    
    // Obtener cámaras y usar la trasera si es posible, si no la webcam predeterminada.
    Html5Qrcode.getCameras().then(devices => {
      if (!isMounted) return;
      if (devices && devices.length) {
        const backCamera = devices.find(d => d.label.toLowerCase().includes('back'));
        const cameraId = backCamera ? backCamera.id : devices[0].id; // Forzar uso de cámara en escritorio o móvil
        
        html5QrCode.start(
          cameraId,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            if (isMounted) onScan(decodedText);
          },
          () => {}
        ).catch(err => console.error("Error al arrancar la cámara:", err));
      } else {
        // Fallback si no identifica IDs, intenta de entorno básico
        html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => { if (isMounted) onScan(decodedText); },
          () => {}
        ).catch(console.error);
      }
    }).catch(console.error);

    return () => {
      isMounted = false;
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [onScan]);

  return (
    <div className="w-full flex justify-center py-4">
      <div id="camera-reader" className="w-full max-w-sm aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-inner flex items-center justify-center relative">
        <div className="absolute inset-0 border-4 border-blue-500/50 m-6 rounded-lg pointer-events-none"></div>
      </div>
    </div>
  );
};

export function Picking() {
  const [pickingMode, setPickingMode] = useState<PickingMode>('single');
  const [scannerMode, setScannerMode] = useState<ScannerMode>('hardware');
  const [selectedTask, setSelectedTask] = useState<PickingTask | null>(null);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [screenFlash, setScreenFlash] = useState<'success' | 'error' | null>(null);
  const [tasks, setTasks] = useState<PickingTask[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.getProducts().then(setProducts).catch(console.error);
  }, []);

  useEffect(() => {
    setTasksLoading(true);
    api.getPickingTasks(pickingMode)
      .then(setTasks)
      .catch(console.error)
      .finally(() => setTasksLoading(false));
  }, [pickingMode]);

  // Refocus input if using hardware scanner
  useEffect(() => {
    if (selectedTask && scannerMode === 'hardware' && inputRef.current) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [selectedTask, scannerMode, successMsg, errorMsg]);

  // Handle mode changes: deselect
  useEffect(() => {
    setSelectedTask(null);
    setErrorMsg('');
    setSuccessMsg('');
  }, [pickingMode]);

  const triggerIndicator = (type: 'success' | 'error') => {
    playSound(type);
    setScreenFlash(type);
    setTimeout(() => setScreenFlash(null), 800);
  };

  const handleScanValue = async (val: string) => {
    if (!selectedTask) return;
    setErrorMsg('');
    setSuccessMsg('');
    const scannedCode = val.trim();

    try {
      const result = await api.scanBarcode({
        mode: pickingMode,
        taskId: selectedTask.id,
        barcode: scannedCode,
        orderId: selectedTask.items.find((i) => i.productId === scannedCode)?.orderId as string | undefined,
      });

      if (!result.success) {
        triggerIndicator('error');
        setErrorMsg(result.message);
        setBarcodeInput('');
        return;
      }

      triggerIndicator('success');
      if (result.task) setSelectedTask(result.task);
      setTasks(await api.getPickingTasks(pickingMode));
      setSuccessMsg(result.message);
      setBarcodeInput('');
    } catch {
      triggerIndicator('error');
      setErrorMsg('Error de conexión con el servidor.');
      setBarcodeInput('');
    }
  };

  const handleManualScan = (e: React.FormEvent) => {
    e.preventDefault();
    handleScanValue(barcodeInput);
  };

  const getProductInfo = (id: string) => products.find(p => String(p.id) === id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto h-[calc(100vh-4rem)] flex flex-col"
    >
      <header className="mb-6 flex flex-col gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Estación de Picking</h2>
          <p className="text-slate-500 mt-1">Lector de código de barras, cámara móvil y modalidades de recolección.</p>
        </div>
        
        {/* Picking Modes & Scanner Toggles */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-3 rounded-xl shadow-sm border border-slate-200">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            <button onClick={() => setPickingMode('single')} className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${pickingMode === 'single' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
              <Box className="w-4 h-4" /> Single
            </button>
            <button onClick={() => setPickingMode('batch')} className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${pickingMode === 'batch' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
              <Layers className="w-4 h-4" /> Batch
            </button>
            <button onClick={() => setPickingMode('zone')} className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${pickingMode === 'zone' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
              <Map className="w-4 h-4" /> Zone
            </button>
            <button onClick={() => setPickingMode('wave')} className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${pickingMode === 'wave' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
              <CalendarClock className="w-4 h-4" /> Wave
            </button>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setScannerMode('hardware')} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${scannerMode === 'hardware' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              <Keyboard className="w-4 h-4" /> Pistola / RFID
            </button>
            <button onClick={() => setScannerMode('camera')} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${scannerMode === 'camera' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              <Camera className="w-4 h-4" /> Cámara Móvil
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        
        {/* Left Column - Task Selection */}
        <div className="lg:col-span-1 bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Tareas Pendientes</h3>
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full uppercase tracking-wider">{pickingMode} Mode</span>
          </div>
          <div className="flex-1 overflow-auto p-2">
            <div className="space-y-2">
              {tasksLoading && (
                <div className="flex justify-center p-8">
                  <div className="animate-spin w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent" />
                </div>
              )}
              {!tasksLoading && tasks.length === 0 && <div className="p-4 text-center text-slate-500">No hay tareas en este modo.</div>}
              {tasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => { setSelectedTask(task); setErrorMsg(''); setSuccessMsg(''); setBarcodeInput(''); }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedTask?.id === task.id 
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-900">{task.title}</span>
                    <span className="text-xs font-medium px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md shadow-sm">
                      {task.items.reduce((acc, curr) => acc + curr.quantity, 0)} un.
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">{task.subtitle}</span>
                    <ChevronRight className={`w-4 h-4 ${selectedTask?.id === task.id ? 'text-blue-500' : 'text-slate-400'}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Active Picking & Scanner */}
        <div className={`lg:col-span-2 bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col overflow-hidden relative transition-colors duration-500 ease-out ${
          screenFlash === 'success' ? 'ring-4 ring-emerald-500 bg-emerald-50' : 
          screenFlash === 'error' ? 'ring-4 ring-red-500 bg-red-50' : ''
        }`}>
          
          {!selectedTask ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <ScanBarcode className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-lg font-medium text-slate-900">Ninguna tarea seleccionada</p>
              <p className="max-w-sm mt-2">Selecciona una tarea de la lista para comenzar a escanear productos.</p>
            </div>
          ) : (
            <>
              {/* Active Task Header */}
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white shrink-0">
                <div>
                  <h3 className="text-lg font-bold">{selectedTask.title}</h3>
                </div>
                <div className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 flex items-center gap-2">
                  <span className="text-sm text-slate-400">Progreso:</span>
                  <span className="font-bold text-blue-400">
                    {selectedTask.items.reduce((acc, curr) => acc + curr.picked, 0)} / {selectedTask.items.reduce((acc, curr) => acc + curr.quantity, 0)}
                  </span>
                </div>
              </div>

              {/* Scanner Area */}
              <div className="p-4 border-b border-slate-100 bg-slate-50 shrink-0">
                {scannerMode === 'camera' ? (
                  <CameraScanner onScan={handleScanValue} />
                ) : (
                  <form onSubmit={handleManualScan} className="relative mt-2">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <ScanBarcode className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      ref={inputRef}
                      type="text"
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      placeholder="Listo para escáner hardware (o teclado)..."
                      className="w-full pl-12 pr-4 py-3 text-lg bg-white border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono shadow-inner"
                      autoFocus
                    />
                    <button type="submit" className="hidden">Escanear</button>
                  </form>
                )}

                <AnimatePresence mode="wait">
                  {errorMsg && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-3 font-medium text-sm"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      {errorMsg}
                    </motion.div>
                  )}
                  {successMsg && (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-4 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-3 font-medium text-sm"
                    >
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      {successMsg}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-auto p-4 bg-slate-50/50">
                <div className="space-y-3">
                  {selectedTask.items.map((item, idx) => {
                    const product = getProductInfo(item.productId);
                    const isComplete = item.picked >= item.quantity;
                    
                    return (
                      <div 
                        key={idx} 
                        className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                          isComplete ? 'bg-white border-emerald-200 opacity-75' : 'bg-white border-slate-200 shadow-sm'
                        }`}
                      >
                        <div className="flex gap-4 items-center">
                          <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center shrink-0 ${
                            isComplete ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {isComplete ? <PackageCheck className="w-6 h-6" /> : <span className="font-bold">{item.picked}</span>}
                            {!isComplete && <span className="text-[10px] uppercase font-bold text-slate-500">/{item.quantity}</span>}
                          </div>
                          <div>
                            <p className={`font-bold ${isComplete ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-900'}`}>{product?.name || 'Producto Desconocido'}</p>
                            <div className="flex flex-wrap gap-2 mt-1.5 text-xs font-mono">
                              <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{item.productId}</span>
                              <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-bold">Loc: {product?.location}</span>
                              {item.orderId && <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Ord: {item.orderId}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </motion.div>
  );
}
