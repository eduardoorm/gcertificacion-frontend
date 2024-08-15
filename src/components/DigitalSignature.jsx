import SignatureCanvas from 'react-signature-canvas';
import React, { useRef, useState, useEffect } from "react";
import './DigitalSignature.css';
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Box, Typography } from "@mui/material";

export const DigitalSignature = ({ idTrabajador, handleClose , title, description }) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const signatureRef = useRef({});
    const [imageData, setImageData] = useState("");
    const [error, setError] = useState(false);

    const saveSignature = (signature) => {
        const cleanedSignature = signature ? signature.replace("data:image/png;base64,", "") : "";
        setImageData(cleanedSignature);
    }

    let body = JSON.stringify({
        image: imageData,
        id_trabajador: idTrabajador,
    })

    return (
        <div>
            <Typography variant="h6" component="div" style={{ marginBottom: '3px' }}>
                {title}
            </Typography>
            <Typography variant="h8" component="div" style={{ marginBottom: '10px' }}>
                {description}
            </Typography>

            <SignatureCanvas ref={signatureRef} canvasProps={{
                height: 200,
                style: {
                    border: "1px solid", width: "100%", backgroundColor: "transparent"
                }
            }}
                onEnd={() => (
                    saveSignature(signatureRef.current.getTrimmedCanvas().toDataURL("image/jpg"))
                )}
                onBegin={() => { setError(false) }}
            />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    p: 1,
                    m: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                }}
            >
                <Button style={{ margin: '10px' }} variant="outlined" startIcon={<DeleteIcon />} onClick={() => {
                    signatureRef.current.clear();
                    saveSignature(null);
                }}> Borrar </Button>

                <Button variant="contained" endIcon={<SendIcon />} onClick={() => {
                    if (imageData === "") {
                        setError(true);
                    } else {
                        fetch(`${apiUrl}/trabajadores/signature`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `${JSON.parse(localStorage.getItem("token") || '{token: "", tokenType: ""}').tokenType} ${JSON.parse(localStorage.getItem("token") || '{token: "", tokenType: ""}').token}`
                            },
                            body: body
                        })
                            .then((response) => response.json())
                            .then((data) => {
                                handleClose(); // Solo cierra el modal aquí, cuando la respuesta es exitosa.
                            })
                            .catch((error) => {
                                console.error("Error:", error);
                            });
                    }
                }}> Guardar </Button>
            </Box>

            <pre>
                {
                    error ? <div>La firma es obligatoria</div> : false
                }
            </pre>
        </div>
    )
}