import React from 'react'
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import Avatar from '@material-ui/core/Avatar';
import Initializer from '../../../store/Initializer'
import { LocalizationTable, TableIcons } from '../../../utils/table.js'
import MaterialTable from "material-table";
import { Grid } from '@material-ui/core';
import { obtenerTodos, obtenerTodosPor } from '../../../utils/API/participantes';
import Crear from './componentes/Crear'
import Eliminar from './componentes/Eliminar'
import Filtro from './componentes/Filtro'
import { obtenerEventoAbierto } from '../../../utils/API/events';
import { Alert } from '@material-ui/lab';

export default function Sistemas(props) {
    const initializer = React.useContext(Initializer);

    const [data, setData] = React.useState([])
    const [open, setOpen] = React.useState(false)
    const [open2, setOpen2] = React.useState(false)
    const [selected, setSelected] = React.useState(null)
    const [selected2, setSelected2] = React.useState(null)
    const [openFilter, setOpenFilter] = React.useState(false)
    const [currentEvent, setCurrentEvent] = React.useState(null)
    React.useEffect(() => {
        if (initializer.usuario != null) {
            obtenerTodos(setData, initializer)
            obtenerEventoAbierto(setCurrentEvent, initializer)
        }
    }, [initializer.usuario])
    const carga = () => {
        obtenerTodos(setData, initializer)
        setSelected(null)
        setSelected2(null)
    }
    const filtrar = (fil) => {
        if(filtrar!=null){
            obtenerTodosPor(setData, initializer,{
                event_id: fil,
            })
        }else{
            obtenerTodos(setData, initializer)
        }
       
        setSelected(null)
        setSelected2(null)
    }
    
    return (
        <Grid container spacing={2}>
            <Crear sistema={selected} setSelected={setSelected} setOpen={setOpen} open={open} carga={carga} />
            <Eliminar sistema={selected2} setOpen={setOpen2} open={open2} carga={carga} />
            <Filtro setOpen={setOpenFilter} open={openFilter}  filtrar={filtrar}/>

            <Grid item xs={12} md={12} style={{display:'flex',justifyContent:'space-between'}}>
                <Typography variant="h5" >
                    Participantes 
                </Typography>
                <Button onClick={() => setOpen(true)} startIcon={<AddIcon />} variant="contained" color="primary">
                        Nuevo
                    </Button>
            </Grid>
         

            <Grid item xs={12} md={12} style={{ display: 'flex', marginTop: 10 }}>

                <Card style={{ width: 300, height: 120, marginRight: 20, marginBottom: 5,borderRadius:12,borderColor: 'rgba(0, 0, 0, 0.12)',borderWidth:1,borderStyle: 'solid'}} elevation={0}>
                    <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                            Totales
                        </Typography>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h4" gutterBottom>
                                {data.length}
                            </Typography>
                            <Avatar variant="rounded" style={{ backgroundColor: 'rgb(94, 53, 177)', borderRadius: 20 }} >
                                <DesktopWindowsIcon />
                            </Avatar>
                        </div>
                    </CardContent>
                </Card>
               
            </Grid>
            <Grid item xs={12} md={12}>
                <Alert severity="info">Competencia abierta: {currentEvent!=null?currentEvent.name:'Ninguna'} </Alert>
            </Grid>
            <Grid item xs={12}>
                <MaterialTable
                    icons={TableIcons}
                    columns={[
                      
                        { title: "Nombre",field:'people.names' },
                        { title: "Apellidos",field:'people.last_names'},
                        { title: "Categoría",field:"categories.name"},
                        { title: "Box", field:"boxes.name" },
                        { title: "Competencia", field:"events.name" },
                        { title: "Registro", field: "created_at", type: "datetime" },


                    ]}
                    data={
                        data
                    }

                    localization={LocalizationTable}

                    actions={[
                        {
                            icon: TableIcons.Edit,
                            tooltip: 'Editar',

                            onClick: (event, rowData) => {
                                setSelected(rowData)
                                setOpen(true)
                            }
                        },
                       

                        {
                            icon: TableIcons.Delete,
                            tooltip: "Borrar",

                            onClick: (event, rowData) => {
                                setSelected2(rowData)
                                setOpen2(true)
                            }
                        },
                        {
                            icon: TableIcons.Filter,
                            tooltip: 'Filtrar',
                            isFreeAction: true,
                            onClick: (event) => setOpenFilter(true)
                          }

                    ]}

                    options={{
                        pageSize:10,
                        showTitle: false,
                        actionsColumnIndex: -1,
                      
                        maxBodyHeight: 350,
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
    )
}
