'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// PDF.js worker'ını yerel olarak yapılandır
pdfjs.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry');

export default function PDFViewer({ file }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setError(null);
  }

  function onDocumentLoadError(error) {
    console.error('PDF yükleme hatası:', error);
    setError('PDF dosyası yüklenemedi. Lütfen daha sonra tekrar deneyin.');
  }

  const goToPrevPage = () => {
    setPageNumber(pageNumber - 1);
  };

  const goToNextPage = () => {
    setPageNumber(pageNumber + 1);
  };

  const zoomIn = () => {
    setScale(scale + 0.1);
  };

  const zoomOut = () => {
    setScale(scale - 0.1);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Önceki
        </button>
        <span className="text-amber-700">
          Sayfa {pageNumber} / {numPages || '...'}
        </span>
        <button
          onClick={goToNextPage}
          disabled={pageNumber >= (numPages || 1)}
          className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sonraki
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded"
          >
            -
          </button>
          <span className="text-amber-700">{(scale * 100).toFixed(0)}%</span>
          <button
            onClick={zoomIn}
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded"
          >
            +
          </button>
        </div>
      </div>

      <div className="border border-amber-200 rounded-lg overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center justify-center p-8 text-amber-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-center">{error}</p>
          </div>
        ) : (
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="max-w-full"
            />
          </Document>
        )}
      </div>
    </div>
  );
} 