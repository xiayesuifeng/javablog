import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import { InfoContext } from '../../App'
import { Link, Route, Switch } from 'react-router-dom'
import Cookies from 'js-cookie'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import Article from './Article'
import Category from './Category'
import User from './User'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import Button from '@material-ui/core/Button'

const drawerWidth = 240

const styles = theme => ({
    root: {
        display: 'flex',
        flex: 1,
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    menuButton: {
        marginRight: 20,
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
    },
    spacing: {
        flex: 1
    }
})

class Admin extends Component {
    state = {
        mobileOpen: false,
    }

    componentWillMount () {
        if (Cookies.get('username') !== 'admin')
            this.props.history.push('/login')

        if (this.props.location.pathname === '/admin')
            this.props.history.push('/admin/article')
    }

    handleDrawerToggle = () => {
        this.setState(state => ({mobileOpen: !state.mobileOpen}))
    }

    render () {
        const {classes} = this.props

        const drawer = (
            <InfoContext.Consumer>{
                context => (
                    <div>
                        <div className={classes.toolbar}/>
                        <Divider/>
                        <MenuList>
                            <MenuItem selected={this.props.location.pathname === '/admin/article'} component={Link} to={'/admin/article'}>
                                <ListItemText primary="文章"/>
                            </MenuItem>
                            {context.useCategory &&
                            <MenuItem selected={this.props.location.pathname === '/admin/category'} component={Link} to={'/admin/category'}>
                                <ListItemText primary="分类"/>
                            </MenuItem>}
                            <MenuItem selected={this.props.location.pathname === '/admin/user'} component={Link} to={'/admin/user'}>
                                <ListItemText primary="用户"/>
                            </MenuItem>
                        </MenuList>
                    </div>
                )}
            </InfoContext.Consumer>

        )

        return (
            <div className={classes.root}>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" color="inherit" noWrap>
                            后台管理
                        </Typography>
                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer}>
                    <Hidden smUp implementation="css">
                        <Drawer
                            container={this.props.container}
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
                            <Button size='big' color='primary' component={Link} to="/">
                                <ArrowBackIcon/>返回首页
                            </Button>
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {drawer}
                            <div className={classes.spacing}/>
                            <Divider/>
                            <Button size='big' color='primary' component={Link} to="/">
                                <ArrowBackIcon/>返回首页
                            </Button>
                        </Drawer>
                    </Hidden>
                </nav>
                <main className={classes.content}>
                    <div className={classes.toolbar}/>
                    <Switch>
                        <Route path="/admin/article" component={Article}/>
                        <Route path="/admin/category" component={Category}/>
                        <Route path="/admin/user" component={User}/>
                    </Switch>
                </main>
            </div>
        )
    }
}

Admin.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Admin)