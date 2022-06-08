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
import { Chip, Grid } from '@material-ui/core';
import { obtenerEventoAbierto, obtenerTodos } from '../../../utils/API/events';
import Crear from './componentes/Crear'
import Eliminar from './componentes/Eliminar'
import Filtro from './componentes/Filtro'
import { Alert, Autocomplete } from '@material-ui/lab';
import { obtenerPorCompetencia } from '../../../utils/API/steps';
import { guardarPuntos, obtenerTodosPorEvento } from '../../../utils/API/participantes';
import { obtenerTodos as obtenerCategorias } from '../../../utils/API/category';
import TableRep from './componentes/TablaRep';
import TableTiempo from './componentes/TablaTiempo';
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
    const [categoria, setCategoria] = React.useState("")
    const [categoriaData, setCategoriaData] = React.useState([])
    const [stepData, setStepData] = React.useState([])
    const [step, setStep] = React.useState("")
    const [stepC, setStepC] = React.useState(null)

    const [participants, setParticipants] = React.useState([])
    const [typeRep, setTypeRep] = React.useState(true)


    const [columns, setColumns] = React.useState()
    React.useEffect(() => {
        if (initializer.usuario != null) {
            obtenerTodos(setEventData, initializer)
            obtenerEventoAbierto(setCurrentEvent, initializer)
            obtenerCategorias(setCategoriaData, initializer)


        }
    }, [initializer.usuario])

    React.useEffect(() => {
        if (currentEvent != null) {
            obtenerPorCompetencia(currentEvent.id, setStepData, initializer)
        }
    }, [currentEvent])
    const carga = () => {
        obtenerTodos(setData, initializer)
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
    const confirmar = () => {
        if (participants.length == 0) {
            initializer.mostrarNotificacion({ type: "warning", message: 'Cargue los datos primero' });
            return
        }
        guardarPuntos({ data: participants }, initializer)
    }
    const obtenerPorEvento = (id) => {
        setParticipants([])
        obtenerTodosPorEvento({ category_id: categoria }, id, setParticipants, initializer)
        setStep(id)
    }
    const cargarValue2 = (val) => {
        if (categoria == "") {
            initializer.mostrarNotificacion({ type: "warning", message: 'Elija una categoría' });
            return
        }
        obtenerPorEvento(val.id)
        setStepC(val)
        if (participants.length != 0) {
            let re = window.confirm("Si cambia de evento sin guardar los datos se perderán, ¿continuar?")
            if (re == false) {
                return
            }
        }
        if (val != null) {
            if (val.step_type_id == 2) {
                setColumns([
                    { editable: 'never', title: 'RANK', field: 'position', render: rowData => <span>{rowData.position != null ? rowData.position : "-"}</span> },
                    {
                        title: 'Nombres',
                        field: 'fullname',
                        editable: 'never'

                    },
                    {
                        title: 'Categoría',
                        field: 'categories', render: rowData => (<span>{rowData.categories.name}</span>),
                        editable: 'never'
                    },
                    {
                        title: 'Box',
                        field: 'boxes', render: rowData => (<span>{rowData.boxes.name}</span>),
                        editable: 'never'
                    },
                    {
                        title: 'Total',
                        field: 'total_score', render: rowData => (<span>{Number(rowData.total_score)}</span>),
                        editable: 'never',
                    },
                    { title: "REP/TIME", field: "value", render: rowData => <span>{rowData.value != null ? rowData.value : "---"}</span> },
                    {
                        title: "REP", field: "value2",
                        render: rowData => <span>{rowData.value2 != null ? rowData.value2 : "---"}</span>,
                        hidden: false
                    },
                    { editable: 'never', title: "Puntos", field: "score", render: rowData => <span>{rowData.score != null ? rowData.score : "-"}</span> },
                ])
            } else {
                setColumns([
                    { editable: 'never', title: 'RANK', field: 'position', render: rowData => <span>{rowData.position != null ? rowData.position : "-"}</span> },
                    {
                        title: 'Nombres',
                        field: 'fullname',
                        editable: 'never'

                    },
                    {
                        title: 'Categoría',
                        field: 'categories', render: rowData => (<span>{rowData.categories.name}</span>),
                        editable: 'never'
                    },
                    {
                        title: 'Box',
                        field: 'boxes', render: rowData => (<span>{rowData.boxes.name}</span>),
                        editable: 'never'
                    },
                    {
                        title: 'Total',
                        field: 'total_score', render: rowData => (<span>{Number(rowData.total_score)}</span>),
                        editable: 'never'
                    },
                    { title: "REP/TIME", field: "value", render: rowData => <span>{rowData.value != null ? rowData.value : "---"}</span> },
                    {
                        title: "REP", field: "value2",
                        render: rowData => <span>{rowData.value2 != null ? rowData.value2 : "---"}</span>,
                        hidden: true
                    },
                    { editable: 'never', title: "Puntos", field: "score", render: rowData => <span>{rowData.score != null ? Number(rowData.score) : "-"}</span> },
                ])
            }
        }

    }
    const convertTime = (time) => {
        let timeParts = time.split(":");
        return (+timeParts[0] * (60000 * 60)) + (+timeParts[1] * 60000);
    }
    const ordernarNumerico= () => {
        let ar = participants.slice().sort(function (a, b) {
            return (Number(b.value) - Number(a.value))
        })
        let resp = []
        let max = 100
        //DELETE ALL value and total_score in array
        ar.map((e) => {
            e.score = null
            e.total_score = null
        })
        ar.map((e, i) => {
            console.log(i)
            if (ar[i - 1] != null) {
                if (ar[i - 1].value == e.value) {
                    max = max
                } else {
                    max = max - (i == 0 ? 0 : 1)
                }

            } else {
                max = max - (i == 0 ? 0 : 1)
            }

            let temp = 0
            /* if (e.point_id != null) {
                temp = e.total_score - e.score
            } */
            let total = (Number(e.total_score) + max)
            resp.push({ ...e, position: i + 1, score: max, total_score: temp != 0 ? temp : total, step_id: step })

        })
        return resp;
    }
    const hmsToSecondsOnly = (str) => {
        var p = str.split(':'),
        s = 0, m = 1;

        while (p.length > 0) {
            s += m * parseInt(p.pop(), 10);
            m *= 60;
        }

        return s;
    }
    const preguntador=(texto)=>{
        //el texto tiene /
        if (texto.indexOf('/') > -1)
        {
          return true;
        }else{
            return false;

        }
    }
    const ordenarTiempo= () => {
        let ar = participants.slice().sort(function (a, b) {
            let aRes = a.value=='0'?'16:00':a.value
            let bRes=b.value=='0'?'16:00':b.value
            if(preguntador(a.value)){
                aRes=a.value.split('/')[0]
            }
            if(preguntador(b.value)){
                bRes=b.value.split('/')[0]
            }
            return (hmsToSecondsOnly(aRes) - hmsToSecondsOnly(bRes))
        })
       let ar2 = ar.sort(function (a, b) {

            if(preguntador(a.value)&&preguntador(b.value)){
              
                    return (hmsToSecondsOnly(b.value.split('/')[1]) - hmsToSecondsOnly(a.value.split('/')[1]))
              

            }
            
          
        })
        let resp = []
        let max = 100
        //DELETE ALL value and total_score in array
        ar.map((e) => {
            e.score = null
            e.total_score = null
        })
        ar.map((e, i) => {
            console.log(i)
            if (ar[i - 1] != null) {
                if (ar[i - 1].value == e.value) {
                    max = max
                } else {
                    max = max - (i == 0 ? 0 : 1)
                }

            } else {
                max = max - (i == 0 ? 0 : 1)
            }

            let temp = 0
            /* if (e.point_id != null) {
                temp = e.total_score - e.score
            } */
            let total = (Number(e.total_score) + max)
            resp.push({ ...e, position: i + 1, score: max, total_score: temp != 0 ? temp : total, step_id: step })

        })
        return resp;

    }
    const ordenar = () => {
        //  let ar = participants.slice().sort((a,b) => (Number(b.value) > Number(a.value)) ? 1 : ((Number(a.value) > Number(b.value)) ? -1 : 0))
       
       let resp=[]
        if(stepC.step_type_id == 2){
            resp = ordenarTiempo()
        }else{
            resp = ordernarNumerico()
        }
        
        setParticipants(resp)
    }
    return (
        <Grid container spacing={2}>
            <Crear sistema={selected} setSelected={setSelected} setOpen={setOpen} open={open} carga={carga} />
            <Eliminar sistema={selected2} setOpen={setOpen2} open={open2} carga={carga} />
            <Filtro setOpen={setOpenFilter} open={openFilter} />

            <Grid item xs={12} md={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" >
                    Resultados
                </Typography>

                <Button variant="contained" color="primary" onClick={confirmar}>
                    Guardar
                </Button>

            </Grid>

            <Grid item xs={12} md={12}>
                <Card >
                    <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                            Registre los resultados
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12} >
                                <Alert severity="info">Seleccione los eventos de la competencia actual e ingrese los valores. (Competencia actual abierta: <span style={{ fontWeight: 'bold' }}>{currentEvent != null ? currentEvent.name : 'Ninguna'}</span>) </Alert>
                            </Grid>
                            <Grid item xs={12} md={6} style={{ display: 'flex' }}>
                                <Autocomplete
                                    style={{ width: '100%' }}
                                    size="small"
                                    options={categoriaData}
                                    value={getName(categoria, categoriaData)}
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
                            <Grid item xs={12} md={6} >
                                <Autocomplete
                                    size="small"
                                    style={{ width: '100%' }}
                                    options={stepData}
                                    value={getName(step, stepData)}
                                    getOptionLabel={(option) => option.name}
                                    onChange={(event, value) => {
                                        if (value != null) {
                                            cargarValue2(value)
                                        } else {
                                            setStep('')
                                            setStepC(null)
                                            setParticipants([])
                                        }
                                    }}
                                    renderInput={params => (
                                        <TextField {...params} label="Seleccione un evento" variant="outlined" fullWidth />
                                    )}
                                />

                            </Grid>
                            {
                                stepC != null && (
                                    <Grid item xs={12} md={12} >
                                        <Chip label={stepC.step_types.name} />

                                    </Grid>
                                )
                            }


                            <Grid item md={12} xs={12}>

                                {
                                    stepC != null && (

                                        stepC.step_types.id == 1 ?

                                            <TableRep setParticipants={setParticipants} participants={participants} ordenar={ordenar} />
                                            :
                                            <TableTiempo setParticipants={setParticipants} participants={participants} ordenar={ordenar} />

                                    )
                                }



                            </Grid>


                        </Grid>
                    </CardContent>
                </Card>


            </Grid>
        </Grid>
    )
}
