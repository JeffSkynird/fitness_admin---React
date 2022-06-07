import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Initializer from '../../../../store/Initializer'
import Confirmar from '../../../../components/Confirmar'
import VerFoto from '../../../../components/Confirmar'

import Slide from '@material-ui/core/Slide';
import { Checkbox, Grid, InputAdornment, Tooltip } from '@material-ui/core';
import { editar as editarPedido, obtenerDetalleOrden, registrar as registrarPedido, obtenerInventarioOrden, guardarAlmacen } from '../../../../utils/API/pedidos';
import { obtenerTodos as obtenerRazones } from '../../../../utils/API/razones';
import { obtenerInventario, obtenerTodos as obtenerTodosBodegas } from '../../../../utils/API/bodegas';
import { obtenerTodos as obtenerProductos } from '../../../../utils/API/sistemas';
import IconButton from '@material-ui/core/IconButton';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import { Alert, Autocomplete } from '@material-ui/lab';
import MaterialTable from 'material-table';
import { LocalizationTable, TableIcons } from '../../../../utils/table';
import { registrarUnidad } from '../../../../utils/API/facturas';
import { obtenerTodos as obtenerClientes } from '../../../../utils/API/clientes';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Paper } from '@material-ui/core';
import { PersonAddOutlined, PostAddOutlined } from '@material-ui/icons';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import CrearCliente from '../../Clientes/componentes/Crear'
import { downloadFiles, printTicket } from '../../../../utils/API/reporte';
import { PUBLIC_PATH } from '../../../../config/API';
import Cambio from './Cambio'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CrearN(props) {
    const initializer = React.useContext(Initializer);
    const [open, setOpen] = React.useState(false)
    const [finalConsumer, setFinalConsumer] = React.useState(false)
    const [crearCliente, setCrearCliente] = React.useState(false)
    const [cambioCliente, setCambioCliente] = React.useState(false)
    const [confirmarMensaje, setConfirmarMensaje] = React.useState(false)
    const [foto, setFoto] = React.useState(false)

    const [imageSelected, setImageSelected] = React.useState(null)
    const [cantidad, setCantidad] = React.useState("")
    const [fraction, setFraction] = React.useState("")

    const [inventario, setInventario] = React.useState([])
    const [productos, setProductos] = React.useState([])

    const [almacen, setAlmacen] = React.useState([])
    const [bodegaData, setBodegaData] = React.useState([])
    const [bodegaO, setBodegaO] = React.useState('')
    const [bodegaD, setBodegaD] = React.useState('')
    const [productosData, setProductosData] = React.useState([])
    const [producto, setProducto] = React.useState("")
    const [productoC, setProductoC] = React.useState(null)

    const [clientData, setClientData] = React.useState([])
    const [client, setClient] = React.useState("")

    const [subTotalV, setSubTotalV] = React.useState(0)
    const [subTotalVI, setSubTotalVI] = React.useState(0)
    const [discount, setDiscount] = React.useState(0)


    React.useEffect(() => {
        if (initializer.usuario != null) {

            obtenerTodosBodegas(setBodegaData, initializer)
            obtenerProductos(setProductosData, initializer)
            obtenerClientes(setClientData, initializer)
        }
    }, [initializer.usuario])
    React.useEffect(() => {
        if (props.sistema != null && props.open) {
            console.log(props.open)
            setProductos([])
            setAlmacen([])
            obtenerInventarioOrden(props.sistema.id, setProductos, initializer)


        }
    }, [props.sistema, props.open])
    const guardar = () => {
        if (finalConsumer == false && client == "") {
            initializer.mostrarNotificacion({ type: "warning", message: 'Seleccione un cliente' });
            return false
        }
        if (subTotalV == 0) {
            initializer.mostrarNotificacion({ type: "warning", message: 'No puede hacer una factura por valor 0' });
            return false
        }

        registrarUnidad({discount:discount, iva: (subTotalV - subTotalVI) * 0.12, client_id: finalConsumer ? '' : client, final_consumer: finalConsumer ? 1 : 0, total: subTotalV + ((subTotalV - subTotalVI) * 0.12), data: productos }, initializer, limpiar, imprimir)

        props.setOpen(false)
        obtenerProductos(setProductosData, initializer)




    }
    const imprimir = (id) => {
        printTicket(id, initializer)
    }
    const limpiar = () => {
        setSubTotalVI(0)
        setCantidad("")
        setSubTotalV(0)
        setClient("")
        setFinalConsumer(false)
        setProducto("")
        setDiscount(0)
        setProductos([])
        setAlmacen([])
        props.setSelected(null)
        props.setOpen(false)
        props.carga()
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
    const validarData = () => {
        let final = []

        productos.map((e) => {

            if (!final.some(i => i.supplier_id === e.supplier_id)) {
                final.push({
                    supplier_id: e.supplier_id,
                    products: obtenerProductosPorId(e.supplier_id)
                })
            }

        })
        return final
    }
    const obtenerProductosPorId = (id) => {
        return productos.filter((e) => e.supplier_id == id)
    }
    const quitar = (row) => {
        console.log(subTotalVI)
        let id = row.tableData.id
        let t = productos.slice()
        let tot = subTotalV - row.subtotal
        let toti = row.has_iva == 0 ? subTotalVI - row.subtotal : subTotalVI
        let dsc = discount-row.hasOwnProperty('discount')?row.discount:0

        setProductos(t.filter((e, i) => i != id))
        setCantidad('')
        setDiscount(dsc)
        setProducto("")
        setSubTotalV(tot)
        setSubTotalVI(toti)
    }

    const existeEnDetalle = (id) => {
        let exs = false
        productos.map((e) => {
            if (e.product_id == id) {
                exs = true
            }
        })
        return exs
    }

    const obtenerBodega = (id) => {
        let nombre = ""
        bodegaData.map((e) => {
            if (e.id == id) {
                nombre = e.name
            }
        })
        return nombre
    }

    const quitarInventario = (row) => {

        let t = [];
        inventario.slice().map((e, i) => {
            if (!estaIncluido(e.inventory_id, row)) {
                t.push({ ...e })
            }
        })
        setInventario(t)

    }
    const estaIncluido = (id, dt) => {
        let res = false
        dt.map((e, i) => {
            if (e.inventory_id == id) {
                res = true
            }
        })
        return res
    }

    const cargarInventario = (id) => {
        if (id != '') {
            setInventario([])
            obtenerInventario(id, setInventario, initializer)
        }

    }
    
    const obtenerFraccionUnidades=(cantidad,fraccion)=>{
        let frac = ((cantidad % 1)*fraccion).toFixed(1)*1
        let unity =cantidad-(cantidad % 1)

        return {unity,frac}

    }
    const agregar = () => {
        if (producto != "" && cantidad != "" && cantidad > 0 && cantidad > 0) {
            let t = productos.slice()
            let subT = subTotalV
            let subTSinIva = subTotalVI
            let outStock = false
            if (!existeEnDetalle(productoC.id)) {

                if ((productoC.stock - cantidad) >= 0) {
                   
                    let frac = ((cantidad % 1)*productoC.fraction).toFixed(1)*1
                   
                    let unity =cantidad-(cantidad % 1)
               
                    t.push({image:productoC.image, description:productoC.description,unity:unity, warehouse: productoC.warehouse, has_iva: productoC.has_iva, product: productoC.name, bar_code: productoC.bar_code, stock: (productoC.stock - cantidad), product_id: productoC.id, quantity: cantidad, fraction: frac, price: productoC.sale_price, subtotal: (cantidad * productoC.sale_price) })
                    subT = subT + (cantidad * productoC.sale_price)
                    subTSinIva = subTSinIva + (productoC.has_iva == 0 ? (cantidad * productoC.sale_price) : 0)

                } else {
                    outStock = true
                }
            }

            /* producto.map((e) => {
                if(!existeEnDetalle(e.id)){
                    if((e.stock-cantidad)>=0){
                        t.push({ product: e.name, bar_code: e.bar_code, stock: (e.stock-cantidad), product_id: e.id, quantity: cantidad, price: e.sale_price, subtotal: (cantidad * e.sale_price) })
                        subT = subT + (cantidad * e.sale_price)
                    }else{
                        outStock=true
                    }
                  
                }
           

            }) */
            setSubTotalV(subT)

            setSubTotalVI(subTSinIva)
            setProductos(t)

            setCantidad('')
            setFraction('')

            setProducto("")
            setProductoC(null)
            if (outStock) {
                initializer.mostrarNotificacion({ type: "warning", message: 'No hay suficiente stock' });
            } else {
                if (t.length == 0) {
                    initializer.mostrarNotificacion({ type: "warning", message: 'Producto ya agregado' });
                }
            }

        } else {
            initializer.mostrarNotificacion({ type: "warning", message: 'No deje campos vacíos' });

        }

    }

    const getName3 = (id) => {
        let object = null
        clientData.map((e) => {
            if (id == e.id) {
                object = { ...e }
            }
        })
        return object
    }
    const cambiarFraccionamiento = (obj, modi, val) => {
        console.log(obj)
        if (obj == null) {
            return 0
        }
        if (modi == 'cantidad') {
            if (val > obj.stock) {
                return 0
            } else {
                let fr = obj.fraction
                let t = fr * val
                return t
            }

        } else if (modi == "fraccion") {
            console.log("valor cambiar" + val)
            let temp = obj.stock * obj.fraction
            console.log("valor maximo" + temp)
            if (val > temp) {
                return 0
            } else {
                let decT = (val * 1) / obj.fraction



                return decT
            }
        }

    }
    return (
        <Dialog
            fullWidth
            maxWidth='lg'
            fullScreen
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => {
                props.setOpen(false)
                limpiar()
            }}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
              <VerFoto ancho={true} body={<img
                style={{ height: '100%', width: '100%' }}
                src={PUBLIC_PATH+"storage/" + imageSelected}
            />} open={foto} setOpen={setFoto} accion={() => {
                setImageSelected(null)
                setFoto(false)
            }} titulo='Foto del producto' />

  <Cambio sistema={(subTotalV + ((subTotalV - subTotalVI) * 0.12)).toFixed(2)} setSelected={() => null} setOpen={setCambioCliente} open={cambioCliente} carga={() => null

           } />
          <Confirmar open={confirmarMensaje} setOpen={setConfirmarMensaje} accion={guardar} titulo='¿Desea continuar? Se creará la factura' customAction={  <Button         startIcon={<MonetizationOnIcon />} color="primary" onClick={()=>{
              setCambioCliente(true)
              setConfirmarMensaje(false)
          }}>
                    Cambio
                </Button>}/>

            <CrearCliente sistema={null} setSelected={() => null} setOpen={setCrearCliente} open={crearCliente} carga={() => {
                obtenerClientes(setClientData, initializer)

            }} />

            <DialogTitle id="alert-dialog-slide-title" >

                <span>Factura</span>

            </DialogTitle>
            <DialogContent >
                <DialogContentText id="alert-dialog-slide-description" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Seleccione el cliente y productos a facturar
                    <div style={{ display: 'flex' }}>

                        <Tooltip title="Crear cliente">
                            <IconButton aria-label="add_proveedor" onClick={() => setCrearCliente(true)}>
                                <PersonAddOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={!finalConsumer ? "Consumidor final" : "Cliente"}>
                            <IconButton aria-label="cambiar" onClick={() => setFinalConsumer(!finalConsumer)}>
                                {finalConsumer ? <AccountBoxIcon /> : <SupervisedUserCircleIcon />}
                            </IconButton>
                        </Tooltip>

                    </div>


                </DialogContentText>
                <Grid container spacing={2}>

                    {!finalConsumer && (
                        <Grid item xs={12} md={6} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Autocomplete

                                style={{ width: '100%' }}
                                size="small"
                                options={clientData}

                                value={getName3(client)}
                                onChange={(event, newValue) => {
                                    if (newValue != null) {

                                        setClient(newValue.id);

                                    } else {

                                        setClient('')

                                    }

                                }}
                                getOptionLabel={(option) => option.document + " - " + option.names}
                                // prints the selected value
                                renderInput={params => (
                                    <TextField variant="outlined" {...params} label="Seleccione un cliente" variant="outlined" fullWidth />
                                )}
                            />

                        </Grid>
                    )
                    }



                    <Grid item xs={12} md={finalConsumer ? 12 : 6} style={{ display: 'flex' }}>
                        <Autocomplete

                            style={{ width: '100%' }}
                            size="small"
                            options={productosData}
                            value={getName(producto, productosData)}

                            onChange={(event, newValue) => {
                                if (newValue != null) {

                                    setProducto(newValue.id);
                                    setProductoC(newValue)
                                    setCantidad(1)
                                    setFraction(newValue.fraction)
                                } else {
                                    setProductoC(null)
                                    setProducto('')

                                }
                            }}
                            getOptionLabel={(option) => option.bar_code + " - " + option.name + "- Unidad: " + obtenerFraccionUnidades(option.stock,option.fraction).unity + (option.fraction != 0 ? " - fraccion: " + obtenerFraccionUnidades(option.stock,option.fraction).frac : "")}
                            // prints the selected value
                            renderInput={params => (
                                <TextField variant="outlined" {...params} label="Seleccione un producto" variant="outlined" fullWidth />
                            )}
                        />

                    </Grid>
                    <Grid item xs={12} md={productoC != null ? (productoC.fraction != 0 ? 6 : 12) : 12} >    <TextField
                        variant="outlined"
                        style={{ width: '100%' }}
                        type="number"
                        size="small"
                        label="Unidad"

                        value={cantidad}
                        onChange={(e) => {
                            setCantidad(e.target.value)
                            if (productoC != null) {
                                if (productoC.fraction != 0) {
                                    setFraction(cambiarFraccionamiento(productoC, 'cantidad', e.target.value))

                                }
                            }

                        }}

                    /></Grid>
                    {
                        productoC != null ?
                            productoC.fraction != 0 ?
                                <Grid item xs={12} md={finalConsumer ? 6 : 6} >    <TextField
                                    variant="outlined"
                                    style={{ width: '100%' }}

                                    size="small"
                                    label="Fracciones"

                                    value={fraction}
                                    onChange={(e) => {
                                        const re = /^[0-9\b]+$/;

                                        if (e.target.value === "" || re.test(e.target.value)) {
                                            setFraction(e.target.value)
                                            setCantidad(cambiarFraccionamiento(productoC, 'fraccion', e.target.value).toFixed(3) * 1)

                                        }
                                    }}

                                /></Grid>
                                : null : null
                    }

                    {
                        ((cantidad == 0 && fraction != 0) || (fraction == 0 && cantidad != 0)) && (productoC != null ? (productoC.fraction != 0 ? true : false) : false) ?
                            <Grid item xs={12} md={12}>

                                <Alert severity="info">No hay stock suficiente</Alert>
                            </Grid>
                            : null
                    }



                    <Grid item xs={12} md={12}>

                        <MaterialTable
                            key={1}
                            id={1}
                            icons={TableIcons}
                            columns={[
                                {
                                    title: 'Imágen',
                                    field: 'avatar',
                                    editable: 'never',
                                    render: rowData => (
                                        <img
                                            onClick={() =>{
                                                setFoto(true)
                                                setImageSelected(rowData.image)
                                            }}
                                            style={{ height: 36, width: 36, borderRadius: 36 ,cursor: 'pointer' }}
                                            src={PUBLIC_PATH+"storage/" + rowData.image}
                                        />
                                    ),
                                },
                                {
                                    title: 'Laboratorio',
                                    field: 'warehouse',
                                    render: rowData => (
                                        <span >{rowData.warehouse}</span>
                                    ),
                                    editable: 'never'
                                },
                                {
                                    title: 'Producto',
                                    field: 'product',
                                    render: rowData => (
                                        <span >{rowData.product}</span>
                                    ), editable: 'never'
                                },
                                {
                                    title: 'Descripcion',
                                    field: 'description',
                                    render: rowData => (
                                        <span >{rowData.description}</span>
                                    ), editable: 'never'
                                },
                                { title: "Descuento", field: "discount", type: "currency" },
                                { title: "Unidades", field: "unity", editable: 'never' },
                                { title: "Fracciones", field: "fraction", editable: 'never' },

                                { title: "Precio", field: "price", type: "currency" },


                                { title: "SubTotal", field: "subtotal", type: "currency", editable: 'never' },




                            ]}
                            cellEditable={{
                                onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                                    return new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                            if (newValue !== "") {
                                                if (newValue >= 0) {
                                                    const dataUpdate = [...productos];

                                                    const index = rowData.tableData.id;
                                                    dataUpdate[index][columnDef.field] = newValue;
                                                    //RECALCULAR SUBTOTAL
                                                    let nuevoSub = (dataUpdate[index].quantity * dataUpdate[index].price).toFixed(2)
                                                    //RESTAR DESCUENTO
                                                    nuevoSub = dataUpdate[index].hasOwnProperty('discount')?(nuevoSub - dataUpdate[index].discount):nuevoSub
                                                    let disc=0;
                                                    if(columnDef.field=="discount"){
                                                        if(dataUpdate[index].hasOwnProperty('discount')){
                                                           let m =  dataUpdate[index].discount-(oldValue!=undefined?oldValue:0)
                                                           console.log(dataUpdate[index].discount)
                                                           console.log(oldValue)
                                                            disc =  discount+(m)
                                                        }
                                                      

                                                    }

                                                    //CALCULAR EL SUBTOTAL
                                                    let tSub = parseFloat((subTotalV - dataUpdate[index].subtotal)) + parseFloat(nuevoSub);
                                                    //CALCULAR EL SUBTOTAL SI ES IVA ==0
                                                    let tSubSinIva =  dataUpdate[index].has_iva == 0 ? tSub : 0
                                                    dataUpdate[index].subtotal = nuevoSub

                                                    setSubTotalV(tSub)
                                                    setSubTotalVI(tSubSinIva)
                                                    setDiscount(disc)
                                                    setProductos([...dataUpdate]);

                                                }
                                            }
                                            resolve();
                                        }, 1000)
                                    });
                                }
                            }}

                            data={
                                productos
                            }
                            title="Productos"

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
                                icon: TableIcons.MonetizationOnIcon,
                                tooltip: 'Cambio',
                                isFreeAction: true,
                                onClick: (event, rowData) => {
                                  setCambioCliente(true)
                                }
                            },
                            {
                                icon: TableIcons.Delete,
                                tooltip: 'Eliminar',

                                onClick: (event, rowData) => {
                                    quitar(rowData)
                                }
                            }]}
                            components={{
                                Container: props => <Paper {...props} elevation={0} />
                            }}

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
                    <Grid item xs={12} md={12} style={{ display: 'flex', justifyContent: 'flex-end' }} >
                        <TextField
                            variant="outlined"

                            size="small"
                            label="SubTotal"
                            value={subTotalV.toFixed(2)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />

                    </Grid>
                    <Grid item xs={12} md={12} style={{ display: 'flex', justifyContent: 'flex-end' }} >
                        <TextField
                            variant="outlined"

                            size="small"
                            label="Descuento"
                            value={discount.toFixed(2)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />

                    </Grid>
                    <Grid item xs={12} md={12} style={{ display: 'flex', justifyContent: 'flex-end' }} >
                        <TextField
                            variant="outlined"

                            size="small"
                            label="Iva"
                            value={((subTotalV - subTotalVI) * 0.12).toFixed(2)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />

                    </Grid>
                    <Grid item xs={12} md={12} style={{ display: 'flex', justifyContent: 'flex-end' }} >
                        <TextField
                            variant="outlined"

                            size="small"
                            label="Total"
                            value={(subTotalV + ((subTotalV - subTotalVI) * 0.12)).toFixed(2)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />

                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    limpiar()
                }} color="default">
                    Cancelar
                </Button>
                <Button color="primary" disabled={productos.length == 0} onClick={() => {
                    setConfirmarMensaje(true)
                }}>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
