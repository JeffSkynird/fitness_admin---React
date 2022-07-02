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
import { Avatar, Checkbox, FormControlLabel, Grid, IconButton, InputAdornment } from '@material-ui/core';
import { editar, registrar } from '../../../../utils/API/events';
import { obtenerTodos as obtenerTipoEtapas } from '../../../../utils/API/steptype';

import { obtenerTodos as obtenerZonas } from '../../../../utils/API/zones';
import { Autocomplete } from '@material-ui/lab';
import DateFnsUtils from '@date-io/date-fns';
import {
    DatePicker,
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import es from 'date-fns/locale/es'
import { LocalizationTable, TableIcons } from '../../../../utils/table';
import MaterialTable from 'material-table';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function Crear(props) {
    const initializer = React.useContext(Initializer);

    const [nombre, setNombre] = React.useState("")
    const [startDate, setStartDate] = React.useState(new Date())
    const [endDate, setEndDate] = React.useState(new Date())
    const [description, setDescription] = React.useState("")
    const [isOpen, setIsOpen] = React.useState(false)
    const [isFinal, setIsFinal] = React.useState(false)

    const [steps, setSteps] = React.useState([])
    const [tipoEtapa, setTipoEtapa] = React.useState("")
    const [tipoEtapaC, setTipoEtapaC] = React.useState(null)
    const [tipoEtapaData, setTipoEtapaData] = React.useState([])

    React.useEffect(() => {
        if (initializer.usuario != null) {
            obtenerTipoEtapas(setTipoEtapaData, initializer)
        }
    }, [initializer.usuario])

    React.useEffect(() => {
        if (props.sistema != null) {
            setNombre(props.sistema.name)
            setStartDate(new Date(props.sistema.start_date))
            setEndDate(new Date(props.sistema.end_date))
            setIsOpen(props.sistema.is_open)
            setDescription(props.sistema.description)
            setSteps(formatData(props.sistema.steps))
            setIsFinal(props.sistema.is_final)
        }
    }, [props.sistema])
    const obtenerNombre = (id) => {
        let nombre = ""
        tipoEtapaData.map((e) => {
            if (e.id == id) {
                nombre = e.name
            }
        })
        return nombre

    }
    const formatData = (steps) => {
        let ar = []
        steps.map((step, index) => {
            ar.push({ ...step, step_type: obtenerNombre(step.step_type_id), description: step.description != null ? step.description : "Ninguna" })
        }
        )
        return ar
    }
    const guardar = () => {
        let data = {
            'name': nombre,
            'start_date': startDate,
            'end_date': endDate,
            'is_open': isOpen,
            'description': description,
            'steps': steps,
            'is_final': isFinal
        }
        if (props.sistema == null) {
            registrar(data, initializer, limpiar)
        } else {
            editar(props.sistema.id, data, initializer, limpiar)
        }
        props.setOpen(false)
        props.carga()
    }
    const limpiar = () => {
        vaciar()
        props.carga()
    }
    const vaciar = () => {
        setNombre("")
        setStartDate(new Date())
        setEndDate(new Date())
        setIsOpen(false)
        setDescription("")
        setSteps([])
        props.setSelected(null)
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
    const agregar = () => {
        if (tipoEtapa != "") {
            let t = steps.slice()
            t.push({ name: 'Evento', description: 'Evento', step_type: tipoEtapaC.name, step_type_id: tipoEtapa })
            setSteps(t)
            setTipoEtapa("")
            setTipoEtapaC(null)
        } else {
            initializer.mostrarNotificacion({ type: "warning", message: 'Seleccione un tipo de evento' });

        }

    }
    const quitar = (row) => {
        let id = row.tableData.id
        let t = steps.slice()
        setSteps(t.filter((e, i) => i != id))
        setTipoEtapa("")
        setTipoEtapaC(null)
    }
    return (
        <Dialog
            open={props.open}
            fullScreen={true}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => {
                props.setOpen(false)
                limpiar()
            }}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">Competencias</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {props.sistema != null ? "Formulario de edición de competencias" : "Formulario de creación de competencias"}
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
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            style={{ width: '100%' }}
                            label="Descripción"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}

                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={<Checkbox checked={isOpen} onChange={()=>setIsOpen(!isOpen)} />}
                            label="¿Esta activa?"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={<Checkbox checked={isFinal} onChange={()=>setIsFinal(!isFinal)} />}
                            label="¿Es final?"
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <KeyboardDatePicker
                                autoOk
                                ampm={false}

                                inputVariant="outlined"
                                label="Fecha inicio"
                                style={{ width: "100%" }}
                                format="yyyy-MM-dd"
                                value={startDate}
                                onChange={date => setStartDate(date)}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <KeyboardDatePicker
                                autoOk
                                ampm={false}

                                inputVariant="outlined"
                                label="Fecha fin"
                                style={{ width: "100%" }}
                                format="yyyy-MM-dd"
                                value={endDate}
                                onChange={date => setEndDate(date)}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={12} md={12} style={{ display: 'flex' }}>
                        <Autocomplete
                            style={{ width: '100%' }}
                            size="small"
                            options={tipoEtapaData}
                            value={getName(tipoEtapa, tipoEtapaData)}

                            onChange={(event, newValue) => {
                                if (newValue != null) {

                                    setTipoEtapa(newValue.id);
                                    setTipoEtapaC(newValue)
                                } else {

                                    setTipoEtapa('');
                                    setTipoEtapaC(null)

                                }
                            }}
                            getOptionLabel={(option) => option.name}
                            renderInput={params => (
                                <TextField variant="outlined" {...params} label="Seleccione un tipo de evento a agregar" fullWidth />
                            )}
                        />

                    </Grid>
                    <Grid item md={12} xs={12}>

                        <MaterialTable
                            key={1}
                            id={1}
                            icons={TableIcons}
                            columns={[
                                {
                                    title: 'Denominación',
                                    field: 'name'
                                },
                                {
                                    title: 'Descripción',
                                    field: 'description'
                                },
                                { title: "Tipo", field: "step_type", editable: 'never' },
                            ]}
                            cellEditable={{
                                onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                                    return new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                            if (newValue !== "") {

                                                const dataUpdate = [...steps];
                                                const index = rowData.tableData.id;
                                                dataUpdate[index][columnDef.field] = newValue;
                                                setSteps([...dataUpdate]);


                                            }
                                            resolve();
                                        }, 1000)
                                    });
                                }
                            }}

                            data={
                                steps
                            }
                            title="Eventos"

                            localization={LocalizationTable}
                            actions={[{
                                icon: TableIcons.Add,
                                tooltip: 'Agregar',
                                isFreeAction: true,
                                onClick: (event, rowData) => {
                                    agregar()
                                }
                            },
                            {
                                icon: TableIcons.Delete,
                                tooltip: 'Eliminar',

                                onClick: (event, rowData) => {
                                    if (!rowData.hasOwnProperty('id')) {
                                        quitar(rowData)
                                    } else {
                                        initializer.mostrarNotificacion({ type: "warning", message: 'No se puede eliminar este evento' });
                                    }

                                },
                            },
                            {
                                icon: TableIcons.ResetSearch,
                                tooltip: 'Eliminar Todo',
                                isFreeAction: true,
                                onClick: (event, rowData) => {
                                    initializer.mostrarNotificacion({ type: "warning", message: 'Función en desarrollo' });

                                }
                            }]}

                            options={{
                                pageSize: 10,
                                paging: false,
                                search: false,

                                actionsColumnIndex: -1,
                                width: '100%',
                                maxBodyHeight: 200,

                                padding: 'dense',
                                headerStyle: {
                                    textAlign: 'left'
                                },
                                cellStyle: {
                                    textAlign: 'left'
                                },
                                searchFieldStyle: {

                                    padding: 5
                                }
                            }}

                        />
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
