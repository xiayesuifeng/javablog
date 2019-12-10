import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import MenuIcon from '@material-ui/icons/Menu'
import AddIcon from '@material-ui/icons/Add'
import ShareIcon from '@material-ui/icons/Share'
import {
    AppBar,
    Avatar,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Drawer,
    Hidden,
    IconButton,
    ListItemText,
    MenuItem,
    MenuList,
    Snackbar,
    TextField,
    Toolbar,
    Typography
} from '@material-ui/core'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import CategoryIcon from '@material-ui/icons/Category'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import DoneIcon from '@material-ui/icons/Done'
import SettingsIcon from '@material-ui/icons/Settings'
import Dialog from '@material-ui/core/Dialog/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent/DialogContent'
import DialogActions from '@material-ui/core/DialogActions/DialogActions'
import List from '@material-ui/core/List/List'
import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction'
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment'
import TuiEditorViewer from '../component/TuiEditorViewer'
import { InfoContext } from '../App'
import Clipboard from 'react-clipboard.js'
import { CategoryApi } from '../api/category'
import { AdminApi } from '../api/admin'

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: 250,
        [theme.breakpoints.up('md')]: {
            position: 'relative',
        },
    },
    header: {
        padding: theme.spacing.unit * 3,
        height: 249,
        width: 249,
    },
    logo: {
        margin: 'auto',
        marginBottom: theme.spacing.unit * 3,
        height: 150,
        width: 150,
    },
    content: {
        flexGrow: 1,
        height: '100vh',
        backgroundColor: theme.palette.background.default,
        overflow: 'auto'
    },
    card: {
        textAlign: 'left',
        margin: theme.spacing.unit * 3,
        [theme.breakpoints.up('md')]: {
            margin: theme.spacing.unit * 10,
        },
    },
    cardAction: {
        position: 'relative'
    },
    avatar: {
        backgroundColor: theme.palette.secondary.main
    },
    readArticle: {
        position: 'absolute',
        right: 10
    },
    addFAB: {
        zIndex: 99999,
        position: 'fixed',
        bottom: theme.spacing.unit * 3,
        right: theme.spacing.unit * 3
    },
    spacing: {
        flex: 1
    },
    account: {
        margin: 'auto',
        padding: theme.spacing.unit
    },
    userAvatar: {
        margin: 'auto'
    }
})

class Home extends Component {
    state = {
        mobileOpen: false,
        dialogOpen: false,
        speedDialOpen: false,
        snackBarOpen: false,
        avatar: '',
        message: '',
        categories: [],
        tags: [],
        articles: [],
        category: 0,
        addCategory: '',
        editID: -1,
        tag: '',
        username: '',
    }

    shouldComponentUpdate (nextProps, nextState, nextContext) {
        if (nextProps !== this.props) {
            let url = '/api/article'
            if (nextProps.match.params.type !== undefined) {
                if (nextProps.match.params.type === 'category') {
                    url = '/api/article/category/' + nextProps.match.params.id
                    this.setState({category: parseInt(nextProps.match.params.id), tag: ''})
                } else if (nextProps.match.params.type === 'tag') {
                    url = '/api/tag/' + nextProps.match.params.id
                    this.setState({tag: nextProps.match.params.id, category: 0})
                }
            } else {
                this.setState({tag: '0', category: 0})
            }

            this.getArticles(url)
        }
        return true
    }

    componentWillMount () {
        document.title = 'Blog'

        this.setState({username: Cookies.get('username')})

        axios.get('/api/user/avatar')
            .then(r => {
                if (r.data.code === 200)
                    this.setState({avatar: r.data.avatar})
            })

        axios.get('/api/tag')
            .then(r => {
                if (r.data.code === 200)
                    this.setState({tags: r.data.tags})
            })
        this.getArticles('/api/article')
        this.getCategories()
    }

    handleDrawerToggle = () => {
        this.setState({mobileOpen: !this.state.mobileOpen})
    }

    async getArticles (url) {
        let result = await axios.get(url)
        if (result.data.code === 200) {
            let articles = result.data.articles
            for (let i = 0; i < articles.length; i++) {
                let r = await axios.get('/api/article/uuid/' + articles[i].Uuid + '/description_md')
                if (r.data.code === 200) {
                    articles[i] = {...articles[i], desc: r.data.markdown}
                } else {
                    articles[i] = {...articles[i], desc: ''}
                }
            }
            this.setState({articles: articles})
        }
    }

