import { useState, useCallback } from 'react';

interface DroppedFile {
  name: string;
  size: number;
  type: string;
  preview?: string;
}

export function DragDropFiles() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<DroppedFile[]>([]);

  const processFiles = useCallback((fileList: FileList) => {
    Array.from(fileList).forEach(file => {
      const entry: DroppedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
      };

      // For images, generate a preview URL using FileReader
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        // readAsDataURL encodes the file as a base64 data URL
        reader.readAsDataURL(file);
        reader.onload = () => {
          setFiles(prev => [...prev, { ...entry, preview: reader.result as string }]);
        };
      } else {
        setFiles(prev => [...prev, entry]);
      }
    });
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // required to allow drop
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); // prevent browser from opening the file
    setIsDragOver(false);

    // e.dataTransfer.files contains the dropped files
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Drag and Drop — File Drop Zone</h3>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragOver ? '#4299e1' : '#cbd5e0'}`,
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          background: isDragOver ? '#ebf8ff' : '#fafafa',
          transition: 'all 0.2s',
          cursor: 'pointer',
          marginTop: '0.5rem',
        }}
      >
        {isDragOver ? 'Drop files here' : 'Drag files here'}
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <strong>{files.length} file(s)</strong>
            <button onClick={() => setFiles([])} style={{ fontSize: '0.8rem' }}>Clear</button>
          </div>
          {files.map((file, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderBottom: '1px solid #eee' }}>
              {file.preview
                ? <img src={file.preview} alt={file.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                : <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>doc</div>
              }
              <div>
                <div style={{ fontWeight: 500 }}>{file.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>{file.type || 'unknown'} — {formatBytes(file.size)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
