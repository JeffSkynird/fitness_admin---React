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
import { obtenerDesglose, registrarDesglose } from '../../../../utils/API/cajas';

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
    const [open, setOpen] = React.useState(false);
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        if(initializer.usuario!=null){
            obtenerDesglose(setData,initializer)

        }
    }, [initializer.usuario])
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const desglosar=()=>{
        registrarDesglose({data:data},initializer,carga)
    }
    const carga=()=>{
        obtenerDesglose(setData,initializer)
        handleClose()
        props.carga()
     
    }
    return (
        <div>
            <Button  startIcon={<MoveToInboxIcon />} variant="outlined" color="primary" onClick={handleClickOpen}>
                Cerrar caja
            </Button>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Caja
                        </Typography>
                        <Button autoFocus color="inherit" onClick={desglosar}>
                            Cerrar caja
                        </Button>
                    </Toolbar>
                </AppBar>
                <Grid container spacing={2}>
                <Grid item xs={12}>
                <MaterialTable
                    icons={TableIcons}
                    columns={[
                        { title: "Nombre", field: "name", editable: 'never' },
                        { title: "Valor", field: "amount", editable: 'never' },
                        { title: "Cantidad", field: "quantity",type:'numeric' },
                    ]}
                    data={
                        data
                    }
                    localization={LocalizationTable}
                    title="Desglose"
                    cellEditable={{
                        onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                          return new Promise((resolve, reject) => {
                            setTimeout(() => {
                                if(newValue!==""){
                                    console.log(newValue)
                                    console.log(newValue>=0)
                                    if(newValue>=0){
                                        const dataUpdate = [...data];

                                        const index = rowData.tableData.id;
                                       
                                        dataUpdate[index].quantity = newValue;
                                        setData([...dataUpdate]);
                          
                                    }
                                }
                                resolve();
                              }, 1000)
                          });
                        }
                      }}

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
        </div>
    );
}
