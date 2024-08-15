import React from 'react'
import { DigitalSignature } from '../DigitalSignature';
import { Box, Modal } from '@mui/material';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  boxShadow: 24,
  border: "none",
  p: 4,
};

const ModalSignature = ({hasSignature,handleClose, idTrabajador}) => {
  return (
    <div>
      <Modal
      open={hasSignature}
      onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
              handleClose();
          }
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      >
      <Box sx={style}>
          <DigitalSignature 
          title="Firma Digital" 
          description= "Es importante que registres tu firma para la emisión de las constancias" 
          idTrabajador={idTrabajador} 
          handleClose={handleClose} />
      </Box>
      </Modal>    
    </div>
  )
}

export default ModalSignature