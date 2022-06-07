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
import { Avatar, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select } from '@material-ui/core';
import { editar, registrar } from '../../../../utils/API/category';
import { obtenerTodos as obtenerZonas } from '../../../../utils/API/zones';
import { Autocomplete } from '@material-ui/lab';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function Crear(props) {
    const initializer = React.useContext(Initializer);

    const [nombre, setNombre] = React.useState("")
    const [genero, setGenero] = React.useState("")

    React.useEffect(() => {
        if (props.sistema != null) {
            setNombre(props.sistema.name)
            setGenero(props.sistema.genre)
        }
    }, [props.sistema])
    const guardar = () => {
        let data = {
            'name': nombre,
            'genre': genero,
        }
        if (props.sistema == null) {
            registrar(data, initializer,limpiar)
 
        } else {
            editar(props.sistema.id, data, initializer,limpiar)
        

        }
        props.setOpen(false)
        props.carga()
    }
    const limpiar = () => {
        vaciar()
        props.setSelected(null)
        props.carga()
    }
    const vaciar = () => {
        setNombre("")
        setGenero("")
        props.setSelected(null)
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
            <DialogTitle id="alert-dialog-slide-title">Categorías</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {props.sistema != null ? "Formulario de edición de categorías" : "Formulario de creación de categorías"}
                </DialogContentText>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            style={{ width: '100%' }}
                            label="Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={12} style={{ display: 'flex' }}>
                        <FormControl variant="outlined" style={{width:'100%'}}>
                            <InputLabel id="demo-simple-select-outlined-label">Género</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={genero}
                                onChange={(e) => setGenero(e.target.value)}
                                label="Género"
                            >
                                <MenuItem value="">
                                    <em>Selecciona un género</em>
                                </MenuItem>
                                <MenuItem value={'masculino'}>Masculino</MenuItem>
                                <MenuItem value={'femenino'}>Femenino</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    props.setOpen(false)
                    vaciar()
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
