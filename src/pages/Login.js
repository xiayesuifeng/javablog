import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Button, IconButton, Paper, Snackbar, TextField, Tooltip } from '@material-ui/core/index.es'
import { AdminApi } from '../api/admin'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

const styles = theme => ({
    root: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh'
    },
    login: {
        padding: theme.spacing.unit * 3,
        [theme.breakpoints.down('sm')]: {
            paddingTop: theme.spacing.unit * 6,
            width: '100%',
            height: '100%'
        }
    },
    ArrowBackButton: {
        zIndex: 99999,
        position: 'fixed',
        top: theme.spacing.unit,
        left: theme.spacing.unit
    }
})

class Login extends Component {
    state = {
        username: '',
        password: '',
        message: '',
        snackBarOpen: false
    }

    handleLogin = () => {
        if (this.state.username === ''){
            this.setState({snackBarOpen: true, message: '用户名不能为空'})
            return
        }
        if (this.state.password === ''){
            this.setState({snackBarOpen: true, message: '密码不能为空'})
            return
        }
        AdminApi.login(this.state.username, this.state.password)
            .then(() => {
                Cookies.set('username',this.state.username)
                this.props.history.push('/')
            })
            .catch(err => {
                this.setState({message: err.toString()})
            })
    }

    componentDidMount () {
        document.title = '登录'
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        this.setState({snackBarOpen: false})
    }

    render () {
        const {classes} = this.props

        return (
            <div className={classes.root}>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={this.state.snackBarOpen}
                    autoHideDuration={4000}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.state.message}</span>}
                />
                <Tooltip id="tooltip-fab" title="返回首页">
                    <IconButton aria-label="ArrowBack" className={classes.ArrowBackButton} component={Link} to="/">
                        <ArrowBackIcon/>
                    </IconButton>
                </Tooltip>
                <Paper className={classes.login}>
                    <span>登录</span>
                    <TextField
                        id="username"
                        label={'用户名'}
                        type="username"
                        value={this.state.username}
                        onChange={e => this.setState({username: e.target.value})}
                        margin="normal"
                        fullWidth
                    />
                    <TextField
                        id="password"
                        label={'密码'}
                        type="password"
                        value={this.state.password}
                        onChange={e => this.setState({password: e.target.value})}
                        margin="normal"
                        fullWidth
                    />
                    <Button variant="contained" color="primary" onClick={this.handleLogin}>登录</Button>
                </Paper>
            </div>
        )
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Login)