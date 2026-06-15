import { useEffect } from 'react';
import { useAmbassadorStore } from '@/store/ambassador.store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ambassadorId: string;
}

export function QRCodeDialog({
  open,
  onOpenChange,
  ambassadorId,
}: QRCodeDialogProps) {
  const { qrCodeData, generateQRCode, clearQRCode, isLoading } = useAmbassadorStore();

  useEffect(() => {
    if (open && ambassadorId) {
      generateQRCode(ambassadorId);
    }
    return () => {
      if (!open) {
        clearQRCode();
      }
    };
  }, [open, ambassadorId, generateQRCode, clearQRCode]);

  const handleDownload = () => {
    if (!qrCodeData) return;
    const link = document.createElement('a');
    link.href = qrCodeData.qrCode;
    link.download = `qrcode-${qrCodeData.ambassadorName.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('✅ QR Code téléchargé');
  };

  const handleCopyUrl = () => {
    if (!qrCodeData) return;
    navigator.clipboard.writeText(qrCodeData.referralUrl);
    toast.success('✅ URL de parrainage copiée');
  };

  const handleOpenUrl = () => {
    if (!qrCodeData) return;
    window.open(qrCodeData.referralUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-[#070b18] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white sm:max-w-md px-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white text-xl">QR Code de parrainage</DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            {qrCodeData
              ? `Code pour ${qrCodeData.ambassadorName}`
              : 'Génération du QR code...'}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-gray-500 dark:text-gray-400"></div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Génération en cours...</p>
            </div>
          </div>
        ) : qrCodeData ? (
          <div className="space-y-4 pb-4">
            {/* QR Code */}
            <div className="flex justify-center">
              <div className="rounded-lg bg-white p-4 shadow-lg">
                <img
                  src={qrCodeData.qrCode}
                  alt="QR Code"
                  className="w-64 h-64"
                />
              </div>
            </div>

            {/* URL de parrainage */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-white">
                URL de parrainage
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={qrCodeData.referralUrl}
                  readOnly
                  className="flex-1 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 px-3 py-2 text-sm text-gray-900 dark:text-white"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCopyUrl}
                  className="gap-2 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <Copy className="w-4 h-4" />
                  Copier
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleOpenUrl}
                  className="border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleDownload} className="flex-1 gap-2">
                <Download className="w-4 h-4" />
                Télécharger QR Code
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Fermer
              </Button>
            </div>

            {/* Info */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Partagez ce QR code avec l'ambassadeur pour qu'il puisse parrainer de
              nouvelles organisations
            </p>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">
            Erreur lors de la génération du QR code
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}