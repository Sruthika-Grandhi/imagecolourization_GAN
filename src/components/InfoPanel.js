/**
 * InfoPanel Component
 * 
 * Educational panel that explains the deep learning concepts
 * behind image colourisation. This provides context for the
 * college project demonstration.
 * 
 * Topics Covered:
 * - CNN-based colourisation
 * - Autoencoder architecture
 * - How the simulation works
 */

import React from 'react';

/**
 * InfoPanel - Educational content about deep learning colourisation
 */
function InfoPanel() {
  return (
    <section className="info-section">
      <h2>
        {/* Book/Info Icon */}
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
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" 
          />
        </svg>
        Deep Learning Concepts
      </h2>

      <div className="info-grid">
        {/* CNN Architecture Card */}
        <div className="info-card">
          <h4>🧠 CNN Architecture</h4>
          <p>
            In a real implementation, image colourisation uses <strong>Convolutional Neural Networks (CNNs)</strong> 
            to automatically learn color features from millions of images. The network learns to map grayscale 
            intensity values to appropriate color outputs.
          </p>
          <ul>
            <li>Input: Grayscale image (L channel)</li>
            <li>Process: Feature extraction via convolutions</li>
            <li>Output: AB color channels</li>
          </ul>
        </div>

        {/* Autoencoder Card */}
        <div className="info-card">
          <h4>🔄 Autoencoder Structure</h4>
          <p>
            The colourisation model typically uses an <strong>autoencoder architecture</strong> with:
          </p>
          <ul>
            <li><strong>Encoder:</strong> Extracts features from grayscale input</li>
            <li><strong>Bottleneck:</strong> Compressed representation of features</li>
            <li><strong>Decoder:</strong> Reconstructs color information</li>
            <li><strong>Skip connections:</strong> Preserve spatial details (U-Net style)</li>
          </ul>
        </div>

        {/* This Simulation Card */}
        <div className="info-card">
          <h4>💻 This Simulation</h4>
          <p>
            Since this is a frontend-only demo without a backend, we <strong>simulate</strong> the 
            colourisation process using:
          </p>
          <ul>
            <li>Canvas API for pixel manipulation</li>
            <li>Luminance-based color mapping</li>
            <li>Spatial variation for realism</li>
            <li>Smoothing pass for natural output</li>
          </ul>
          <p style={{ marginTop: '0.75rem', fontStyle: 'italic', fontSize: '0.85rem' }}>
            In production, you would use TensorFlow.js or a Python backend with PyTorch/TensorFlow.
          </p>
        </div>

        {/* Dataset Card */}
        <div className="info-card">
          <h4>📊 Training Data</h4>
          <p>
            Real colourisation models are trained on large datasets like:
          </p>
          <ul>
            <li>ImageNet (1.2M+ images)</li>
            <li>CIFAR-10/100</li>
            <li>Custom datasets with color images</li>
          </ul>
          <p style={{ marginTop: '0.75rem' }}>
            The network learns <strong>color priors</strong> - for example, 
            that sky tends to be blue and grass tends to be green.
          </p>
        </div>
      </div>
    </section>
  );
}

export default InfoPanel;
