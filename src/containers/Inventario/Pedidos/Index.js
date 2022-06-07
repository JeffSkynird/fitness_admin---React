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
import Confirmar from '../../../components/Confirmar'
 
import { LocalizationTable, TableIcons, removeAccent } from '../../../utils/table.js'
import MaterialTable from "material-table";
import { Grid } from '@material-ui/core';
import { anularCompra, autorizarOrden, cambiarEstado, obtenerStatusOrden, obtenerTodos } from '../../../utils/API/pedidos.js';
import Crear from './componentes/Crear'
import EstadoOrden from './componentes/EstadoOrden'
import Asignar from './componentes/Asignar'

import Eliminar from './componentes/Eliminar'

export default function Sistemas(props) {
    const initializer = React.useContext(Initializer);

    const [data, setData] = React.useState([])
    const [kpis, setKpis] = React.useState({autorizados:0,no_autorizados:0})

    const [confirmarMensaje, setConfirmarMensaje] = React.useState(false)
    const [totalCompras,setTotalCompras] = React.useState(0)
    const [open, setOpen] = React.useState(false)
    const [open2, setOpen2] = React.useState(false)
    const [open3, setOpen3] = React.useState(false)
    const [open4, setOpen4] = React.useState(false)

    const [selected, setSelected] = React.useState(null)
    const [selected2, setSelected2] = React.useState(null)
    const [selected3, setSelected3] = React.useState(null)
    const [selected4, setSelected4] = React.useState(null)
    const [selected5, setSelected5] = React.useState(null)
    const [estado, setEstado] = React.useState([])

    React.useEffect(() => {
        if (initializer.usuario != null) {
            obtenerTodos({setTotalCompras,setData}, initializer)
            obtenerStatusOrden(setEstado, initializer)

        }
    }, [initializer.usuario])

    React.useEffect(() => {
        if (data.length!=0) {
            let aut=0
            let noaut=0
            data.map((e)=>{
                if(e.authorized!=null){
                    aut++
                }else{
                    noaut++
                }
            })
            setKpis({autorizados:aut,no_autorizados:noaut})
        }
    }, [data])
    const carga = () => {
        obtenerTodos({setTotalCompras,setData}, initializer)
        setSelected(null)
        setSelected2(null)
        setSelected3(null)
        setSelected4(null)
        setSelected5(null)

    }
    const autorizar=()=>{
        if(selected3!=null){
            autorizarOrden(selected3, initializer,carga)
            
        }
    }
    const cambiarEstadoE = (id) => {
            cambiarEstado({order:id,status:'E'}, initializer,carga)
            
    }
    const anular = () => {
        anularCompra(selected3, initializer, carga)

    }
    
    return (
        <Grid container spacing={2}>
         <Confirmar open={confirmarMensaje} setOpen={setConfirmarMensaje} accion={anular} titulo='¿Desea continuar? Se anulará la orden.'/>
         <EstadoOrden sistema={selected4} setSelected={setSelected4} setOpen={setOpen3} open={open3} carga={carga} />
         <Asignar sistema={selected5} setSelected={setSelected5} setOpen={setOpen4} open={open4} carga={carga} />

            <Crear sistema={selected} setSelected={setSelected} setOpen={setOpen} open={open} carga={carga} />
            <Eliminar sistema={selected2} setOpen={setOpen2} open={open2} carga={carga} />
            <Grid item xs={12} md={12} style={{display:'flex',justifyContent:'space-between'}}>
                <Typography variant="h5" >
                    Compras
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
                <Card style={{ width: 300, height: 120, marginRight: 20, marginBottom: 5,borderRadius:12,borderColor: 'rgba(0, 0, 0, 0.12)',borderWidth:1,borderStyle: 'solid'}} elevation={0}>
                    <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                            Totales
                        </Typography>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h4" gutterBottom>
                                ${totalCompras.toFixed(2)}
                            </Typography>
                            <Avatar variant="rounded" style={{ backgroundColor: 'rgb(94, 53, 177)', borderRadius: 20 }} >
                                <DesktopWindowsIcon />
                            </Avatar>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
    
            <Grid item xs={12}>
                <MaterialTable
                    icons={TableIcons}
                    columns={[
                
                        {
                            title: 'Estado',
                            field: 'status',
                            render: rowData =>{
                             
                                return  (
                                    <span>{rowData.status=='A'?'Emitida':'Anulada'}</span> 
                                )
                            },
                          }, 
                        { title: "Número", field: "id" },
                        { title: "Proveedor", field: "supplier" },
                        { title: "Total", field: "total", type: "currency" },

                        { title: "Fecha", field: "created_at", type: "datetime" },



                    ]}
                    data={
                        data
                    }

                    localization={LocalizationTable}

                    actions={[
                        

                        
                     
                        {
                            icon: TableIcons.Delete,
                            tooltip: "Borrar",

                            onClick: (event, rowData) => {
                                if(rowData.status!="E"){
                                    setSelected3(rowData.id)
                                    setConfirmarMensaje(true)
                                }else{
                                    initializer.mostrarNotificacion({ type: "warning", message: 'Compra ya anulada' });     
 
                                }
                            
                            }
                        },
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
