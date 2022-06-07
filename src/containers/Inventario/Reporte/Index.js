import React from 'react'
import Typography from '@material-ui/core/Typography';
import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import Avatar from '@material-ui/core/Avatar';
import Initializer from '../../../store/Initializer'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { LocalizationTable, TableIcons, removeAccent } from '../../../utils/table.js'
import MaterialTable from "material-table";
import { FormControlLabel, Grid, IconButton, Switch } from '@material-ui/core';
import { obtenerTodos } from '../../../utils/API/usuarios.js';
import Crear from './componentes/Crear'
import Eliminar from './componentes/Eliminar'
import Filtro from './componentes/Filtro'
import InputLabel from '@material-ui/core/InputLabel';
import FilterListIcon from '@material-ui/icons/FilterList';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import DateFnsUtils from '@date-io/date-fns';
import { utcDate } from '../../../utils/Date'
import PrintIcon from '@material-ui/icons/Print';
import {
    DatePicker,
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import es from 'date-fns/locale/es'
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import { downloadFiles, printTicket } from '../../../utils/API/reporte';
import { obtenerTodos as obtenerUsuarios } from '../../../utils/API/usuarios'
import { Autocomplete } from '@material-ui/lab';
export default function Sistemas(props) {
    const initializer = React.useContext(Initializer);
    const [tipo, setTipo] = React.useState("")
    const [desde, setDesde] = React.useState(null)
    const [hasta, setHasta] = React.useState(null)
    const [data, setData] = React.useState([])
    const [open, setOpen] = React.useState(false)
    const [barcode, setBarcode] = React.useState('')

    const [open2, setOpen2] = React.useState(false)
    const [selected, setSelected] = React.useState(null)
    const [selected2, setSelected2] = React.useState(null)
    const [openFilter, setOpenFilter] = React.useState(false)
    const [filtro, setFiltro] = React.useState('')
    const [filtros, setFiltros] = React.useState(false)
    const [user, setUser] = React.useState('')
    const [userData, setUserData] = React.useState([])
    const [ticket, setTicket] = React.useState(false)

    React.useEffect(() => {
        if (initializer.usuario != null) {
            obtenerTodos(setData, initializer)
            obtenerUsuarios(setUserData, initializer)
            setDesde(getFirst())
            setHasta(getLast())
        }
    }, [initializer.usuario])
    const getFirst = () => {
        let date = new Date();
        let primerDia = new Date(date.getFullYear(), date.getMonth(), 1);

        return primerDia
    }
    const getLast = () => {
        let date = new Date();

        let ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return ultimoDia
    }
    const carga = () => {
        obtenerTodos(setData, initializer)
        setSelected(null)
        setSelected2(null)
    }
    const total = () => {
        let tot = 0
        data.map((e) => {
            tot += e.evaluaciones
        })
        return tot
    }
    const reporte = () => {
        if (ticket) {
            printTicket(filtro, initializer)
        } else {
            let filter = []
            if (filtros) {
                filter = [{ tipo: "usuario", valor: user }, { tipo: "numero_factura", valor: filtro }, { tipo: "desde", valor: desde != null ? utcDate(desde) : "" }, { tipo: "hasta", valor: hasta != null ? utcDate(hasta) : "" }, { tipo: "codigo_barras", valor: barcode }]
            }
            downloadFiles(tipo, initializer, filter)
        }

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
    const limpiarCampos = () => {
        setBarcode("")
        setUser("")
        setFiltro("")
        setDesde(getFirst())
        setHasta(getLast())
        setTicket(false)
    }
    return (
        <Grid container spacing={2}>
            <Crear sistema={selected} setSelected={setSelected} setOpen={setOpen} open={open} carga={carga} />
            <Eliminar sistema={selected2} setOpen={setOpen2} open={open2} carga={carga} />
            <Filtro setOpen={setOpenFilter} open={openFilter} />

            <Grid item xs={12} md={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" >
                    Reporte
                </Typography>

            </Grid>
            <Grid item xs={12} md={12}>

                <Grid xs={12} md={12}>
                    <Card >
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <FormControl variant="outlined" style={{ width: '100%' }} >
                                        <InputLabel id="demo-simple-select-outlined-label" style={{ width: '100%' }} >Seleccione el reporte</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={tipo}

                                            style={{ width: '100%' }}
                                            onChange={(e) => {
                                                setTipo(e.target.value)
                                                setFiltro("")
                                                limpiarCampos()
                                            }}
                                            label="Seleccione el reporte"
                                        >
                                            <MenuItem value="">
                                                <em>Seleccione una opción</em>
                                            </MenuItem>
                                            <MenuItem value={'facturas'}>Facturas</MenuItem>
                                            <MenuItem value={'compras'}>Compras</MenuItem>
                                            <MenuItem value={'kardex'}>Kardex</MenuItem>
                                            <MenuItem value={'clientes'}>Clientes</MenuItem>
                                            <MenuItem value={'productos'}>Productos</MenuItem>
                                            <MenuItem value={'caja'}>Caja</MenuItem>

                                 
                                        </Select>
                                    </FormControl>
                                    <IconButton aria-label="delete" onClick={() => {
                                        setFiltros(!filtros)
                                        if ((!filtros) == false) {
                                            limpiarCampos()
                                        }
                                    }}>
                                        <FilterListIcon />

                                    </IconButton>
                                </Grid>

                                {
                                    filtros && (
                                        <Grid item xs={12} md={12}>
                                            <Grid container spacing={2}>

                                                <Grid item xs={12} md={12}>

                                                    <Typography  >
                                                        Filtrar por
                                                    </Typography>
                                                </Grid>


                                                {tipo == 'facturas' && (
                                                    <Grid item xs={12}>    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        style={{ width: '100%' }}
                                                        type="number"
                                                        label="Número"
                                                        value={filtro}
                                                        onChange={(e) => setFiltro(e.target.value)}

                                                    /></Grid>)
                                                }
                                                {tipo == 'productos' || tipo == 'kardex' ? (
                                                    <Grid item xs={12}>    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        style={{ width: '100%' }}
                                                        type="number"
                                                        label="Codigo de Barras"
                                                        value={barcode}
                                                        onChange={(e) => setBarcode(e.target.value)}

                                                    /></Grid>) : null
                                                }
                                                <Grid item md={6} xs={12}>


                                                    <MuiPickersUtilsProvider style={{ width: "100%" }} utils={DateFnsUtils} locale={es}>
                                                        <KeyboardDatePicker
                                                            autoOk

                                                            ampm={false}
                                                            size="small"
                                                            inputVariant="outlined"
                                                            label="Desde"
                                                            style={{ width: "100%" }}
                                                            // disablePast
                                                            format="yyyy-MM-dd"
                                                            value={desde}

                                                            onChange={date => setDesde(date)}
                                                        />


                                                    </MuiPickersUtilsProvider>


                                                </Grid>
                                                <Grid item md={6} xs={12}>


                                                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                                                        <KeyboardDatePicker
                                                            autoOk

                                                            ampm={false}
                                                            size="small"
                                                            inputVariant="outlined"
                                                            label="Hasta"
                                                            style={{ width: "100%" }}
                                                            // disablePast
                                                            format="yyyy-MM-dd"
                                                            value={hasta}

                                                            onChange={date => setHasta(date)}
                                                        />


                                                    </MuiPickersUtilsProvider>


                                                </Grid>
                                                <Grid item xs={12} md={12}>

                                                    <Autocomplete
                                                        size="small"
                                                        style={{ width: '100%' }}
                                                        options={userData}
                                                        value={getName(user, userData)}
                                                        getOptionLabel={(option) => option.dni + " - " + option.names}
                                                        onChange={(event, value) => {
                                                            if (value != null) {

                                                                setUser(value.id)
                                                            } else {

                                                                setUser('')

                                                            }

                                                        }} // prints the selected value
                                                        renderInput={params => (
                                                            <TextField {...params} label="Seleccione un usuario" variant="outlined" fullWidth />
                                                        )}
                                                    />

                                                </Grid>


                                                {tipo == 'facturas' && (
                                                    <Grid item xs={12}>
                                                        <FormControlLabel
                                                            control={<Switch checked={ticket}
                                                                onChange={() => setTicket(!ticket)} name="checkedA" />}
                                                            label="Formato Ticket"
                                                        />


                                                    </Grid>)
                                                }


                                            </Grid>
                                        </Grid>

                                    )
                                }

                            </Grid>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" disabled={tipo == ""} startIcon={<PrintIcon />} size="small" color="primary" onClick={reporte}>Imprimir reporte</Button>
                        </CardActions>
                    </Card>
                </Grid>

            </Grid>


        </Grid>
    )
}