    getCategories () {
        CategoryApi.getCategory().then(data => {
            this.setState({categories: data.categorys})
        })
    }

    getCategory (id) {
        for (let i = 0; i < this.state.categories.length; i++) {
            if (this.state.categories[i].ID === id)
                return this.state.categories[i].name
        }
        return '已删除的分类'
    }

    handleClick = () => {
        this.setState(state => ({
            speedDialOpen: !state.speedDialOpen,
        }))
    }

    handleOpen = () => {
        if (this.state.username !== undefined) {
            this.setState({speedDialOpen: true})
        }
    }

    handleClose = () => {
        this.setState({speedDialOpen: false})
    }

    handleLogout = () => {
        AdminApi.logout()
            .then(() => {
                Cookies.remove('username')
                this.setState({username: undefined, snackBarOpen: true, message: '退出成功'})
            })
            .catch(err => {
                if (err.toString() === 'Error: 未登陆') {
                    Cookies.remove('username')
                    this.setState({username: undefined, snackBarOpen: true, message: '退出成功'})
                } else
                    this.setState({snackBarOpen: true, message: err.toString()})
            })
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

    formatTime = time => {
        return new Date(time).toLocaleString()
    }

    render () {
        const {classes} = this.props

        let isTouch
        if (typeof document !== 'undefined') {
            isTouch = 'ontouchstart' in document.documentElement
        }

        const categoryDialog = (
            <InfoContext.Consumer>{
                context => {
                    if (context.useCategory) {
                        return (
                            <Dialog
                                open={this.state.dialogOpen}
                                onClose={this.handleClose}
                                aria-labelledby="dialog-title"
                            >
                                <DialogTitle id="dialog-title">{'分类管理'}</DialogTitle>
                                <DialogContent>
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
                                            }
                                        )}
                                    </List>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => this.setState({dialogOpen: false})} color="primary"
                                            autoFocus>
                                        关闭
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        )
                    }
                }}
            </InfoContext.Consumer>
        )
        const categoryList = (
            <InfoContext.Consumer>
                {context => {
                    if (context.useCategory) {
                        return (
                            <div>
                                <Divider/>
                                <MenuList>
                                    <MenuItem component={Link} to='/'>
                                        <ListItemText inset primary="全部分类"/>
                                    </MenuItem>
                                    {this.state.categories.map((category) => {
                                        return (
                                            <MenuItem selected={this.state.category === category.ID} component={Link}
                                                      to={'/category/' + category.ID}>
                                                <ListItemText inset primary={category.name}/>
                                            </MenuItem>
                                        )
                                    })}
                                </MenuList>
                            </div>
                        )
                    }
                }}
            </InfoContext.Consumer>
        )

        const drawer = (
            <div>
                <InfoContext.Consumer>
                    {context => (
                        <div className={classes.header}>
                            <Avatar src={context.logo} alt="logo"
                                    className={classes.logo}/>
                            <Typography variant="title">{context.title}</Typography>
                        </div>
                    )}
                </InfoContext.Consumer>
                {categoryList}
                <Divider/>
                <MenuList>
                    <MenuItem component={Link} to='/'>
                        <ListItemText inset primary="全部标签"/>
                    </MenuItem>
                    {this.state.tags.map((tag) => {
                        return (
                            <MenuItem selected={this.state.tag === tag} component={Link} to={'/tag/' + tag}>
                                <ListItemText inset primary={tag}/>
                            </MenuItem>
                        )
                    })}
                </MenuList>
            </div>
        )

        let account = ''
        if (this.state.username === undefined) {
            account = (
                <div className={classes.account}>
                    <Button color="primary" onClick={() => this.props.history.push('/login')}>登录</Button>
                    <Button color="primary" onClick={() => this.props.history.push('/signup')}>注册</Button>
                </div>
            )
        } else {
            account = (
                <div className={classes.account}>
                    <Avatar src={this.state.avatar} className={classes.userAvatar}/>
                    <Typography>{this.state.username}</Typography>
                    <Button size="small" color="primary"
                            onClick={() => this.props.history.push('/profile')}>个人中心</Button>
                    <Button size="small" color="primary" onClick={this.handleLogout}>退出登录</Button>
                </div>
            )
        }

        return (
            <InfoContext.Consumer>
                {context => (
                    <div className={classes.root}>
                        {categoryDialog}
                        <Hidden mdUp>
                            <AppBar>
                                <Toolbar>
                                    <IconButton
                                        color="inherit"
                                        aria-label="open drawer"
                                        onClick={this.handleDrawerToggle}
                                    >
                                        <MenuIcon/>
                                    </IconButton>
                                    <Typography variant="title" color="inherit">{context.title}</Typography>

                                </Toolbar>
                            </AppBar>
                            <Drawer
                                variant="temporary"
                                open={this.state.mobileOpen}
                                onClose={this.handleDrawerToggle}
                                classes={{
                                    paper: classes.drawerPaper,
                                }}
                                ModalProps={{
                                    keepMounted: true,
                                }}
                            >
                                {drawer}
                                <div className={classes.spacing}/>
                                    <Divider/>
                                    {account}
                            </Drawer>
                        </Hidden>
                        <Hidden smDown>
                            <Drawer
                                variant="permanent"
                                open
                                classes={{
                                    paper: classes.drawerPaper,
                                }}
                            >
                                {drawer}
                                <div className={classes.spacing}/>
                                    <Divider/>
                                    {account}
                            </Drawer>
                        </Hidden>
                        <main className={classes.content}>
                            <Snackbar
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={this.state.snackBarOpen}
                                autoHideDuration={3000}
                                onClose={() => this.setState({snackBarOpen: false})}
                                ContentProps={{
                                    'aria-describedby': 'message-id',
                                }}
                                message={<span id="message-id">{this.state.message}</span>}
                            />
                            <Hidden mdUp>
                                <div className={classes.toolbar}/>
                            </Hidden>
                            {this.state.articles.map((article) => {
                                return (
                                    <Card className={classes.card}>
                                        <CardHeader
                                            avatar={
                                                <Avatar aria-label="Recipe" className={classes.avatar}>
                                                    {article.tag}
                                                </Avatar>
                                            }
                                            action={
                                                <Clipboard
                                                    component='div'
                                                    data-clipboard-text={window.location.protocol + '//' + window.location.host + '/article/' + article.ID}
                                                    onSuccess={() => this.setState({
                                                        snackBarOpen: true,
                                                        message: '已复制到剪切板'
                                                    })}>
                                                    <IconButton>
                                                        <ShareIcon/>
                                                    </IconButton>
                                                </Clipboard>

                                            }
                                            title={article.title}
                                            subheader={this.formatTime(article.CreatedAt)}
                                        />
                                        <CardContent>
                                            <TuiEditorViewer value={article.desc}/>
                                        </CardContent>
                                        <CardActions className={classes.cardAction}>
                                            {context.useCategory &&
                                            <Button size="small" color="primary" component={Link}
                                                    to={'/category/' + article.category_id}>归类于 {this.getCategory(article.category_id)}</Button>}
                                            <Button size="small" color="primary"
                                                    className={this.state.useCategory && classes.readArticle}
                                                    component={Link} to={'/article/' + article.ID}>阅读全文</Button>
                                        </CardActions>
                                    </Card>
                                )
                            })}
                            <SpeedDial
                                ariaLabel="SpeedDial"
                                className={classes.addFAB}
                                hidden={this.state.username !== 'admin'}
                                icon={<SpeedDialIcon/>}
                                onBlur={this.handleClose}
                                onClick={this.handleClick}
                                onClose={this.handleClose}
                                onFocus={isTouch ? undefined : this.handleOpen}
                                onMouseEnter={isTouch ? undefined : this.handleOpen}
                                onMouseLeave={this.handleClose}
                                open={this.state.speedDialOpen}
                            >
                                <SpeedDialAction
                                    icon={<SettingsIcon/>}
                                    tooltipTitle="后台管理"
                                    onClick={() => this.props.history.push('/admin')}
                                />
                                {context.useCategory &&
                                <SpeedDialAction
                                    icon={<CategoryIcon/>}
                                    tooltipTitle="分类"
                                    onClick={() => this.setState({dialogOpen: true, speedDialOpen: false})}
                                />}
                                <SpeedDialAction
                                    icon={<AddIcon/>}
                                    tooltipTitle="添加"
                                    onClick={() => this.props.history.push('/articleEditor')}
                                />}
                            </SpeedDial>
                        </main>
                    </div>
                )}
            </InfoContext.Consumer>
        )
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Home)