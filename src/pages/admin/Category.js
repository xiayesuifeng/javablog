import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { IconButton, ListItemText, Snackbar, TextField, withStyles } from '@material-ui/core'
import InputAdornment from '@material-ui/core/InputAdornment'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import DoneIcon from '@material-ui/icons/Done'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { CategoryApi } from '../../api/category'

const styles = theme => ({
    root: {
        padding: theme.spacing.unit * 5,
        display: 'inline-flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        justifyItems: 'center'
    },
    avatar: {
        margin: 'auto',
        marginBottom: theme.spacing.unit * 3,
        height: 150,
        width: 150,
    },
})

class Category extends Component {
    state = {
        categories: [],
        snackBarOpen: false,
        message: '',
        addCategory: '',
        editID: -1,
    }

    componentWillMount () {
        this.getCategories()
    }

    getCategories () {
        CategoryApi.getCategory()
            .then(data => {
                this.setState({categories: data.categorys})
            })
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        this.setState({snackBarOpen: false})
    }

    addCategory = () => {
        if (this.state.addCategory !== '') {
            CategoryApi.addCategory(this.state.addCategory)
                .then(() => {
                    this.setState({snackBarOpen: true, message: '添加成功', addCategory: ''})
                    this.getCategories()
                })
                .catch(err => {
                    this.setState({snackBarOpen: true, message: err.toString()})
                })
        }
    }

    delCategory = id => () => {
        CategoryApi.delCategory(id)
            .then(() => {
                this.setState({snackBarOpen: true, message: '删除成功'})
                this.getCategories()
            })
            .catch(err => {
                this.setState({snackBarOpen: true, message: err.toString()})
            })
    }

    editCategory = () => {
        CategoryApi.editCategory(this.state.editID, this.state.addCategory)
            .then(() => {
                this.setState({snackBarOpen: true, message: '编辑成功', addCategory: '', editID: -1})
                this.getCategories()
            })
            .catch(err => {
                this.setState({snackBarOpen: true, message: err.toString()})
            })
    }

    handleEdit = category => () => {
        this.setState({editID: category.ID, addCategory: category.name})
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
                <TextField
                    id="category"
                    label='分类名'
                    type="text"
                    value={this.state.addCategory}
                    onChange={e => this.setState({addCategory: e.target.value})}
                    margin="normal"
                    InputProps={{
                        endAdornment: <InputAdornment position="start">
                            {this.state.editID === -1 ?
                                <IconButton onClick={this.addCategory}>
                                    <AddIcon/>
                                </IconButton>
                                :
                                <IconButton onClick={this.editCategory}>
                                    <DoneIcon/>
                                </IconButton>
                            }
                        </InputAdornment>,
                    }}
                />
                <List>
                    {this.state.categories.map(category => {
                        return (
                            <ListItem>
                                <ListItemText
                                    primary={category.name}
                                    secondary={'ID:' + category.ID}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={this.handleEdit(category)}>
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton onClick={this.delCategory(category.ID)}>
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

Category.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Category)