import React from 'react';

interface PdfViewerProps {
  url: string;
  height?: string;
  width?: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ 
  url,
  height = '800px',
  width = '100%'
}) => {
  return (
    <div className="pdf-viewer-container" style={{ width, height }}>
      <iframe 
        src={url}
        title="PDF Viewer"
        width="100%"
        height="100%"
        style={{
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
        }}
        allowFullScreen
      />
    </div>
  );
};

export default PdfViewer; 