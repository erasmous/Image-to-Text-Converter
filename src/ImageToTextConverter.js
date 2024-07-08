// src/ImageToTextConverter.js
import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';

const ImageToTextConverter = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState('eng');

  const handleImageUpload = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (let item of items) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        setSelectedImage(blob);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  const convertImageToText = () => {
    if (selectedImage) {
      setIsProcessing(true);
      Tesseract.recognize(
        selectedImage,
        language,
        {
          logger: (m) => console.log(m),
        }
      ).then(({ data: { text } }) => {
        setText(text);
        setIsProcessing(false);
      });
    }
  };

  const clearState = () => {
    setSelectedImage(null);
    setText('');
    setIsProcessing(false);
  };

  return (
    <div className="container">
      <h1>Image to Text Converter</h1>
      <p className="instructions">
        Upload an image or paste an image from your clipboard (Ctrl+V or Cmd+V) to convert it to text.
      </p>
      <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />
      <select onChange={(e) => setLanguage(e.target.value)} value={language} className="language-select">
        <option value="eng">English</option>
        <option value="fra">French</option>
      </select>
      <div className="buttons">
        <button onClick={convertImageToText} disabled={!selectedImage || isProcessing}>
          {isProcessing ? 'Processing...' : 'Convert to Text'}
        </button>
        <button onClick={clearState} disabled={isProcessing}>
          Clear
        </button>
      </div>
      {text && (
        <div>
          <h2>Extracted Text:</h2>
          <div className="extracted-text">
            <p>{text}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageToTextConverter;
