import React from 'react'
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CardContent from '@material-ui/core/CardContent';
import InputAdornment from '@material-ui/core/InputAdornment';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import Avatar from '@material-ui/core/Avatar';
import Initializer from '../../../store/Initializer'

import { LocalizationTable, TableIcons, removeAccent } from '../../../utils/table.js'
import MaterialTable from "material-table";
import { Grid } from '@material-ui/core';
import { abrirEvento, obtenerEventoAbierto, obtenerTodos } from '../../../utils/API/events';
import Crear from './componentes/Crear'
import Eliminar from './componentes/Eliminar'
import Filtro from './componentes/Filtro'
import { Alert, Autocomplete } from '@material-ui/lab';

export default function Sistemas(props) {
    const initializer = React.useContext(Initializer);

    const [data, setData] = React.useState([])
    const [open, setOpen] = React.useState(false)
    const [open2, setOpen2] = React.useState(false)
    const [selected, setSelected] = React.useState(null)
    const [selected2, setSelected2] = React.useState(null)
    const [openFilter, setOpenFilter] = React.useState(false)

    const [event, setEvent] = React.useState("")
    const [eventData, setEventData] = React.useState([])
    const [currentEvent, setCurrentEvent] = React.useState(null)

    React.useEffect(() => {
        if (initializer.usuario != null) {
            obtenerTodos(setEventData, initializer)
            obtenerEventoAbierto(setCurrentEvent, initializer)

        }
    }, [initializer.usuario])
    const carga = () => {
        obtenerTodos(setEventData, initializer)
        obtenerEventoAbierto(setCurrentEvent, initializer)
        setSelected(null)
        setSelected2(null)
    }
    
    const getName = (id, data) => {
        let object = null
        data.map((e) => {
            if (id == e.id) {
                object = { ...e }
            }
        })
        return object
    }
    const confirmar=()=>{
        if(event==""){
            initializer.mostrarNotificacion({ type: "warning", message:'Elija una competencia para continuar'});
            return
        }
        abrirEvento(event, initializer, carga)
    }
    return (
        <Grid container spacing={2}>
            <Crear sistema={selected} setSelected={setSelected} setOpen={setOpen} open={open} carga={carga} />
            <Eliminar sistema={selected2} setOpen={setOpen2} open={open2} carga={carga} />
            <Filtro setOpen={setOpenFilter} open={openFilter} />

            <Grid item xs={12} md={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" >
                    Competencia
                </Typography>

            </Grid>

            <Grid item xs={12} md={12}>
                <Card >
                    <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                            Iniciar competencia
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12} >
                                <Alert severity="info">Al iniciar una competencia se cerrará la que esté abierta. (Competencia actual abierta: <span style={{fontWeight:'bold'}}>{currentEvent!=null?currentEvent.name:'Ninguna'}</span>) </Alert>
                            </Grid>

                            <Grid item xs={12} md={12} >
                                <Autocomplete
                                    size="small"
                                    style={{ width: '100%' }}
                                    options={eventData}
                                    value={getName(event, eventData)}
                                    getOptionLabel={(option) => option.name +( option.is_open?(" - " + "Abierta"):"")}
                                    onChange={(event, value) => {
                                        if (value != null) {
                                            setEvent(value.id)
                                        } else {
                                            setEvent('')
                                        }
                                    }}
                                    renderInput={params => (
                                        <TextField {...params} label="Seleccione una competencia" variant="outlined" fullWidth />
                                    )}
                                />

                            </Grid>
                            <Grid item xs={12} md={12} >
                                <Button variant="contained" color="primary" onClick={confirmar}>
                                    Iniciar competencia
                                </Button>
                                </Grid>
                            
                        </Grid>
                    </CardContent>
                </Card>


            </Grid>
        </Grid>
    )
}
