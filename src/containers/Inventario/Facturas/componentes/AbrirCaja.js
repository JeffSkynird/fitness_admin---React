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
import { Grid, InputAdornment } from '@material-ui/core';
import {registrar } from '../../../../utils/API/cajas';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function Crear(props) {
    const initializer = React.useContext(Initializer);
    const [amount,setAmount] = React.useState(0);
    const guardar = () => {
        registrar({start_amount:amount}, initializer,props.carga)
        props.setOpen(false)
        //props.carga()
        setAmount("")
    }
    return (
        <Dialog
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => props.setOpen(false)}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">Caja</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Coloque el valor con el que abrirá la caja
                </DialogContentText>
              <TextField
                    variant="outlined"
                    style={{ width: '100%' }}
                    type="number"
                    label="Monto inicial"

                    value={amount}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    onChange={(e) => {
                        const re = /^[0-9\b]+$/;

                            setAmount(e.target.value)

                    }}

                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.setOpen(false)} color="default">
                    Cancelar
                </Button>
                <Button color="primary" onClick={guardar}>
                    Abrir
                </Button>
            </DialogActions>
        </Dialog>
    )
}
