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
import { editar , registrar } from '../../../../utils/API/participantes';
import { obtenerTodos as obtenerCategorias } from '../../../../utils/API/category';
import { obtenerTodos as obtenerBoxes } from '../../../../utils/API/boxes';
import { obtenerTodos as obtenerCompetencias } from '../../../../utils/API/events';

import { Autocomplete } from '@material-ui/lab';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function Crear(props) {
    const initializer = React.useContext(Initializer);

    const [nombre, setNombre] = React.useState("")
    const [apellido, setApellido] = React.useState("")
    const [categoria, setCategoria] = React.useState("")
    const [categoriaData, setCategoriaData] = React.useState([])
    const [box, setBox] = React.useState("")
    const [boxData, setBoxData] = React.useState([])
    const [competencia, setCompetencia] = React.useState("")
    const [competenciaData, setCompetenciaData] = React.useState([])


    React.useEffect(() => {
        if (initializer.usuario != null) {
            obtenerCategorias(setCategoriaData, initializer)
            obtenerBoxes(setBoxData, initializer)
            obtenerCompetencias(setCompetenciaData, initializer)
        }

    }, [initializer.usuario])
    React.useEffect(() => {
        if (props.sistema != null) {
            setNombre(props.sistema.people.names)
            setApellido(props.sistema.people.last_names)
            setCategoria(props.sistema.categories.id)
            setBox(props.sistema.boxes.id)
            setCompetencia(props.sistema.events.id)
        }
    }, [props.sistema])
    const guardar = () => {
        let data = {
            'names': nombre,
            'last_names': apellido,
            'category_id': categoria,
            'box_id': box,
            'event_id': competencia
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
        setApellido("")
        setCategoria("")
        setBox("")
        setCompetencia("")
        props.setSelected(null)
    }
    const getName = (id,data) => {
        let object = null
        data.map((e) => {
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
            <DialogTitle id="alert-dialog-slide-title">Participantes</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {props.sistema != null ? "Formulario de edición de participantes" : "Formulario de creación de participantes"}
                </DialogContentText>

                <Grid container spacing={2}>
                    <Grid item xs={12}>    <TextField
                        variant="outlined"
                        style={{ width: '100%' }}

                        label="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}

                    /></Grid>
     <Grid item xs={12}>    <TextField
                        variant="outlined"
                        style={{ width: '100%' }}

                        label="Apellido"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}

                    /></Grid>

                    <Grid item xs={12} md={12} style={{ display: 'flex' }}>
                        <Autocomplete
                            style={{ width: '100%' }}
                            options={categoriaData}
                            value={getName(categoria,categoriaData)}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, value) => {
                                if (value != null) {
                                    setCategoria(value.id)
                                } else {
                                    setCategoria('')
                                }
                            }} // prints the selected value
                            renderInput={params => (
                                <TextField {...params} label="Seleccione una categoría" variant="outlined" fullWidth />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={12} style={{ display: 'flex' }}>
                        <Autocomplete

                            style={{ width: '100%' }}
                            options={boxData}
                            value={getName(box,boxData)}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, value) => {
                                if (value != null) {
                                    setBox(value.id)
                                } else {
                                    setBox('')
                                }
                            }} // prints the selected value
                            renderInput={params => (
                                <TextField {...params} label="Seleccione un box" variant="outlined" fullWidth />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={12} style={{ display: 'flex' }}>
                        <Autocomplete

                            style={{ width: '100%' }}
                            options={competenciaData}
                            value={getName(competencia,competenciaData)}
                            getOptionLabel={(option) => option.name +( option.is_open?(" - " + "Abierta"):"")}
                            onChange={(event, value) => {
                                if (value != null) {
                                    setCompetencia(value.id)
                                } else {
                                    setCompetencia('')
                                }
                            }} // prints the selected value
                            renderInput={params => (
                                <TextField {...params} label="Seleccione una competencia" variant="outlined" fullWidth />
                            )}
                        />
                    </Grid>

                </Grid>

            </DialogContent>
            <DialogActions>
                <Button onClick={() => 
                {
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
