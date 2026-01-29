import React, { useRef, useState } from 'react';
import { CloudUpload, UploadFile, Cloud } from '@mui/icons-material';
import { 
  Button, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  CircularProgress
} from '@mui/material';

const UploadButton = ({ folderName, onUploadSuccess }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDriveDialog, setShowDriveDialog] = useState(false);
  const fileInputRef = useRef(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeviceUpload = () => {
    fileInputRef.current?.click();
    handleClose();
  };

  const handleGoogleDriveUpload = () => {
    handleClose();
    setShowDriveDialog(true);
  };

  const handleDriveUploadSuccess = (data) => {
    if (onUploadSuccess) {
      onUploadSuccess(data);
    }
    setShowDriveDialog(false);
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    if (folderName) {
      formData.append('folder', folderName);
    }
    files.forEach(file => {
      formData.append('file', file);
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload files');
      }

      if (onUploadSuccess) {
        onUploadSuccess(data);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      // You might want to show an error toast here
    } finally {
      setIsUploading(false);
      event.target.value = ''; // Reset file input
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
        onClick={handleClick}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleDeviceUpload}>
          <ListItemIcon>
            <UploadFile fontSize="small" />
          </ListItemIcon>
          <ListItemText>From Device</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleGoogleDriveUpload}>
          <ListItemIcon>
            <Cloud fontSize="small" />
          </ListItemIcon>
          <ListItemText>Google Drive</ListItemText>
        </MenuItem>
      </Menu>

      <GoogleDriveUpload
        open={showDriveDialog}
        onClose={() => setShowDriveDialog(false)}
        onUpload={handleDriveUploadSuccess}
        folderName={folderName}
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        multiple
      />
    </>
  );
};

export default UploadButton;
