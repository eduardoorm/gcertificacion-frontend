import { Fragment } from "react"
import SignatureCanvas from 'react-signature-canvas';
import React, {  useRef,useState, useEffect  } from "react";
import Modal from 'react-modal';

export const DigitalSignature = () => {
    const signatureRef = useRef({});
    const [imageData, setImageData] = useState("");
    const [error, setError] = useState(false);


    const saveSignature = (signature) => {
        setImageData(signature);
      }
      useEffect(() => {
        console.log(imageData)
      },[imageData]);
    return(
        <Fragment>
            <SignatureCanvas ref={signatureRef} canvasProps={{ width: 500, height: 200, 
            style:{"border":"1px solid #000000", backgroundColor: "transparent"
            }}}
                onEnd={()=>(
                saveSignature(signatureRef.current.getTrimmedCanvas().toDataURL("image/jpg"))
                )}
                onBegin={() => {setError(false)}}
            />
            <button onClick={() => {
                signatureRef.current.clear();
                saveSignature(null);
            }}> Clear </button>

            <button onClick={() => {
                if(imageData === ""){
                    setError(true);
                }else{
                    fetch("http://localhost:8080/api/trabajadores/signature", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            signature: imageData,
                        }),
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
                }
            }}> Save </button>

            <pre>
            {
            error ? <div>La firma es obligatoria</div> : false
            }
            </pre>
        </Fragment>
    )
}