import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
    AppBar,
    Avatar,
    Hidden,
    IconButton, ListItemText,
    Paper,
    Snackbar,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
    List,
    ListItem,
    ListItemSecondaryAction
} from '@material-ui/core'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import TuiEditorViewer from '../component/TuiEditorViewer'
import { InfoContext } from '../App'
import { ArticleApi } from '../api/article'
import { CategoryApi } from '../api/category'
import { CommentApi } from '../api/comment'
import AddIcon from '@material-ui/icons/Add'
import InputAdornment from '@material-ui/core/InputAdornment'

const styles = theme => ({
    toolbar: theme.mixins.toolbar,
    root: {
        textAlign: 'left',
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh'
    },
    avatar: {
        backgroundColor: theme.palette.secondary.main
    },
    context: {
        paddingLeft: theme.spacing.unit * 20,
        paddingRight: theme.spacing.unit * 20,
        paddingBottom: theme.spacing.unit * 20,
        paddingTop: theme.spacing.unit * 2,
        [theme.breakpoints.down('sm')]: {
            paddingTop: theme.spacing.unit * 2,
            paddingBottom: theme.spacing.unit * 5,
            paddingLeft: theme.spacing.unit * 5,
            paddingRight: theme.spacing.unit * 5
        },
    },
    article: {
        display: 'inline-flex',
        flexDirection: 'column',
        [theme.breakpoints.up('md')]: {
            margin: theme.spacing.unit * 10,
            minWidth: 800,
        },
        [theme.breakpoints.down('sm')]: {
            flex: 1,
            margin: 0,
            width: '100%'
        },
    },
    header: {
        padding: theme.spacing.unit * 3,
        display: 'inline-flex',
        alignItems: 'center'
    },
    headerInfo: {
        paddingLeft: theme.spacing.unit,
        display: 'inline-flex',
        flexWrap: 'wrap',
        flex: 1,
        justifyContent: 'space-between',
    },
    ArrowBackButton: {
        zIndex: 99999,
        position: 'fixed',
        top: theme.spacing.unit,
        left: theme.spacing.unit
    },
    speedDial: {
        zIndex: 99999,
        position: 'fixed',
        bottom: theme.spacing.unit * 3,
        right: theme.spacing.unit * 3
    },
    comment: {
        padding: theme.spacing.unit * 5,
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing.unit * 2
        }
    }
})

class Article extends Component {
    state = {
        article: {},
        comments: [],
        category: '',
        markdown: '',
        open: false,
        snackBarOpen: false,
        message: '',
        username: '',
        time: '',
        addComment: ''
    }

    componentWillMount () {
        this.setState({username: Cookies.get('username')})

        ArticleApi.getArticleById(this.props.match.params.id)
            .then(data => {
                document.title = data.article.title

                ArticleApi.getArticleMDByUUID(data.article.Uuid)
                    .then(data => {
                        this.setState({markdown: data.markdown})
                    })
                CategoryApi.getCategoryName(data.article.category_id)
                    .then(data => {
                        this.setState({category: data.category.name})
                    })

                if (data.article.CreatedAt === data.article.UpdatedAt) {
                    this.setState({time: this.formatTime(data.article.CreatedAt)})
                } else {
                    this.setState({time: this.formatTime(data.article.UpdatedAt)})
                }

                this.setState({article: data.article})
            })

        this.getComments(this.props.match.params.id)
    }

    getComments(id) {
        CommentApi.getComment(id)
            .then(data => {
                this.setState({comments:data.comments})
            })
    }

    addComment = () => {
        let id = this.props.match.params.id
        CommentApi.addComment(id,this.state.addComment)
            .then(() => {
                this.setState({addComment: '',snackBarOpen: true, message: '添加成功!' })
                this.getComments(id)
            })
            .catch(err => this.setState({snackBarOpen: true, message: '添加失败!' + err}))
    }

    deleteComment = id => () => {
        CommentApi.delComment(id)
            .then(() => {
                this.setState({addComment: '',snackBarOpen: true, message: '删除成功!' })
                this.getComments(this.props.match.params.id)
            })
            .catch(err => this.setState({snackBarOpen: true, message: '删除失败!' + err}))
    }

    formatTime = time => {
        return new Date(time).toLocaleDateString()
    }

    handleClick = () => {
        this.setState(state => ({
            open: !state.open,
        }))
    }

