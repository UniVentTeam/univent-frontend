import React, { useState } from "react";
import { X, AlertCircle } from 'lucide-react';

interface RejectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    loading: boolean;
}

export const RejectionModal = ({ isOpen, onClose, onConfirm, loading }: RejectionModalProps) => {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!reason.trim()) {
            setError("Te rugăm să introduci un motiv valid.");
            return;
        }
        onConfirm(reason);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Respinge Eveniment</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <p className="text-sm text-gray-500 mb-4">
                        Te rugăm să specifici motivul respingerii. Acesta va fi comunicat organizatorului.
                    </p>

                    <textarea
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            setError("");
                        }}
                        autoFocus
                        placeholder="Ex: Descrierea nu este completă sau imaginile nu respectă regulamentul..."
                        className="w-full h-32 p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none mb-2"
                    />

                    {error && (
                        <p className="text-red-500 text-xs mb-4 font-medium">{error}</p>
                    )}

                    <div className="flex gap-3 justify-end mt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition text-sm"
                            disabled={loading}
                        >
                            Anulează
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-6 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition shadow-lg shadow-red-200 text-sm disabled:opacity-70 disabled:cursor-wait"
                        >
                            {loading ? 'Se procesează...' : 'Confirmă Respingerea'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
