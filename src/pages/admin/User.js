import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { IconButton, ListItemText, Snackbar, withStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import DeleteIcon from '@material-ui/icons/Delete'
import { AdminApi } from '../../api/admin'

const styles = theme => ({
    root: {
        padding: theme.spacing.unit * 5,
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        justifyItems: 'center'
    },
})

class User extends Component {
    state = {
        users: [],
        snackBarOpen: false,
        message: '',
    }

    componentWillMount () {
        this.getUsers()
    }

    getUsers () {
        AdminApi.getUsers()
            .then(data => {
                this.setState({users: data.users})
            })
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        this.setState({snackBarOpen: false})
    }

    delUser = id => () => {
        AdminApi.deleteUser(id)
            .then(() => {
                this.setState({snackBarOpen: true, message: '删除成功'})
                this.getUsers()
            })
            .catch(err => {
                this.setState({snackBarOpen: true, message: err.toString()})
            })
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
                <List>
                    {this.state.users.map(user => {
                        return (
                            <ListItem>
                                <ListItemText
                                    primary={user.username}
                                    secondary={'密码:' + user.password}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={this.delUser(user.id)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        )
                    })}
                </List>
            </div>
        )
    }
}

User.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(User)