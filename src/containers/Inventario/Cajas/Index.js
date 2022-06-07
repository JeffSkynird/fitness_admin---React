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
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import { LocalizationTable, TableIcons, removeAccent } from '../../../utils/table.js'
import MaterialTable from "material-table";
import { Grid } from '@material-ui/core';
import { estaAbiertaCaja, obtenerHistoricoCajas } from '../../../utils/API/cajas';
import Cerrar from './componentes/Cerrar'
import VerDesglose from './componentes/VerDesglose'
import { downloadFiles } from '../../../utils/API/reporte';
export default function Sistemas(props) {
    const initializer = React.useContext(Initializer);

    const [data, setData] = React.useState([])
    const [kpi1, setKpi1] = React.useState(0)
    const [kpi2, setKpi2] = React.useState(0)
    const [openCaja, setOpenCaja] = React.useState(false)
    const [selectedDesglose, setSelectedDesglose] = React.useState(null)
    const [openDesglose, setOpenDesglose] = React.useState(false)

    const [open, setOpen] = React.useState(false)
    const [open2, setOpen2] = React.useState(false)
    const [selected, setSelected] = React.useState(null)
    const [selected2, setSelected2] = React.useState(null)
    const [openFilter, setOpenFilter] = React.useState(false)
    const [cajaAbierta, setCajaAbierta] = React.useState(null)
    const [confirmarMensaje, setConfirmarMensaje] = React.useState(false)

    React.useEffect(() => {
        if (initializer.usuario != null) {
            obtenerHistoricoCajas(setData,initializer)
            estaAbiertaCaja(setCajaAbierta, initializer,false)

        }
    }, [initializer.usuario])
    const carga = () => {
        obtenerHistoricoCajas(setData, initializer)
        estaAbiertaCaja(setCajaAbierta, initializer,false)
        setSelected(null)
        setSelected2(null)
 
       
         downloadFiles('caja', initializer, [])

    }
    const cerrar=()=>{
        
    }
    return (
        <Grid container spacing={2}>

            <VerDesglose open={openDesglose} setOpen={setOpenDesglose} id={selectedDesglose} setId={setSelectedDesglose}/>
             <Grid item xs={12} md={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" >
                    Caja -     <span style={{color: (cajaAbierta==0?'gray':'green')}}>
                    {cajaAbierta==0?'Cerrada':'Abierta'}
                        </span> 
                </Typography> 
            {/*     {
                     cajaAbierta==0 ?
                     <Button  onClick={() =>  setOpenCaja(true)} startIcon={<OpenInBrowserIcon />} variant="outlined" color="primary">
                        Abrir Caja
                    </Button>
                    
                        :
                      null
                } */}
                {
                    cajaAbierta==1 ?
                    <Cerrar carga={carga}/>
                    :null
                }
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
      
            <Grid item xs={12}>
                <MaterialTable
                    icons={TableIcons}
                    columns={[
                        { title: "Número", field: "id" },

                        { title: "Estado", field: "status",render: rowData => (
                            <span>{rowData.status=='C'?'Cerrada':'Abierta'}</span>
                        ), },

                        { title: "Monto apertura", field: "start_amount" },
                        { title: "Monto Final", field: "final_amount" },
                        { title: "Usuario", field: "names" },
                        { title: "Fecha apertura", field: "created_at", type: "datetime" },
                        { title: "Fecha cierre", field: "updated_at", type: "datetime" },


                    ]}
                    data={
                        data
                    }
                    actions={[
                        {
                            icon: TableIcons.VisibilityOutlinedIcon,
                            tooltip: 'Ver Desglose',

                            onClick: (event, rowData) => {
                                setOpenDesglose(true)
                                console.log(rowData)
                                setSelectedDesglose(rowData.id)

                            }
                        },

                    ]}
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
