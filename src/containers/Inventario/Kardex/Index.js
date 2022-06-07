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
import { obtenerTodos } from '../../../utils/API/kardex';
import Crear from './componentes/Crear'
import Eliminar from './componentes/Eliminar'
import Filtro from './componentes/Filtro'

export default function Sistemas(props) {
    const initializer = React.useContext(Initializer);

    const [data, setData] = React.useState([])
    const [kpi1, setKpi1] = React.useState(0)
    const [kpi2, setKpi2] = React.useState(0)

    const [open, setOpen] = React.useState(false)
    const [open2, setOpen2] = React.useState(false)
    const [selected, setSelected] = React.useState(null)
    const [selected2, setSelected2] = React.useState(null)
    const [openFilter, setOpenFilter] = React.useState(false)

    React.useEffect(() => {
        if (initializer.usuario != null) {
            obtenerTodos(setData, initializer,setKpi1,setKpi2)
        }
    }, [initializer.usuario])
    const carga = () => {
        obtenerTodos(setData, initializer,setKpi1,setKpi2)
        setSelected(null)
        setSelected2(null)
    }
    const total=()=>{
        let tot=0
        data.map((e)=>{
            tot+=e.evaluaciones
        })
        return tot
    }
    const obtenerFraccionUnidades=(cantidad,fraccion)=>{
        let frac = ((cantidad % 1)*fraccion).toFixed(1)*1
        let unity =cantidad-(cantidad % 1)

        return {unity,frac}

    }
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={12} style={{display:'flex',justifyContent:'space-between'}}>
                <Typography variant="h5" >
                    Kardex
                </Typography>
               
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
                            Entrada
                        </Typography>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h4" gutterBottom>
                                {kpi1}
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
                            Salida
                        </Typography>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h4" gutterBottom>
                                {kpi2}
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
                      
                        { title: "Producto", field: "name" },
                        { title: "Laboratorio", field: "warehouse" },
                        { title: "Concepto", field: "concept",render: rowData => (
                            <span>{rowData.concept=='E'?'Entrada':'Salida'}</span>
                        ), },
                
                        { title: "Mov. Unidades", field: "quantity" ,render: rowData => (
                            <span>{obtenerFraccionUnidades(rowData.quantity,rowData.fraction).unity}</span>
                        ), },
                        { title: "Mov. Fracciones", field: "quantity" ,render: rowData => (
                            <span>{obtenerFraccionUnidades(rowData.quantity,rowData.fraction).frac}</span>
                        ), },
                        { title: "Saldo unidad", field: "stock" ,render: rowData => (
                            <span>{obtenerFraccionUnidades(rowData.stock,rowData.fraction).unity}</span>
                        ), },
                        { title: "Saldo fracción", field: "fraction" ,render: rowData => (
                            <span>{obtenerFraccionUnidades(rowData.stock,rowData.fraction).frac}</span>
                        ), },
                        { title: "Tipo", field: "type" ,render: rowData => (
                            <span>{rowData.type=='V'?'Venta':(rowData.type=='C'?'Compra':(rowData.type=='A'?'Ajuste':'Anulación'))}</span>
                        ), },
                        { title: "Usuario", field: "names" },
                        { title: "Registro", field: "created_at", type: "datetime" },


                    ]}
                    data={
                        data
                    }

                    localization={LocalizationTable}

                   

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
