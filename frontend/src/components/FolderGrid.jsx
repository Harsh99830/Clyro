import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Grid, Container, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FolderGrid = ({ onCardClick }) => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [folderImages, setFolderImages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        // Fetch folders
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/folders`);
        const data = await response.json();
        
        if (data.success) {
          setFolders(data.folders);
          
          // Fetch first image for each folder
          const images = {};
          for (const folder of data.folders) {
            try {
              const imgResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images?folder=${encodeURIComponent(folder.name)}&limit=1`);
              const imgData = await imgResponse.json();
              
              if (imgData.success && imgData.images.length > 0) {
                images[folder.name] = imgData.images[0].url;
              }
            } catch (error) {
              console.error(`Error fetching images for folder ${folder.name}:`, error);
            }
          }
          
          setFolderImages(images);
        }
      } catch (error) {
        console.error('Error fetching folders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8, px: { xs: 2, sm: 3, md: 4 } }}>
      <Grid container spacing={4}>
        {folders.map((folder, index) => (
          <Grid item key={folder.path} xs={12} sm={6} md={4} lg={3}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.2s ease-in-out',
               
                cursor: 'pointer'
              }}
              onClick={() => onCardClick ? onCardClick(folder) : navigate(`/event/${encodeURIComponent(folder.name)}`)}
            >
              <Box sx={{
                position: 'relative',
                width: '300px',
                height: '400px',
                minHeight: '300px',
                overflow: 'hidden'
              }}>
                <CardMedia
                  component="img"
                  image={folderImages[folder.name] || `https://source.unsplash.com/random/600x600/?event,${index}`}
                  alt={folder.name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transition: 'transform 0.5s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://source.unsplash.com/random/600x600/?event,${index}`;
                  }}
                />
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 2,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                  color: 'white',
                  zIndex: 2
                }}>
                <Typography 
                  variant="subtitle1" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 600,
                    mb: 0.5,
                    color: 'white',
                    textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                  }}
                >
                  {folder.name}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 1,
                  pt: 1,
                  borderTop: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    {new Date().toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'white',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    View Gallery →
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
);
};

export default FolderGrid;
