import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

const EditFolderDialog = ({ 
  open, 
  onClose, 
  folder, 
  onSave 
}) => {
  const [folderName, setFolderName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (folder) {
      setFolderName(folder.name || '');
      setError('');
    }
  }, [folder]);

  const handleSubmit = async () => {
    if (!folderName.trim()) {
      setError('Folder name cannot be empty');
      return;
    }

    if (folderName === folder.name) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSave(folderName);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update folder name');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(145deg, #1e1e2f, #2d2d44)',
          color: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
        }
      }}
    >
      <DialogTitle sx={{
        fontSize: '1.5rem',
        fontWeight: 600,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        pb: 2,
        mb: 2
      }}>
        Rename Folder
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="folder-name"
          label="Folder Name"
          type="text"
          fullWidth
          variant="outlined"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          error={!!error}
          helperText={error}
          disabled={isSubmitting}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          InputProps={{
            sx: {
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#9c27b0',
              },
            },
          }}
          InputLabelProps={{
            sx: {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: '#9c27b0',
              },
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ 
        px: 3, 
        py: 2, 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)' 
      }}>
        <Button 
          onClick={onClose}
          disabled={isSubmitting}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || !folderName.trim() || folderName === folder?.name}
          variant="contained"
          sx={{
            backgroundColor: '#9c27b0',
            color: 'white',
            '&:hover': {
              backgroundColor: '#8e24aa',
            },
            '&:disabled': {
              backgroundColor: 'rgba(156, 39, 176, 0.5)',
              color: 'rgba(255, 255, 255, 0.5)'
            },
            px: 3,
            py: 1,
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFolderDialog;
