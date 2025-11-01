import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { DriveFolderUpload } from '@mui/icons-material';

const GoogleDriveUpload = ({ open, onClose, onUpload, folderName }) => {
  const [driveLink, setDriveLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const extractFolderId = (url) => {
    try {
      // Handle different Google Drive URL formats
      const match = url.match(/[\w-]{25,}/);
      return match ? match[0] : null;
    } catch (err) {
      console.error('Error extracting folder ID:', err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!driveLink) {
      setError('Please enter a Google Drive folder link');
      return;
    }

    const folderId = extractFolderId(driveLink);
    if (!folderId) {
      setError('Invalid Google Drive folder link');
      return;
    }

    try {
      setIsLoading(true);
      // Here you would typically make an API call to your backend
      // to handle the Google Drive integration
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/drive/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folderId,
          targetFolder: folderName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload from Google Drive');
      }

      const data = await response.json();
      onUpload(data);
      onClose();
    } catch (err) {
      console.error('Google Drive upload error:', err);
      setError(err.message || 'An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <DriveFolderUpload color="primary" />
            <Typography variant="h6">Upload from Google Drive</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <TextField
              autoFocus
              margin="dense"
              label="Google Drive Folder Link"
              type="url"
              fullWidth
              variant="outlined"
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/YOUR_FOLDER_ID"
              disabled={isLoading}
              helperText="Paste the link to your Google Drive folder"
            />
            {error && (
              <Typography color="error" variant="body2" mt={1}>
                {error}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading || !driveLink}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default GoogleDriveUpload;
