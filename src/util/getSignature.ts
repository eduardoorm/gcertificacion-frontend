export async function tieneFirma(idTrabajador: string) {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
        const response = await fetch(`${apiUrl}/trabajadores/signature/${idTrabajador}`, {
            headers: {
                "Authorization": `${JSON.parse(localStorage.getItem("token") || '{token: "", tokenType: ""}').tokenType} ${JSON.parse(localStorage.getItem("token") || '{token: "", tokenType: ""}').token}`
            },
        });
        const firma = await response.json();
        return firma.data != null;

    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}


