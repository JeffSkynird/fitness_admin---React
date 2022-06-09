import React from 'react'
import Skeleton from '@material-ui/lab/Skeleton';
import CssBaseline from '@material-ui/core/CssBaseline'
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import SearchIcon from '@material-ui/icons/Search';
import { usePagination, useSortBy, useTable } from 'react-table'

import { Box, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, makeStyles, MenuItem, OutlinedInput, Select, TablePagination, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import { obtenerTodosMonitoreo } from '../../../../utils/API/participantes'
import { obtenerTodosMonitoreo as obtenerTodosEvents } from '../../../../utils/API/steps'
import { obtenerTodos as obtenerTodosCategories } from '../../../../utils/API/category'

const useStyles = makeStyles({
  table: {

    "& .MuiTableCell-root": {
      borderLeft: "1.6px solid rgba(224, 224, 224, 1)"
    }
  }
});
function Table({ columns, data }) {
  const theme = useTheme();
  const classes = useStyles();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, headerGroups, rows, prepareRow, page, canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }, } = useTable({
      columns,
      data,
      initialState: { pageIndex: 0,pageSize:20 },
    }
    ,
    useSortBy,
      usePagination)

  // Render the UI for your table
  return (
    <div>
      <MaUTable {...getTableProps()} style={{ marginTop: 5, overflowX: 'auto', display: matches ? 'block' : 'auto' }} className={classes.table}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()} >
              {headerGroup.headers.map(column => (
                <TableCell {...column.getHeaderProps(column.getSortByToggleProps())} align="center">
                  {column.render('Header')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <TableCell {...cell.getCellProps()} >
                      {cell.render('Cell')}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>

      </MaUTable>
      <TablePagination

        rowsPerPageOptions={[10, 20,  50,100]}
        component="div"
        count={rows.length}
        rowsPerPage={pageSize}
        page={pageIndex}
        onPageChange={(e, newPage) => {
          console.log(newPage)
          gotoPage(newPage)
        }}
        labelRowsPerPage="Filas por página"
        onRowsPerPageChange={e => {
          setPageSize(Number(e.target.value))
        }}
      />

    </div>
  )
}

function App() {

  const [datos, setDatos] = React.useState([])
  const [datosResp, setDatosResp] = React.useState([])
  const [datos2, setDatos2] = React.useState([])
  const [texto, setTexto] = React.useState('')
  const [category, setCategory] = React.useState(1)
  const [categoryData, setCategoryData] = React.useState([])


  const [columns, setColumns] = React.useState([{
    Header: 'Participantes',
    columns: [
      {
        Header: 'RANK',
        accessor: 'num',
      },
      {
        Header: 'ATLETHE',
        accessor: 'fullname',
      },
      {
        Header: 'Box',
        accessor: 'box',
      },
      {
        Header: 'Total',
        accessor: 'total',
      }
    ],
  }])



  React.useEffect(() => {
    
      obtenerTodosMonitoreo(setDatos, setDatosResp, 1)
      obtenerTodosEvents(setDatos2)
      obtenerTodosCategories(setCategoryData)
 
}, [])
  React.useEffect(() => {
    if (datos2.length > 0) {
      let temp = [
        {
          Header: 'PARTICIPANTS',
          columns: [
            {
              Header: 'RANK',
              accessor: 'num',
            },
            {
              Header: 'ATLETHE',
              accessor: 'fullname',
            },
            {
              Header: 'BOX',
              accessor: 'box',
            },
            {
              Header: 'TOTAL',
              accessor: 'total',
            }
          ],
        }
      ]
      datos2.map(event => {
        temp.push(event)
      })
      console.log("EJECUTANDOSE")
      console.log(temp)
      setColumns(temp)
    }
  }, [datos2])

  //funcion para filtrar por nombre de participant
  const filterByName = (name) => {
    let temp = datosResp.slice().filter(e => e.fullname.toLowerCase().includes(name.toLowerCase()) || e.box.toLowerCase().includes(name.toLowerCase()))

    setTexto(name)
    setDatos(temp)
  }
  const searchByCategory = (cat) => {
    obtenerTodosMonitoreo(setDatos, setDatosResp, cat)
    setCategory(cat)
  }
  return (
    <Box mt={3}>


      <Grid container spacing={2} style={{ paddingLeft: 5, paddingRight: 5 }}>
        <Grid item xs={12}>
          <Typography variant="h4" color="initial" style={{ fontWeight: 'bold' }}>OPEN LEADERBOARD</Typography>
        </Grid>
        <Grid item xs={6}>
          <FormControl variant='outlined' style={{ width: '100%' }} size="small">
            <InputLabel htmlFor="standard-adornment-password">Buscar</InputLabel>
            <OutlinedInput
              value={texto}
              onChange={(e) => filterByName(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton

                    edge="end"
                  >
                    {<SearchIcon />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl variant="outlined" style={{ width: '100%' }} size="small">
            <InputLabel id="demo-simple-select-outlined-label">Categoría</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={category}
              onChange={(e) => searchByCategory(e.target.value)}
              label="Categoría"
            >
              {
                categoryData.map(cat => (
                  <MenuItem value={cat.id}>{cat.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Grid>
        {datos.length == 0&&datos2.length==0 ?
          <Grid item xs={12} style={{marginTop:20}}>
            <Skeleton />
            <Skeleton animation={false} />
            <Skeleton animation="wave" />
          </Grid>
          :
          <Grid item xs={12} >
            <Table columns={columns} data={datos} />
          </Grid>
        }

      </Grid>





    </Box>
  )
}

export default App
