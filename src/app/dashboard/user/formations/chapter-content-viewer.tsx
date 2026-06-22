'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Minus, Plus, Download, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { BlockNoteEditor } from '@/components/blocknote-editor';
import { cn } from '@/lib/utils';
import { apiService } from '@/app/services/api.service';
import { useTranslation } from 'react-i18next';

const PDF_ENDPOINT = (chapterId: string) =>
  `/formations/chapters/${chapterId}/pdf`;

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface ChapterContentViewerProps {
  content?: string;
  chapterId: string;
  pdfUrl?: string | null;
}

const ZOOM_MIN = 50;
const ZOOM_MAX = 200;
const ZOOM_STEP = 10;

export function ChapterContentViewer({ content, chapterId, pdfUrl }: ChapterContentViewerProps) {
  const { t: tCommon } = useTranslation('common');
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(700);

  const containerRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  // refs pour chaque page PDF afin de pouvoir y scroller et tracker la page visible
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const zoomOut = () => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP));
  const zoomIn = () => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP));

  // Scroll vers une page spécifique
  const scrollToPage = (page: number) => {
    const el = pageRefs.current[page - 1];
    if (el && pdfContainerRef.current) {
      pdfContainerRef.current.scrollTo({ top: el.offsetTop - 16, behavior: 'smooth' });
    }
  };

  const prevPage = () => { if (currentPage > 1) scrollToPage(currentPage - 1); };
  const nextPage = () => { if (currentPage < numPages) scrollToPage(currentPage + 1); };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(console.error);
    } else {
      document.exitFullscreen?.();
    }
  };

  // Mesure la largeur du conteneur
  const measureWidth = useCallback(() => {
    if (pdfContainerRef.current) {
      setContainerWidth(pdfContainerRef.current.clientWidth - 48);
    }
  }, []);

  useEffect(() => {
    measureWidth();
    const ro = new ResizeObserver(measureWidth);
    if (pdfContainerRef.current) ro.observe(pdfContainerRef.current);
    return () => ro.disconnect();
  }, [measureWidth]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) document.exitFullscreen?.();
      if (!pdfUrl) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') prevPage();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, pdfUrl, numPages, currentPage]);

  // Track la page visible via IntersectionObserver
  useEffect(() => {
    if (!numPages || !pdfContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // La page avec le plus grand ratio d'intersection devient la page courante
        let maxRatio = 0;
        let visiblePage = currentPage;
        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            const idx = pageRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) visiblePage = idx + 1;
          }
        });
        if (maxRatio > 0) setCurrentPage(visiblePage);
      },
      { root: pdfContainerRef.current, threshold: [0.25, 0.5, 0.75] }
    );

    pageRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [numPages]);

  // Fetch le PDF via axios (auth géré automatiquement) → blob URL local
  useEffect(() => {
    if (!pdfUrl) {
      setPdfBlobUrl(null);
      return;
    }

    let objectUrl: string;
    setNumPages(0);
    setCurrentPage(1);
    setPdfBlobUrl(null);

    apiService
      .get<Blob>(PDF_ENDPOINT(chapterId), undefined, { responseType: 'blob' })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setPdfBlobUrl(objectUrl);
      })
      .catch((err) => console.error('PDF fetch error:', err));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [chapterId, pdfUrl]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
    pageRefs.current = new Array(numPages).fill(null);
  };

  const pageScale = zoom / 100;

  return (
    <div
      ref={containerRef}
      className={cn(
        'rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] overflow-hidden',
        isFullscreen && 'fixed inset-0 z-50 rounded-none border-0 bg-white dark:bg-[#050816]'
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">Contenu</span>
        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
        {/* Navigation pages (PDF only) */}
        <div className="flex items-center gap-1.5">
          {pdfUrl ? (
            <>
              <button
                type="button"
                onClick={prevPage}
                disabled={currentPage <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title={tCommon('user.formations.prev_page')}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 min-w-[80px] justify-center">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentPage} / {numPages || '—'}
                </span>
              </div>
              <button
                type="button"
                onClick={nextPage}
                disabled={currentPage >= numPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Page suivante"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              title={tCommon('common.topbar.search_title')}
            >
              <Search className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Zoom + actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= ZOOM_MIN}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title={tCommon('user.formations.zoom_out')}
          >
            <Minus className="h-4 w-4" />
          </button>
          <div className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 min-w-[60px] text-center">
            <span className="text-sm font-medium text-gray-900 dark:text-white">{zoom}%</span>
          </div>
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= ZOOM_MAX}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Agrandir"
          >
            <Plus className="h-4 w-4" />
          </button>

          <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-1" />

          {pdfBlobUrl && (
            <button
              type="button"
              onClick={() => {
                const a = document.createElement('a');
                a.href = pdfBlobUrl;
                a.download = `chapitre-${chapterId}.pdf`;
                a.click();
              }}
              className="flex h-8 w-8 items-center justify-center rounded-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              title={tCommon('user.formations.download_pdf')}
            >
              <Download className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex h-8 w-8 items-center justify-center rounded-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            title={isFullscreen ? 'Quitter le plein écran' : tCommon('user.formations.fullscreen')}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Zone de contenu */}
      {pdfUrl ? (
        <div
          ref={pdfContainerRef}
          className={cn(
            'overflow-y-auto bg-gray-100 dark:bg-black/20',
            isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[70vh]'
          )}
        >
          <Document
            file={pdfBlobUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
                {tCommon('user.formations.loading_pdf')}
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center h-48 gap-2 text-gray-400 dark:text-gray-500 text-sm">
                <span>{tCommon('user.formations.pdf_error')}</span>
              </div>
            }
            className="flex flex-col items-center py-6 gap-4"
          >
            {/* Toutes les pages en scroll vertical */}
            {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
              <div
                key={pageNum}
                ref={(el) => { pageRefs.current[pageNum - 1] = el; }}
              >
                <Page
                  pageNumber={pageNum}
                  scale={pageScale}
                  width={containerWidth}
                  renderTextLayer
                  renderAnnotationLayer
                  className="shadow-lg"
                />
              </div>
            ))}
          </Document>
        </div>
      ) : (
        <div
          className={cn(
            'p-6 sm:p-10 bg-gray-50/30 dark:bg-black/10 overflow-x-auto',
            isFullscreen && 'h-[calc(100vh-120px)] p-10'
          )}
        >
          <div
            className="mx-auto origin-top transition-transform w-full"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            <BlockNoteEditor key={chapterId} initialContent={content || ''} editable={false} />
          </div>
        </div>
      )}

      {isFullscreen && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/50 text-white text-xs flex items-center gap-2 pointer-events-none">
          <span>{tCommon('user.formations.fullscreen')}</span>
          <span className="opacity-50">•</span>
          <span className="opacity-50">{tCommon('user.formations.esc_exit')}</span>
        </div>
      )}
    </div>
  );
}
