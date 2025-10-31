import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography, CircularProgress } from '@mui/material';
import { ChevronLeft, ChevronRight, Close } from '@mui/icons-material';

const FolderView = () => {
  const { folderName } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/images?folder=${encodeURIComponent(folderName)}`
        );
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch images');
        }
        
        // Ensure we have a valid array of images
        const validImages = Array.isArray(data.images) 
          ? data.images.filter(img => img && (img.Key || img.url))
          : [];
          
        setImages(validImages);
        setError(null);
      } catch (err) {
        console.error('Error fetching images:', err);
        setError(err.message || 'Failed to load images');
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    if (folderName) {
      fetchImages();
    } else {
      setLoading(false);
      setError('No folder specified');
    }
  }, [folderName]);

  // Helper function to safely get the image name
  const getImageName = (image) => {
    if (!image) return 'Image';
    if (image.name) return image.name;
    if (image.Key) return image.Key.split('/').pop() || 'Image';
    if (image.url) return image.url.split('/').pop() || 'Image';
    return 'Image';
  };

  // Helper function to get the image URL
  const getImageUrl = (image) => {
    if (image.url) return image.url;
    if (image.Key) return `https://clyro-media.harshagrawal.workers.dev/${image.Key}`;
    return '';
  };

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (selectedImageIndex === null) return;
    
    if (e.key === 'Escape') {
      closeImage();
    } else if (e.key === 'ArrowRight') {
      navigateImage('next');
    } else if (e.key === 'ArrowLeft') {
      navigateImage('prev');
    }
  }, [selectedImageIndex, images.length]);

  // Add/remove event listener for keyboard navigation
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const openImage = (index) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeImage = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction) => {
    if (direction === 'next') {
      setSelectedImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 relative overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-stripes.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/30"></div>
      </div>

      <div className="pt-16 relative z-10">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
          >
            <svg
              className="w-5 h-5 text-white transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="font-medium text-white">Back to Folders</span>
          </button>

          <div className="rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h1 className="text-3xl font-bold text-white text-center mb-8 tracking-tight">
              {folderName ? decodeURIComponent(folderName) : 'Folder'}
            </h1>

            {images.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Typography variant="h6" color="textSecondary">
                  No images found in this folder.
                </Typography>
              </Box>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 px-4">
                {images.map((image, index) => {
                  const imageUrl = getImageUrl(image);
                  const imageName = getImageName(image);
                  
                  return (
                    <div
                      key={image.Key || image.url || index}
                      className="group relative mb-6 break-inside-avoid bg-gray-700/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-700/50 cursor-pointer"
                    >
                      <div className="relative w-full h-full">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={imageName}
                            className="w-full h-auto max-w-full block group-hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                            loading="lazy"
                            onClick={(e) => {
                              e.stopPropagation();
                              openImage(index);
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Available';
                            }}
                            style={{ maxHeight: '80vh' }}
                          />
                        ) : (
                          <div className="w-full h-64 bg-gray-700/50 flex items-center justify-center">
                            <span className="text-gray-400">No preview available</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-white text-sm truncate">{imageName}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {selectedImageIndex !== null && images[selectedImageIndex] && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeImage}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <Close style={{ fontSize: 32 }} />
          </button>
          
          <button
            onClick={() => navigateImage('prev')}
            className="absolute left-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            <ChevronLeft style={{ fontSize: 40 }} />
          </button>
          
          <div className="max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <img
              src={getImageUrl(images[selectedImageIndex])}
              alt={`${selectedImageIndex + 1} of ${images.length}`}
              className="max-h-[80vh] max-w-full object-contain"
            />
          </div>
          
          <button
            onClick={() => navigateImage('next')}
            className="absolute right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            <ChevronRight style={{ fontSize: 40 }} />
          </button>
          
          <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
            {selectedImageIndex + 1} of {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderView;
