import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Initializer from '../../../../store/Initializer'

import Slide from '@material-ui/core/Slide';
import { Grid } from '@material-ui/core';
import { eliminar as eliminarBodega, registrarSistema } from '../../../../utils/API/bodegas';
import { Alert } from '@material-ui/lab';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function Crear(props) {
    const initializer = React.useContext(Initializer);
    const [valor, setValor] = React.useState('');
    const [cambio, setCambio] = React.useState('');

    const guardar = () => {
        if(valor!=""){
            let total = props.sistema
            console.log(total)
            console.log(valor)
            let pagar = Math.abs(total-valor)
            setCambio(pagar.toFixed(2))
        }
      
      /*   props.setOpen(false)
        props.carga() */
    }
    return (
        <Dialog
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => {
                props.setOpen(false)
                setValor('')
                setCambio('')
            }}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">Cambio</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Ingresel valor pagado por el cliente
                </DialogContentText>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                        <TextField
                            variant="outlined"
                            label="Valor"
                            style={{ width: '100%' }}
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}

                        />
                    </Grid>
                    {
                        cambio!="" &&(
                            <Grid item xs={12} md={12}>
                            <Alert severity="success">Cambio: ${cambio}</Alert>
                            </Grid>
                        )
                    }
                   
                </Grid>

            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    props.setOpen(false)
                    setValor('')
                    setCambio('')
                }} color="default">
                    Cerrar
                </Button>
                <Button color="primary" onClick={guardar}>
                    Calcular
                </Button>
            </DialogActions>
        </Dialog>
    )
}
