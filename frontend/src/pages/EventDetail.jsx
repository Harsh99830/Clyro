import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";

// Create a context for global mute state
const MuteContext = createContext();

// Provider component
const MuteProvider = ({ children }) => {
  const [isGlobalMuted, setIsGlobalMuted] = useState(true);
  
  const toggleGlobalMute = useCallback((e) => {
    if (e) e.stopPropagation();
    setIsGlobalMuted(prev => !prev);
  }, []);

  return (
    <MuteContext.Provider value={{ isGlobalMuted, toggleGlobalMute }}>
      {children}
    </MuteContext.Provider>
  );
};

// Custom hook to use mute context
const useMute = () => {
  const context = useContext(MuteContext);
  if (!context) {
    throw new Error('useMute must be used within a MuteProvider');
  }
  return context;
};
import { useParams, useNavigate, useLocation } from "react-router-dom";

// Custom hook for intersection observer
const useInView = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);
  const { root = null, rootMargin = '0px', threshold = 0.1 } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [root, rootMargin, threshold]);

  return [ref, isIntersecting];
};
import { Box, CircularProgress, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight, Close, GridView, ViewColumn } from "@mui/icons-material";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

// The main component that will be exported by default
function EventDetailWithMuteProvider() {
  return (
    <MuteProvider>
      <EventDetail />
    </MuteProvider>
  );
}

export default EventDetailWithMuteProvider;

function EventDetail({ sidebarOpen, toggleSidebar }) {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isSingleColumn, setIsSingleColumn] = useState(false);
  const { card } = location.state || {};
  const { isGlobalMuted, toggleGlobalMute } = useMute();

  // Render the header with mute toggle and title
  const renderHeader = () => (
    <div className="flex items-center gap-4">
      <button 
        onClick={toggleGlobalMute}
        className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
        aria-label={isGlobalMuted ? 'Unmute all videos' : 'Mute all videos'}
      >
        {isGlobalMuted ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2 2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6l7.5 7.5-7.5 7.5V6z" />
          </svg>
        )}
      </button>
      <h1 className="text-2xl font-bold text-white tracking-tight">
        {card?.name || eventId}
      </h1>
    </div>
  );

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

  // Video component for grid and single column views
  const VideoPlayer = ({ src, className }) => {
    const videoRef = useRef(null);
    const { isGlobalMuted, toggleGlobalMute } = useMute();
    const [isHovered, setIsHovered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [inView, setInView] = useState(false);
    
    // Set up intersection observer for single column view
    useEffect(() => {
      if (!isSingleColumn) return;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          setInView(entry.isIntersecting);
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {});
          } else {
            videoRef.current?.pause();
          }
        },
        {
          threshold: 0.8,
          rootMargin: '0px 0px -50px 0px'
        }
      );
      
      const currentRef = videoRef.current;
      if (currentRef) {
        observer.observe(currentRef);
      }
      
      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }, [isSingleColumn]);

    // Handle play/pause in single column view, open in new tab in grid view
    const handleVideoClick = (e) => {
      if (isSingleColumn) {
        e.preventDefault();
        e.stopPropagation();
        if (videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
        }
      } else {
        e.preventDefault();
        e.stopPropagation();
        window.open(src, '_blank');
      }
    };

    // Update isPlaying state when video is paused/played through other means (like autoplay)
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);

      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      };
    }, []);

    return (
      <div 
        className="relative w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleVideoClick}
      >
        <video
          ref={videoRef}
          src={src}
          className={className}
          loop
          muted={!isSingleColumn || isGlobalMuted} // Mute in grid view or when globally muted
          playsInline
          preload="metadata"
        />
        {/* Play/Pause indicator in center */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200 ${isSingleColumn && isPlaying ? 'opacity-0' : 'opacity-100'}`}>
          <div className="bg-black/50 rounded-full p-3">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              {!isSingleColumn || videoRef.current?.paused ? (
                <path d="M8 5v14l11-7z" />
              ) : (
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              )}
            </svg>
          </div>
        </div>
        
        {/* Mute button - visible in single column view */}
        {isSingleColumn && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleGlobalMute(e);
            }}
            className={`absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white transition-opacity duration-200 ${isHovered || isPlaying ? 'opacity-100' : 'opacity-0'}`}
            aria-label={isGlobalMuted ? 'Unmute' : 'Mute'}
          >
            {isGlobalMuted ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2 2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6l7.5 7.5-7.5 7.5V6z" />
              </svg>
            )}
          </button>
        )}
        
        {/* Out of view overlay for single column */}
        {!inView && isSingleColumn && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>
    );
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

          <div className="rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
              {renderHeader()}
              <div className="flex items-center gap-1 bg-gray-700/50 p-0.5 rounded-md">
                <button
                  onClick={() => setIsSingleColumn(false)}
                  className={`p-2 rounded-md transition-colors ${!isSingleColumn ? 'bg-gray-600' : 'hover:bg-gray-600/50'}`}
                  title="Grid View"
                >
                  <GridView className={`w-5 h-5 ${!isSingleColumn ? 'text-white' : 'text-gray-400'}`} />
                </button>
                <button
                  onClick={() => setIsSingleColumn(true)}
                  className={`p-2 rounded-md transition-colors ${isSingleColumn ? 'bg-gray-600' : 'hover:bg-gray-600/50'}`}
                  title="Single Column View"
                >
                  <ViewColumn className={`w-5 h-5 ${isSingleColumn ? 'text-white' : 'text-gray-400'}`} />
                </button>
              </div>
            </div>

            {images.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Typography variant="h6" color="textSecondary">
                  No images found for this event.
                </Typography>
              </Box>
            ) : (
              <div className={`${isSingleColumn ? 'max-w-sm mx-auto space-y-2' : 'columns-1 sm:columns-2 lg:columns-3 gap-4'} px-2`}>
                {images.map((image, index) => {
                  const mediaIsVideo = isVideo(image);

                  return (
                    <div
                      key={index}
                      className={`group relative ${isSingleColumn ? 'w-full' : 'break-inside-avoid'} ${isSingleColumn ? 'mb-2' : 'mb-4'} bg-gray-700/50 ${isSingleColumn ? 'rounded-sm' : 'rounded-lg'} overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-700/50 cursor-pointer`}
                    >
                      <div className="relative w-full h-full">
                        {mediaIsVideo ? (
                          <div className="relative w-full">
                            <VideoPlayer 
                              src={image.url}
                              className="w-full h-auto max-w-full block"
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
                              style={{ maxHeight: '360px', width: '100%', objectFit: 'cover', display: 'block' }}
                            />

                          </div>
                        ) : (
                          <img
                            src={image.url}
                            alt={`${card?.name || 'Event'} - ${index + 1}`}
                            className="w-full h-auto max-w-full block"
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