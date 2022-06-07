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
import { Avatar, Checkbox, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, ListItemText, MenuItem, Select } from '@material-ui/core';
import { obtenerTodos as obtenerUnidades } from '../../../../utils/API/unidades';
import { Autocomplete } from '@material-ui/lab';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { asignarPermiso, crearRol, editarRol, obtenerPermisos, obtenerPermisosRol } from '../../../../utils/API/roles';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
export default function Crear(props) {
    const initializer = React.useContext(Initializer);

    const [nombre, setNombre] = React.useState("")
    const [permisoData, setPermisoData] = React.useState([])
    const [permiso, setPermiso] = React.useState("")
    const [permisos, setPermisos] = React.useState([]);
    const [personName, setPersonName] = React.useState([]);

    React.useEffect(()=>{
     
        if(initializer.usuario!=null){
            obtenerPermisos(setPermisos,initializer);
        }
  

    

},[initializer.usuario])
    React.useEffect(() => {
        if (props.sistema != null) {
            setNombre(props.sistema.name)
            obtenerPermisosRol(props.sistema.name,setPersonName,initializer)

        }
    }, [props.sistema])
    
    const handleChange = (event) => {
        setPersonName(event.target.value);
      };
    const asignarP = () => {
   
        asignarPermiso({
            permisos:personName,
            rol: nombre,
            
        }, initializer)
    }
    const guardar = () => {
        let data = {
            'nombre': nombre,
        }
        if (props.sistema == null) {
            crearRol(data, initializer,asignarP,limpiar)
            
           
        } else {
            editarRol({
                id:props.sistema.id,
                rol: props.sistema.name,
                name: nombre,
                
            },   asignarP, initializer,limpiar);
         
    
         

        }
        props.setOpen(false)

    }
    const limpiar = () => {
        setNombre('')
     setPersonName([])
        props.setSelected(null)
        props.carga()
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
            <DialogTitle id="alert-dialog-slide-title">Roles</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {props.sistema != null ? "Formulario de edición de roles" : "Formulario de creación de roles"}
                </DialogContentText>

                <Grid container spacing={2}>
                    <Grid item xs={12}>    <TextField
                        variant="outlined"
                        style={{ width: '100%' }}

                        label="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}

                    /></Grid>

                    <Grid item md={12} xs={12}>
                        <FormControl variant="outlined" style={{ width: '100%' }}>
                            <InputLabel id="demo-mutiple-checkbox-label">Seleccione los permisos</InputLabel>
                            <Select
                            variant="outlined"
                                labelId="demo-mutiple-checkbox-label"
                                id="demo-mutiple-checkbox"
                                multiple
                                value={personName}
                                onChange={handleChange}
                                input={<Input  />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {permisos.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={personName.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>



                </Grid>



            </DialogContent>
            <DialogActions>
                <Button onClick={() => {props.setOpen(false)
                limpiar()
                }} color="default">
                    Cancelar
                </Button>
                <Button color="primary" onClick={guardar}>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
