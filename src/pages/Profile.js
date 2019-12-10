import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { IconButton, Snackbar, TextField, Tooltip, withStyles } from '@material-ui/core'
import axios from 'axios'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import Cookies from 'js-cookie'
import { AdminApi } from '../api/admin'
import { Link } from 'react-router-dom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import Paper from '@material-ui/core/Paper'

const styles = theme => ({
    root: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    },
    profile: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing.unit * 10,
        [theme.breakpoints.down('sm')]: {
            paddingTop: theme.spacing.unit * 6,
            padding: theme.spacing.unit * 3,
            width: '100%',
            height: '100%'
        }
    },
    avatar: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: theme.spacing.unit * 3,
        height: 150,
        width: 150,
    },
    ArrowBackButton: {
        zIndex: 99999,
        position: 'fixed',
        top: theme.spacing.unit,
        left: theme.spacing.unit
    },
})

class Profile extends Component {
    state = {
        id: 0,
        username: '',
        avatar: '',
        password: '',
        editPassword: false,
        snackBarOpen: false,
        message: ''
    }

    componentWillMount () {
        let username = Cookies.get('username')
        if (username === undefined)
            this.props.match.push('/login')

        AdminApi.getUser(username)
            .then(data => {
                this.setState({id: data.user.id, username: data.user.username, avatar: data.user.avatar})
            })
            .catch(err => this.setState({snackBarOpen: true, message: err.toString()}))
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        this.setState({snackBarOpen: false})
    }

    handleLogoChange = e => {
        if (e.target.files[0] === undefined)
            return

        if (!/image\/\w+/.test(e.target.files[0].type)) {
            this.setState({snackBarOpen: true, message: '请确保文件为图像类型'})
            return
        }

        let reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload = e => {
            this.setState({avatar: e.currentTarget.result})
        }
    }

    handleEdit = () => {
        if (this.state.avatar === '') {
            this.setState({snackBarOpen: true, message: '头像不能为空'})
            return
        }

        if (this.state.username === '') {
            this.setState({snackBarOpen: true, message: '用户名不能为空'})
            return
        }

        let data = {
            'avatar': this.state.avatar,
            'username': this.state.username
        }

        if (this.state.editPassword) {
            if (this.state.password === '') {
                this.setState({snackBarOpen: true, message: '密码不能为空'})
                return
            }
            data = {...data, password: this.state.password}
        }

        AdminApi.editUser(this.state.id, data)
            .then(() => this.setState({snackBarOpen: true, message: '保存成功'}))
            .catch(() => this.setState({snackBarOpen: true, message: '保存失败'}))
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
                <Paper className={classes.profile}>
                    <Avatar src={this.state.avatar} className={classes.avatar}/>
                    <input type="file" onChange={this.handleLogoChange}/>
                    <TextField
                        label="用户名"
                        disabled={this.state.username === 'admin'}
                        margin="normal"
                        value={this.state.username}
                        onChange={e => this.setState({username: e.target.value})}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.state.editPassword}
                                onChange={e => this.setState({editPassword: e.target.checked})}
                                color="primary"
                            />
                        }
                        label="修改密码"
                    />
                    {this.state.editPassword &&
                    <TextField
                        label="密码"
                        margin="normal"
                        value={this.state.password}
                        onChange={e => this.setState({password: e.target.value})}
                    />}
                    <Button variant="outlined" color="primary" onClick={this.handleEdit}>保存</Button>
                </Paper>
            </div>
        )
    }
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Profile)