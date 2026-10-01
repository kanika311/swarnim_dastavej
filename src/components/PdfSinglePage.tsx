'use client';

import React, { useEffect, useRef, useState } from 'react';

type PdfSinglePageProps = {
  url: string;
  pageNumber: number;
  onPageCount?: (count: number) => void;
};

export default function PdfSinglePage({ url, pageNumber, onPageCount }: PdfSinglePageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let renderTask: { cancel: () => void; promise: Promise<void> } | null = null;

    setFailed(false);

    (async () => {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      const doc = await pdfjs.getDocument({ url, disableRange: true }).promise;
      if (cancelled) return;
      onPageCount?.(doc.numPages);
      const safePage = Math.min(Math.max(pageNumber, 1), doc.numPages);
      const page = await doc.getPage(safePage);
      const canvas = canvasRef.current;
      if (!canvas || cancelled) return;
      const base = page.getViewport({ scale: 1 });
      const box = canvas.parentElement?.getBoundingClientRect();
      const fit = box && box.width > 0 && box.height > 0
        ? Math.min(box.width / base.width, box.height / base.height)
        : 1.2;
      const viewport = page.getViewport({ scale: Math.max(fit, 0.4) });
      const context = canvas.getContext('2d');
      if (!context) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      renderTask = page.render({ canvasContext: context, viewport });
      await renderTask.promise;
    })().catch(() => {
      if (!cancelled) setFailed(true);
    });

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [url, pageNumber, onPageCount]);

  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 p-4 text-center">
        यह पेज अभी नहीं खुल सका।
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden bg-white flex items-center justify-center">
      <canvas ref={canvasRef} className="max-w-full max-h-full" />
    </div>
  );
}
