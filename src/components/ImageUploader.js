/**
 * ImageUploader Component
 * 
 * This component provides a file upload interface for users to select
 * grayscale/black-and-white images for colourisation.
 * 
 * Features:
 * - Drag and drop support
 * - File type validation
 * - Accessible design
 */

import React, { useRef } from 'react';

/**
 * ImageUploader - Handles file input for grayscale images
 * 
 * @param {Function} onUpload - Callback function when file is selected
 * @param {boolean} disabled - Whether the uploader is disabled
 */
function ImageUploader({ onUpload, disabled }) {
  const fileInputRef = useRef(null);

  /**
   * Handle file selection
   * Validates that the file is an image
   */
 const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Please select an image file (JPEG, PNG, etc.)');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    alert('File size must be less than 10MB');
    return;
  }

  const reader = new FileReader();

  reader.onloadend = () => {
    onUpload(reader.result);   // ✅ SEND BASE64 STRING
  };

  reader.readAsDataURL(file);  // ✅ CONVERT FILE
};

  /**
   * Handle drag over event
   * Necessary for drag and drop functionality
   */
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  /**
   * Handle drop event
   * Processes dropped files
   */
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      const reader = new FileReader();

reader.onloadend = () => {
  onUpload(reader.result);
};

reader.readAsDataURL(file);
    }
  };

  return (
    <div className="file-input-wrapper">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input"
        disabled={disabled}
        aria-label="Upload grayscale image"
      />
      
      <div 
        className="file-input-label"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{ opacity: disabled ? 0.5 : 1 }}
      >
        {/* Upload Icon SVG */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" 
          />
        </svg>
        
        <p>Click to upload or drag and drop</p>
        <span>Supports: JPEG, PNG, WebP (Max 10MB)</span>
      </div>
    </div>
  );
}

export default ImageUploader;
