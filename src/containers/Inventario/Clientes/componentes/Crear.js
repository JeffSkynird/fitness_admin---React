import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Initializer from '../../../../store/Initializer'
import AutorenewIcon from '@material-ui/icons/Autorenew';
import Slide from '@material-ui/core/Slide';
import { Avatar, Grid, IconButton, InputAdornment } from '@material-ui/core';
import { editar as editarBodega, registrar as registrarBodega } from '../../../../utils/API/clientes';
import { obtenerTodos as obtenerZonas } from '../../../../utils/API/zones';
import { Autocomplete } from '@material-ui/lab';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function Crear(props) {
    const initializer = React.useContext(Initializer);

    const [nombre, setNombre] = React.useState("")
    const [documento, setDocumento] = React.useState("")
    const [direccion, setDireccion] = React.useState("")
    const [celular, setCelular] = React.useState("")
    const [correo, setCorreo] = React.useState("")
    const [telefono, setTelefono] = React.useState("")
    const [jpcode, setJpcode] = React.useState("")
    const [supplierCode, setSupplirCode] = React.useState("")
    const [serie, setSerie] = React.useState("")
    const [zone, setZone] = React.useState("")
    const [zoneData, setZoneData] = React.useState([])
    const [image, setImage] = React.useState("")

    const [stock, setStock] = React.useState("")
    const [stockMin, setStockMin] = React.useState("")
    const [stockMax, setStockMax] = React.useState("")

    const [descripcion, setDescripcion] = React.useState("")
    React.useEffect(() => {
        if (initializer.usuario != null) {

        obtenerZonas(setZoneData,initializer)
        }
  
}, [initializer.usuario])
    React.useEffect(()=>{
        if(props.sistema!=null){
            setNombre(props.sistema.names)
            setDocumento(props.sistema.document)
            setDireccion(props.sistema.address)
            setCelular(props.sistema.cellphone)
            setCorreo(props.sistema.email)
            setTelefono(props.sistema.landline)

        }
    },[props.sistema])
    const guardar=()=>{
        let data={ 
        'names': nombre,
        'document': documento,
        'address': direccion,
        'cellphone': celular,
        'email': correo,
        'landline': telefono}
        if(props.sistema==null){
            registrarBodega(data,initializer,limpiar)
          
        }else{
            editarBodega(props.sistema.id,data,initializer,limpiar)

        }
        props.setOpen(false)
        props.carga()
    }
    const limpiar=()=>{
        setNombre("")
        setDocumento("")
        setDireccion("")
        setCelular("")
        setCorreo("")
        setTelefono("")
        props.setSelected(null)
        props.carga()
    }
    const getName = (id) => {
        let object = null
        zoneData.map((e) => {
            if (id == e.id) {
                object = { ...e }
            }
        })
        return object
    }
    return (
        <Dialog
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => {
                props.setOpen(false)
                limpiar()
            }}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">Clientes</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                   {props.sistema!=null?"Formulario de edición de clientes": "Formulario de creación de clientes"}
                </DialogContentText>
            
                <Grid container spacing={2}>
            
    <Grid item xs={12}>    <TextField
                        variant="outlined"
                        style={{ width:'100%' }}
                      
                        label="Cédula/RUC"
                        value={documento}
                        onChange={(e) => setDocumento(e.target.value)}

                    /></Grid>
                  
                    <Grid item xs={12}>    <TextField
                        variant="outlined"
                        style={{ width:'100%' }}
                      
                        label="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}

                    /></Grid>
                  
                  <Grid item xs={12}>    <TextField
                        variant="outlined"
                        style={{ width:'100%' }}
                      
                        label="Dirección"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}

                    /></Grid>
                      <Grid item xs={12}>    <TextField
                        variant="outlined"
                        style={{ width:'100%' }}
                        type="number"
                        label="Celular"
                        value={celular}
                        onChange={(e) => setCelular(e.target.value)}

                    /></Grid>
                      <Grid item xs={12}>    <TextField
                        variant="outlined"
                        style={{ width:'100%' }}
                        type="number"
                        label="Teléfono fijo"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}

                    /></Grid>
                   
                   <Grid item xs={12}>    <TextField
                        variant="outlined"
                        style={{ width:'100%' }}
                      
                        label="Correo"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}

                    /></Grid>


                </Grid>

            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.setOpen(false)} color="default">
                    Cancelar
                </Button>
                <Button color="primary" onClick={guardar}>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
