import { useState, useCallback } from 'react';
import './DragDropUpload.css';

function DragDropUpload({ onFileSelect, accept = 'image/*', maxSize = 5242880 }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize) {
      setError(`File too large. Max size: ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
      return false;
    }

    // Check file type
    const acceptTypes = accept.split(',').map(t => t.trim());
    const fileType = file.type;
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    
    const isValid = acceptTypes.some(type => {
      if (type.includes('*')) {
        return fileType.startsWith(type.split('/')[0]);
      }
      return fileType === type || fileExt === type;
    });

    if (!isValid) {
      setError(`Invalid file type. Accepted: ${accept}`);
      return false;
    }

    return true;
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError('');

    const files = [...e.dataTransfer.files];
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect, maxSize, accept]);

  const handleFileInput = (e) => {
    setError('');
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  return (
    <div className="drag-drop-upload">
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="drop-zone-content">
          <div className="drop-icon">📁</div>
          <p className="drop-text">
            {isDragging ? (
              <strong>Drop file here</strong>
            ) : (
              <>
                <strong>Drag & drop</strong> your file here
              </>
            )}
          </p>
          <p className="drop-or">or</p>
          <label className="file-input-label">
            <input
              type="file"
              onChange={handleFileInput}
              accept={accept}
              className="file-input"
            />
            <span className="browse-button">Browse Files</span>
          </label>
          <p className="drop-hint">
            Max size: {(maxSize / 1024 / 1024).toFixed(1)}MB
          </p>
        </div>
      </div>
      {error && (
        <div className="upload-error">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

export default DragDropUpload;
