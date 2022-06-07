
import React, { useContext, useState } from 'react';
import AppBar from './components/AppBar'
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import {

  Switch,
  Route,
  Redirect
} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Initializer from './store/Initializer'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Login from './containers/main/Login'
import { useHistory } from "react-router-dom";
import Drawer2 from './components/Drawer2'
import Categorias from './containers/administracion/categorias'
import Boxes from './containers/administracion/boxes'
import Competencias from './containers/administracion/competencias'
import Eventos from './containers/administracion/eventos'
import Participantes from './containers/administracion/participantes'
import ControlarCompetencias from './containers/control/competencias'
import Monitoreo from './containers/control/monitoreo'
import Registros from './containers/control/registros'

import { red } from '@material-ui/core/colors';
import { yellow } from '@material-ui/core/colors';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function App(props) {
  const { usuario, notificacion, mostrarNotificacion, loader, sound, playSound } = useContext(Initializer);
  let history = useHistory();
  const [colorP, setColorP] = useState(red)
  const [colorS, setColorS] = useState(yellow)
  const [white, setWhite] = useState(createMuiTheme({
    palette: {
      primary: colorP,
      secondary: colorS,
      type: 'light',
    },

  }))
  const [dark, setDark] = useState(createMuiTheme({
    palette: {
      primary: colorP,

      secondary: colorS,

      type: 'dark',
    },

  }))
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    mostrarNotificacion(null);
  };
  React.useEffect(() => {
    if (notificacion != null) {

      setTimeout(function () { mostrarNotificacion(null) }, 3000);
    }
  }
    , [notificacion])
  var themeLight = createMuiTheme({
    palette: {
      primary: colorP,
      secondary: colorS,
      type: 'light',
    },

  });
  var themeDark = createMuiTheme({
    palette: {
      primary: colorP,

      secondary: colorS,

      type: 'dark',
    },

  });
  React.useEffect(() => {
    setWhite(createMuiTheme({
      palette: {
        primary: {
          main: colorP[500],
        },

        secondary: {
          main: colorS['A400'],
        },
        type: 'light',
      },

    }))
    setDark(createMuiTheme({
      palette: {
        primary: {
          main: colorP[500],
        },
        secondary: {
          main: colorS['A400'],
        },
        type: 'dark',
      },

    }))
  }, [colorP, colorS])
  let themeFinal = white
  let tm = localStorage.getItem("theme");


  let [themeColor, setThemeColor] = useState(themeFinal);
  let changeTheme = () => {
    let ct = themeColor.palette.type === "light" ? dark : white;
    setThemeColor(ct);
    let color = themeColor.palette.type == "light" ? "dark" : "light"
    localStorage.setItem("theme", color);
    // play(playSound,'ok')
  }
  let changeThemeColor = (pr, se) => {
    setColorP(pr)
    setColorS(se)
  }

  return (
     <ThemeProvider theme={tm == "dark" ? dark : white}>
    {/* <ThemeProvider theme={dark}> */}
      <React.Fragment>

        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} open={notificacion != null} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={notificacion != null ? notificacion.type : "success"}>
            {notificacion != null ? notificacion.message : ""}
          </Alert>
        </Snackbar>

        {loader != false ?
          <LinearProgress style={{ zIndex: 9999}} color="secondary" />

          :
          null
        }


        <CssBaseline />

        <Grid container style={{ flexGrow: 1 }}>
          <Grid item xs={12}>

            <Drawer2  history={history}>
              <Box component="main"  >
             
                <Switch>
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/administracion/participantes" component={Participantes} />
                  <Route exact path="/administracion/competencias" component={Competencias} />
                  <Route exact path="/administracion/eventos" component={Eventos} />
                  <Route exact path="/administracion/boxes" component={Boxes} />
                  <Route exact path="/administracion/categorias" component={Categorias} />
                  <Route exact path="/control/competencias" component={ControlarCompetencias} />
                  <Route exact path="/control/registros" component={Registros} />
                  <Route exact path="/control/monitoreo" component={Monitoreo} />
                  
                  <Route render={() => <Redirect to="/control/monitoreo" />} />
                  
                </Switch>



              </Box>
            </Drawer2>

          </Grid>
        </Grid>



      </React.Fragment>
    </ThemeProvider>

  );
}

