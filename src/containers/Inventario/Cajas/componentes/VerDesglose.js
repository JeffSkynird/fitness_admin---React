import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import { Grid } from '@material-ui/core';
import MaterialTable from 'material-table';
import { LocalizationTable, TableIcons } from '../../../../utils/table';
import Initializer from '../../../../store/Initializer'
import { obtenerDesglose, obtenerDesglosePorId, registrarDesglose } from '../../../../utils/API/cajas';
import { downloadFiles } from '../../../../utils/API/reporte';

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
    const initializer = React.useContext(Initializer)
    const classes = useStyles();
    const [data, setData] = React.useState([]);
  
    React.useEffect(() => {
        if(initializer.usuario!=null&&props.id!=null){
            obtenerDesglosePorId(props.id,setData,initializer)

        }
    }, [initializer.usuario,props.id])
  
    const handleClickOpen = () => {
        props.setOpen(true);
    };

    const handleClose = () => {
        props.setOpen(false);
        setData([])
        props.setId(null)
    };
    const desglosar=()=>{
        registrarDesglose({data:data},initializer,carga)
    }
    const carga=()=>{
      setData([])
        handleClose()
        props.setId(null)
        props.carga()
      
     
    }

    const imprimir=()=>{
        if(props.id!=null){

        }
        let filter = [{ tipo: "id_caja", valor: props.id }]

        downloadFiles('caja', initializer, filter)



    }
    return (
 
            <Dialog fullScreen open={props.open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Caja
                        </Typography>
                        <Button autoFocus color="inherit" onClick={imprimir}>
                            Imprimir
                        </Button>
                    </Toolbar>
                </AppBar>
                <Grid container spacing={2}>
                <Grid item xs={12}>
                <MaterialTable
                    icons={TableIcons}
                    columns={[
                        { title: "Nombre", field: "name", },
                        { title: "Valor", field: "amount" },
                        { title: "Cantidad", field: "quantity",type:'numeric'},
                    ]}
                    data={
                        data
                    }
                    localization={LocalizationTable}
                    title="Desglose"
         

                    options={{
                        pageSize:10,
                        rowStyle: x => {
                            if (x.tableData.id % 2) {
                                return {backgroundColor: "#f2f2f2"}
                            }
                        },
                        sorting:false,
                        paging: false,
                        actionsColumnIndex: -1,
                        search:false,
                        maxBodyHeight: 500,
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
            </Dialog>
       
    );
}
