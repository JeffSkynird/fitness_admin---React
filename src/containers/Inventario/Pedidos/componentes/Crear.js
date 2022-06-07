import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { InputAdornment, Tooltip } from '@material-ui/core';
import Initializer from '../../../../store/Initializer'
import Confirmar from '../../../../components/Confirmar'
import Slide from '@material-ui/core/Slide';
import { PersonAddOutlined, PostAddOutlined } from '@material-ui/icons';

import { Checkbox, FormControlLabel, Grid } from '@material-ui/core';
import { editar as editarPedido, obtenerDetalleOrden, registrar as registrarPedido } from '../../../../utils/API/pedidos';
import { obtenerTodos } from '../../../../utils/API/proveedores';
import { obtenerTodos as obtenerProductos } from '../../../../utils/API/sistemas';
import Crear from '../../Productos/componentes/Crear'
import CrearProveedor from '../../Proveedores/componentes/Crear'


import IconButton from '@material-ui/core/IconButton';

import { Autocomplete } from '@material-ui/lab';
import MaterialTable from 'material-table';
import { LocalizationTable, TableIcons } from '../../../../utils/table';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function CrearN(props) {
    const initializer = React.useContext(Initializer);
    const [open, setOpen] = React.useState(false)
    const [total, setTotal] = React.useState(0)

    const [cantidad, setCantidad] = React.useState("")
    const [proveedor, setProveedor] = React.useState("")
    const [proveedorData, setProveedorData] = React.useState([])
    const [autorizar, setAutorizar] = React.useState(false)
    const [productos, setProductos] = React.useState([])
    const [productosData, setProductosData] = React.useState([])
    const [producto, setProducto] = React.useState([])
    const [crearProducto, setCrearProducto] = React.useState(false)
    const [crearProveedor, setCrearProveedor] = React.useState(false)

    React.useEffect(() => {
        if (initializer.usuario != null) {
            obtenerTodos(setProveedorData, initializer)
            obtenerProductos(setProductosData, initializer)

        }
    }, [initializer.usuario])
    React.useEffect(() => {
        if (props.sistema != null) {
            setProductos([])
            obtenerDetalleOrden(props.sistema.id,setProductos,initializer)

        }
    }, [props.sistema])
    const guardar = () => {

       if (props.sistema == null) {
            registrarPedido({ total:total,suppliers: validarData(),authorize:autorizar?1:0 }, initializer,    props.carga)
            obtenerProductos(setProductosData, initializer)

         
        } else {
            editarPedido(props.sistema.id, { total:total,suppliers: validarData(),authorize:autorizar?1:0 }, initializer, props.carga)
            

        }
        props.setOpen(false)
        vaciarCampos()
    }
      const vaciarCampos=()=>{
        props.setSelected(null)
        setCantidad("")
        setProveedor("")
        setProducto([])
        setProductos([])
        setTotal(0)
    }
    const limpiar = () => {
        setCantidad("")
        setProveedor("")
        setProducto([])
        setProductos([])
        setTotal(0)
        props.setSelected(null)
        props.carga()
    }
   
    const getName = (id,data) => {
        let object = null
        data.map((e) => {
            if (id == e.id) {
                object = { ...e }
            }
        })
        return object
    }
    const validarData=()=>{
        let final=[]

        productos.map((e)=>{
            
            if (!final.some(i => i.supplier_id === e.supplier_id)) {
                final.push({
                    supplier_id:e.supplier_id,
                    products:obtenerProductosPorId(e.supplier_id)
                })
            }
           
        })
        return final
    }
    const obtenerProductosPorId=(id)=>{
        return productos.filter((e)=>e.supplier_id==id)
    }
    const existeEnDetalle=(id)=>{
        let exs = false
        productos.map((e)=>{
          if(e.product_id==id){
              exs=true
          }  
        })
        return exs
    }
    const agregar=() => {
        if(producto.length!=0!=""&&proveedor!=""&&cantidad!=""&&cantidad>0&&cantidad>0){
            let t = productos.slice()
            producto.map((e)=>{
                if(!existeEnDetalle(e.id)){
                t.push({product:e.name,supplier:obtenerProveedor(proveedor),product_id:e.id,quantity:cantidad,supplier_id:proveedor})
                }
            })
            setProductos(t)
            setCantidad('')
  
            setProducto([])
        }else{
            initializer.mostrarNotificacion({ type: "warning", message: 'No deje campos vacíos' });

        }
       
    }
    const obtenerProveedor=(id)=> {
        let nombre=""
        proveedorData.map((e)=>{
            if(e.id==id){
                nombre=e.business_name
            }
        })
        return nombre
    }
    const obtenerProducto=(id)=> {
        let nombre=""
        productosData.map((e)=>{
            if(e.id==id){
                nombre=e.name
            }
        })
        return nombre
    }
    const quitar=(row) => {
        let id = row.tableData.id
        let t = productos.slice()
      

        setProductos(t.filter((e,i) =>i!=id))
        setCantidad('')
        setProveedor('')
        setProducto([])
    }

    return (
        <Dialog
        fullWidth
        fullScreen
        maxWidth='md'
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => {
                props.setOpen(false)
                vaciarCampos()
            }}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
              <CrearProveedor sistema={null} setSelected={()=>null} setOpen={setCrearProveedor} open={crearProveedor} carga={()=>{
                obtenerTodos(setProveedorData, initializer)
       
              
         }} />
             <Crear sistema={null} setSelected={()=>null} setOpen={setCrearProducto} open={crearProducto} carga={()=>{
                 obtenerProductos(setProductosData, initializer)
         }} />
            <Confirmar open={open} setOpen={setOpen} accion={guardar} titulo='¿Desea continuar? Se anulará la orden y se creará otra.'/>
            <DialogTitle id="alert-dialog-slide-title">{props.sistema!=null?'Orden de compra '+props.sistema.id:'Orden de compra'}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description"  style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    {props.sistema != null ? "Formulario de edición de compras" : "Formulario de creación de compras"}  
                    <div style={{display:'flex'}}>

                    <Tooltip title="Crear proveedor">
                <IconButton aria-label="add_proveedor" onClick={()=>setCrearProveedor(true)}>
                    <PersonAddOutlined />
                </IconButton>
                </Tooltip>
                      <Tooltip title="Crear producto">
                       
                <IconButton aria-label="add_producto" onClick={()=>setCrearProducto(true)}>
                    <PostAddOutlined />
                </IconButton>
                </Tooltip>

</div>
                   
                </DialogContentText>
                <Grid container spacing={2}>
                <Grid item xs={12} md={4} style={{ display: 'flex' }}>
                        <Autocomplete

                            style={{ width: '100%' }}
                            size="small"
                            options={productosData}
                            multiple
                            value={producto}
                            onChange={(event, newValue) => {
                                setProducto(newValue);
                              }}
                              getOptionLabel={(option) => option.bar_code+" - "+option.name+ " - stock: "+option.stock}
                         // prints the selected value
                            renderInput={params => (
                                <TextField    variant="outlined" {...params} label="Seleccione un producto" variant="outlined" fullWidth />
                            )}
                        />

                    </Grid>
                    <Grid item xs={12} md={4}>    <TextField
                        variant="outlined"
                        style={{  width: '100%' }}
                        type="number"
                        size="small"
                        label="Cantidad"
                        min="0"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}

                    /></Grid>
                    <Grid item xs={12} md={4} style={{ display: 'flex' }}>
                        <Autocomplete
    size="small"
                            style={{ width: '100%' }}
                            options={proveedorData}
                            value={getName(proveedor,proveedorData)}
                            getOptionLabel={(option) => option.business_name}
                            onChange={(event, value) => {
                                if (value != null) {

                                    setProveedor(value.id)
                                } else {

                                    setProveedor('')

                                }

                            }} // prints the selected value
                            renderInput={params => (
                                <TextField {...params} label="Seleccione un proveedor" variant="outlined" fullWidth />
                            )}
                        />

                    </Grid>
                    <Grid item xs={12} md={12}>    <TextField
                        variant="outlined"
                        style={{  width: '100%' }}
                        type="number"
                        size="small"
                        label="Total de la compra"
                        value={total}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                        onChange={(e) => setTotal(e.target.value)}

                    /></Grid>
                  
                 
                 <Grid item xs={12} md={12}>

                 <MaterialTable
                    icons={TableIcons}
                    columns={[
                        {
                            title: 'Producto',
                            field: 'product',
                            render: rowData => (
                             <span >{rowData.product}</span>
                            ),
                          },
                        { title: "Cantidad", field: "quantity" },
                        { title: "Proveedor", field: "supplier" }
                



                    ]}
                    data={
                        productos
                    }

                    localization={LocalizationTable}
                title="Listado del pedido"
                actions={[      {
                    icon: TableIcons.Add,
                    tooltip: 'Agregar',
                    isFreeAction:true,
                    onClick: (event, rowData) => {
                      agregar()
                    }
                },
                {
                    icon: TableIcons.Delete,
                    tooltip: 'Eliminar',
                 
                    onClick: (event, rowData) => {
                      quitar(rowData)
                    }
                }]}

                    options={{
                        pageSize:10,
                
                        actionsColumnIndex: -1,
                        width:'100%',
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

            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    props.setOpen(false)
                    vaciarCampos()
                }} color="default">
                    Cancelar
                </Button>
                <Button color="primary" onClick={()=>{
                     if(props.sistema!=null){
                        setOpen(true)
                     }else{
                        guardar()
                     }
                    
                }}>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