    handleOpen = () => {
        if (this.state.username!==undefined) {
            this.setState({open: true})
        }
    }

    handleClose = () => {
        this.setState({open: false})
    }

    handleDelete = () => {
        ArticleApi.deleteArticle(this.props.match.params.id)
            .then(() => this.props.history.push('/'))
            .catch(err => this.setState({snackBarOpen: true, message: '删除失败!错误:' + err}))
    }

    render () {
        const {classes} = this.props

        let isTouch
        if (typeof document !== 'undefined') {
            isTouch = 'ontouchstart' in document.documentElement
        }

        return (
            <div className={classes.root}>
                <Hidden mdUp>
                    <AppBar>
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                component={Link} to="/"
                            >
                                <ArrowBackIcon/>
                            </IconButton>
                            <Typography variant="title" color="inherit">{this.state.article.title}</Typography>
                        </Toolbar>
                    </AppBar>
                </Hidden>
                <Hidden smDown>
                    <Tooltip id="tooltip-fab" title="返回首页">
                        <IconButton aria-label="ArrowBack" className={classes.ArrowBackButton} component={Link} to="/">
                            <ArrowBackIcon/>
                        </IconButton>
                    </Tooltip>
                </Hidden>
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
                <Hidden mdUp>
                    <div className={classes.toolbar}/>
                </Hidden>
                <Paper className={classes.article}>
                    <div className={classes.header}>
                        <Avatar aria-label="Recipe" className={classes.avatar}>
                            {this.state.article.tag}
                        </Avatar>
                        <InfoContext.Consumer>{
                            context => (
                                <div className={classes.headerInfo}>
                                    <Hidden smDown>
                                        <span>{this.state.article.title}</span>
                                    </Hidden>
                                    {context.useCategory ?
                                        <span>归类于 {this.state.category ? this.state.category : '已删除的分类'}</span> :
                                        <span/>}
                                    <span>更新于 {this.state.time}</span>
                                </div>
                            )
                        }
                        </InfoContext.Consumer>
                    </div>
                    <div className={classes.context}>
                        <TuiEditorViewer value={this.state.markdown}/>
                    </div>
                    <div className={classes.comment}>
                        <TextField
                            disabled={this.state.username===undefined}
                            id="comment"
                            label={this.state.username === undefined ? '登录以评论' : '评论'}
                            type="text"
                            value={this.state.addComment}
                            onChange={e => this.setState({addComment: e.target.value})}
                            margin="normal"
                            fullWidth
                            InputProps={{
                                endAdornment: <InputAdornment position="start">
                                        <IconButton
                                            disabled={this.state.username===undefined}
                                            onClick={this.addComment}>
                                            <AddIcon/>
                                        </IconButton>
                                </InputAdornment>,
                            }}
                        />
                        <List>
                        {this.state.comments.map(comment => (
                            <ListItem>
                                <Avatar src={comment.avatar}/>
                                <ListItemText
                                    primary={comment.username + ' 发布于'+comment.createTime}
                                    secondary={comment.comment}
                                />
                                {(this.state.username === 'admin' || this.state.username === comment.username) &&
                                <ListItemSecondaryAction>
                                    <IconButton onClick={this.deleteComment(comment.cid)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </ListItemSecondaryAction>}
                            </ListItem>
                        ))}
                        </List>
                    </div>
                </Paper>
                <SpeedDial
                    ariaLabel="SpeedDial"
                    className={classes.speedDial}
                    hidden={this.state.username !== 'admin'}
                    icon={<SpeedDialIcon/>}
                    onBlur={this.handleClose}
                    onClick={this.handleClick}
                    onClose={this.handleClose}
                    onFocus={isTouch ? undefined : this.handleOpen}
                    onMouseEnter={isTouch ? undefined : this.handleOpen}
                    onMouseLeave={this.handleClose}
                    open={this.state.open}
                >
                    <SpeedDialAction
                        icon={<DeleteIcon/>}
                        tooltipTitle="删除"
                        onClick={this.handleDelete}
                    />
                    <SpeedDialAction
                        icon={<EditIcon/>}
                        tooltipTitle="编辑"
                        onClick={() => this.props.history.push('/articleEditor/' + this.props.match.params.id)}
                    />
                </SpeedDial>
            </div>
        )
    }
}

Article.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Article)