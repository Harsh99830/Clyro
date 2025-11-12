import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography, CircularProgress, Button, Checkbox } from '@mui/material';
import { ChevronLeft, ChevronRight, Close, SelectAll, Delete, Download } from '@mui/icons-material';
import UploadButton from '../components/UploadButton';

const FolderView = () => {
  const { folderName } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [isUploading, setIsUploading] = useState(false);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
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
  }, [folderName]);

  useEffect(() => {
    if (folderName) {
      fetchImages();
    } else {
      setLoading(false);
      setError('No folder specified');
    }
  }, [folderName, fetchImages]);

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

  // Helper to check if media is a video
  const isVideo = (image) => {
    const url = getImageUrl(image) || '';
    if (!url) return false;
    if (image.mime && typeof image.mime === 'string' && image.mime.startsWith('video')) return true;
    return /\.(mp4|webm|ogg)(\?|$)/i.test(url);
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
    if (selectionMode) {
      toggleImageSelection(index);
    } else {
      setSelectedImageIndex(index);
    }
  };

  const toggleImageSelection = (index) => {
    setSelectedImages(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(index)) {
        newSelection.delete(index);
      } else {
        newSelection.add(index);
      }
      return newSelection;
    });
  };

  const toggleSelectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(Array.from({ length: images.length }, (_, i) => i)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedImages.size === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedImages.size} selected image(s)?`)) {
      return;
    }

    try {
      // Create an array of delete promises
      const deletePromises = Array.from(selectedImages).map(async (index) => {
        const image = images[index];
        const imageKey = image.Key || image.name;
        
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key: imageKey,
            folder: folderName
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete image');
        }
        
        return index; // Return the index of the successfully deleted image
      });

      // Wait for all delete operations to complete
      const deletedIndices = await Promise.all(deletePromises);
      
      // Update the UI by removing the deleted images
      setImages(prevImages => 
        prevImages.filter((_, index) => !selectedImages.has(index))
      );
      
      // Show success message
      toast.success(`Successfully deleted ${deletedIndices.length} image(s)`);
      
    } catch (error) {
      console.error('Error deleting images:', error);
      toast.error(error.message || 'Failed to delete images');
    } finally {
      // Reset selection mode
      setSelectionMode(false);
      setSelectedImages(new Set());
    }
  };

  const handleDownloadSelected = () => {
    // Add your download logic here
    console.log('Downloading selected images:', Array.from(selectedImages).map(i => images[i]));
  };

  const handleCancelSelection = () => {
    setSelectionMode(false);
    setSelectedImages(new Set());
  };

  const handleUploadSuccess = () => {
    // Refresh the images list after successful upload
    fetchImages();
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
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => selectionMode ? handleCancelSelection() : navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
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
              <span className="font-medium text-white">
                {selectionMode ? 'Cancel' : 'Back to Folders'}
              </span>
            </button>
            
            <div className="flex items-center gap-2">
              {selectionMode ? (
                <>
                  <span className="text-white mr-4">
                    {selectedImages.size} selected
                  </span>
                  <button
                    onClick={toggleSelectAll}
                    className="flex items-center gap-1 px-3 py-1.5 text-white border border-gray-600 hover:bg-gray-700 rounded-md transition-colors text-sm"
                  >
                    {selectedImages.size === images.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm"
                    title="Delete selected"
                  >
                    <Delete fontSize="small" />
                    <span>Delete</span>
                  </button>
                  <button
                    onClick={handleCancelSelection}
                    className="ml-2 text-gray-300 hover:text-white"
                    title="Cancel selection"
                  >
                    <Close fontSize="small" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectionMode(true)}
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-md transition-colors border border-gray-600 hover:bg-gray-700"
                  >
                    <SelectAll />
                    <span>Select</span>
                  </button>
                  <UploadButton 
                    folderName={folderName}
                    onUploadSuccess={handleUploadSuccess}
                  />
                </div>
              )}
            </div>
          </div>

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
                  const mediaIsVideo = isVideo(image);

                  return (
                    <div
                      key={image.Key || image.url || index}
                      className="group relative mb-6 break-inside-avoid bg-gray-700/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-700/50 cursor-pointer"
                    >
                      <div className="relative w-full h-full">
                        {selectionMode && (
                          <div className="absolute top-2 left-2 z-10">
                            <Checkbox
                              checked={selectedImages.has(index)}
                              onChange={() => toggleImageSelection(index)}
                              onClick={(e) => e.stopPropagation()}
                              sx={{
                                color: 'white',
                                '&.Mui-checked': {
                                  color: '#3b82f6',
                                },
                                padding: '4px',
                                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                borderRadius: '4px',
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                },
                              }}
                            />
                          </div>
                        )}
                        {imageUrl ? (
                          <div className={`transition-opacity ${selectedImages.has(index) ? 'opacity-70' : 'opacity-100'}`}>
                            {mediaIsVideo ? (
                              <div className="relative">
                                <video
                                  src={imageUrl}
                                  className={`w-full h-auto max-w-full block group-hover:scale-105 transition-all duration-300 ${
                                    selectionMode ? 'cursor-pointer' : 'cursor-zoom-in'
                                  }`}
                                  loading="lazy"
                                  muted
                                  playsInline
                                  preload="metadata"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openImage(index);
                                  }}
                                  onError={(e) => {
                                    // replace video with placeholder image element
                                    const parent = e.target.parentNode;
                                    if (parent) {
                                      parent.innerHTML = '<img src="https://via.placeholder.com/400?text=Media+Not+Available" alt="Unavailable" class="w-full h-auto" />';
                                    }
                                  }}
                                  style={{
                                    maxHeight: '360px',
                                    width: '100%',
                                    objectFit: 'cover',
                                    border: selectedImages.has(index) ? '2px solid #3b82f6' : 'none',
                                    borderRadius: selectedImages.has(index) ? '4px' : '0',
                                    display: 'block'
                                  }}
                                />

                                {/* Play icon overlay — centered, non-interactive so clicks go to the video */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="bg-black/50 rounded-full p-3">
                                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <img
                                src={imageUrl}
                                alt={imageName}
                                className={`w-full h-auto max-w-full block group-hover:scale-105 transition-all duration-300 ${
                                  selectionMode ? 'cursor-pointer' : 'cursor-zoom-in'
                                }`}
                                loading="lazy"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openImage(index);
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Available';
                                }}
                                style={{
                                  maxHeight: '80vh',
                                  border: selectedImages.has(index) ? '2px solid #3b82f6' : 'none',
                                  borderRadius: selectedImages.has(index) ? '4px' : '0'
                                }}
                              />
                            )}
                          </div>
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
            {isVideo(images[selectedImageIndex]) ? (
              <video
                src={getImageUrl(images[selectedImageIndex])}
                controls
                autoPlay
                className="max-h-[80vh] max-w-full object-contain"
              />
            ) : (
              <img
                src={getImageUrl(images[selectedImageIndex])}
                alt={`${selectedImageIndex + 1} of ${images.length}`}
                className="max-h-[80vh] max-w-full object-contain"
              />
            )}
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
