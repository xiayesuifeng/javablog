import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {MuiThemeProvider,createMuiTheme} from '@material-ui/core/styles';
import {BrowserRouter as Router} from "react-router-dom";
import 'typeface-roboto'

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#6ec6ff',
            main: '#2196F3',
            dark: '#0069c0',
            contrastText: '#FFF',
        },
        secondary: {
            light: '#ff616f',
            main: '#ff1744',
            dark: '#c4001d',
            contrastText: '#FFF',
        },
    },
});

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <Router>
            <App/>
        </Router>
    </MuiThemeProvider>, document.getElementById('root'));
registerServiceWorker();
