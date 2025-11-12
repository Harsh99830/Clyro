import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight, Close } from "@mui/icons-material";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

export default function EventDetail({ sidebarOpen, toggleSidebar }) {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const { card } = location.state || {};

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (selectedImageIndex === null) return;
    
    if (e.key === 'Escape') {
      setSelectedImageIndex(null);
      document.body.style.overflow = 'auto';
    } else if (e.key === 'ArrowRight') {
      setSelectedImageIndex((prev) => (prev + 1) % images.length);
    } else if (e.key === 'ArrowLeft') {
      setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  }, [selectedImageIndex, images.length]);

  // Add/remove event listener for keyboard navigation
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Fetch images when component mounts
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images?folder=${eventId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        if (data.success) {
          setImages(data.images);
        }
      } catch (err) {
        console.error('Error fetching images:', err);
        setError('Failed to load images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchImages();
    }
    
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, [eventId]);

  // Scroll lock for mobile/small screens
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // cleanup
    };
  }, [sidebarOpen]);

  if (!card && !eventId) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6" color="textSecondary">
          No event selected. Please go back and select an event.
        </Typography>
      </Box>
    );
  }

  // Move the loading check after all hooks
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }


  const openImage = (index) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  // Helper to check if media is a video
  const isVideo = (image) => {
    const url = image?.url || '';
    if (!url) return false;
    if (image?.mime && typeof image.mime === 'string' && image.mime.startsWith('video')) return true;
    return /\.(mp4|webm|ogg)(\?|$)/i.test(url);
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

      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar toggleSidebar={toggleSidebar} />
      </div>
      <div className="fixed top-16 left-0 bottom-0 z-40">
        <Sidebar isOpen={sidebarOpen} />
      </div>
      
      <div className={`pt-16 transition-all duration-300 relative z-10 ${
        sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'
      }`}>
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
            <span className="font-medium text-white">Back to Events</span>
          </button>

          <div className="rounded-xl shadow-sm p-6 md:p-8 mb-8 ">
            <h1 className="text-3xl font-bold text-white text-center mb-8 tracking-tight">
              {card?.name || eventId}
            </h1>

            {images.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Typography variant="h6" color="textSecondary">
                  No images found for this event.
                </Typography>
              </Box>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 px-4">
                {images.map((image, index) => {
                  const mediaIsVideo = isVideo(image);

                  return (
                    <div
                      key={index}
                      className="group relative mb-6 break-inside-avoid bg-gray-700/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-700/50 cursor-pointer"
                      onClick={() => window.open(image.url, '_blank', 'noopener,noreferrer')}
                    >
                      <div className="relative w-full h-full">
                        {mediaIsVideo ? (
                          <div className="relative">
                            <video
                              src={image.url}
                              className="w-full h-auto max-w-full block group-hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                              loading="lazy"
                              muted
                              playsInline
                              preload="metadata"
                              onClick={(e) => {
                                e.stopPropagation();
                                openImage(index);
                              }}
                              onError={(e) => {
                                const parent = e.target.parentNode;
                                if (parent) {
                                  parent.innerHTML = '<img src="https://via.placeholder.com/400?text=Media+Not+Available" alt="Unavailable" class="w-full h-auto" />';
                                }
                              }}
                              style={{ maxHeight: '80vh' }}
                            />

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
                            src={image.url}
                            alt={`${card?.name || 'Event'} - ${index + 1}`}
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
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Overlay */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <IconButton
            onClick={closeImage}
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            size="large"
          >
            <Close />
          </IconButton>
          
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('prev');
            }}
            className="absolute left-4 text-white hover:bg-white/10"
            size="large"
          >
            <ChevronLeft style={{ fontSize: '2.5rem' }} />
          </IconButton>
          
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            {isVideo(images[selectedImageIndex]) ? (
              <video
                src={images[selectedImageIndex]?.url}
                controls
                autoPlay
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={images[selectedImageIndex]?.url}
                alt={`${card?.name || 'Event'} - ${selectedImageIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </div>
          
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('next');
            }}
            className="absolute right-4 text-white hover:bg-white/10"
            size="large"
          >
            <ChevronRight style={{ fontSize: '2.5rem' }} />
          </IconButton>
        </div>
      )}
    </div>
  );
}