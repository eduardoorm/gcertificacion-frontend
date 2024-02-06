import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material';

export interface ConfirmationDialogRawProps {
    title: string;
    message: string;
    open: boolean;
    onClose: (accepted: boolean) => void;
}

export default function ConfirmationDialog(props: ConfirmationDialogRawProps) {
    const { onClose, title, message, open, ...other } = props;
    
    const handleCancel = () => {
        onClose(false);
    };

    const handleOk = () => {
        onClose(true);
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth="xs"
            open={ open }
            {...other}
        >
            <DialogTitle>{ title }</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body2" gutterBottom>
                    { message }
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>Cancelar</Button>
                <Button autoFocus variant="contained" onClick={handleOk}>Continuar</Button>
          </DialogActions>
        </Dialog>
    );
}
