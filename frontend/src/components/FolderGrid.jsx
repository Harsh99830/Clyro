import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Card, 
  CardMedia, 
  Typography, 
  Grid, 
  Container, 
  CircularProgress, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditFolderDialog from '../Admin/EditFolderDialog';
import { toast } from 'react-toastify';

const FolderGrid = ({ onCardClick, isAdmin = false }) => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [folderImages, setFolderImages] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const navigate = useNavigate();

  const handleFolderClick = (folder) => {
    if (isAdmin) {
      navigate(`/admin/${encodeURIComponent(folder.name)}`);
    } else if (onCardClick) {
      onCardClick(folder);
    }
  };
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [deletingFolder, setDeletingFolder] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuOpen = (event, folder) => {
    event.stopPropagation();
    setSelectedFolder(folder);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    if (event) event.stopPropagation();
    setAnchorEl(null);
  };

  const handleSaveFolder = async (newName) => {
    if (!editingFolder) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/folders/${encodeURIComponent(editingFolder.name)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update folder');
      }
      
      // Update the local state to reflect the change
      setFolders(folders.map(folder => 
        folder.name === editingFolder.name 
          ? { ...folder, name: newName } 
          : folder
      ));
      
      return data;
    } catch (error) {
      console.error('Error updating folder:', error);
      throw error; // This will be caught by the dialog component
    }
  };

  const handleDeleteFolder = async () => {
    if (!deletingFolder) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/folders/${encodeURIComponent(deletingFolder.name)}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete folder');
      }
      
      // Update the local state to remove the deleted folder
      setFolders(folders.filter(folder => folder.name !== deletingFolder.name));
      setDeleteDialogOpen(false);
      toast.success('Folder deleted successfully');
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error(error.message || 'Failed to delete folder');
    }
  };

  const handleMenuAction = (action) => {
    handleMenuClose();
    
    if (action === 'edit') {
      setEditingFolder(selectedFolder);
    } else if (action === 'delete') {
      setDeletingFolder(selectedFolder);
      setDeleteDialogOpen(true);
    }
  };

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
    <>
    <Container maxWidth="lg" sx={{ py: 8, px: { xs: 2, sm: 3, md: 4 } }}>
      <Grid container spacing={10}>
        {folders.map((folder, index) => (
          <Grid item key={folder.path} xs={12} sm={6} md={4} lg={3}>
            <Card
              key={folder.name}
              sx={{
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 'inherit',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.6) 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  zIndex: 1,
                },
                '&:hover': {
                  transform: 'translateY(-8px) rotateX(5deg) rotateY(5deg)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 10px 20px rgba(0,0,0,0.2)',
                  '&:before': {
                    opacity: 1,
                  },
                  '& .card-content': {
                    transform: 'translateZ(20px)',
                  },
                },
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleFolderClick(folder);
              }}
            >
              <Box className="card-content" sx={{
                position: 'relative',
                width: '300px',
                height: '400px',
                minHeight: '300px',
                overflow: 'hidden',
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
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
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
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
                  top: 0,
                  left: 0,
                  right: 0,
                  p: 1,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  zIndex: 3,
                  transform: 'translateZ(15px)'
                }}>
                  {isAdmin && (
                    <IconButton 
                      size="small" 
                      onClick={(e) => handleMenuOpen(e, folder)}
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        }
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 2,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                  color: 'white',
                  zIndex: 2,
                  backdropFilter: 'blur(4px)',
                  transform: 'translateZ(10px)'
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
      
      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          elevation: 4,
          sx: {
            width: 180,
            borderRadius: 2,
            overflow: 'hidden',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Folder Dialog */}
      <EditFolderDialog
        open={!!editingFolder}
        onClose={() => setEditingFolder(null)}
        folder={editingFolder}
        onSave={handleSaveFolder}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Folder</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the folder "{deletingFolder?.name}"? 
            This action cannot be undone and will delete all files inside the folder.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteFolder} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FolderGrid;
