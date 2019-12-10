import React, { Component, Suspense } from 'react'
import './index.css'
import Admin from './pages/admin/Admin'
import { CssBaseline } from '@material-ui/core/index.es'
import { Route, Switch } from 'react-router-dom'
import axios from 'axios'
import LoadingFrame from './component/LoadingFrame'
import Signup from './pages/Signup'
import Profile from './pages/Profile'

const Home = React.lazy(() => import('./pages/Home'))
const Login = React.lazy(() => import('./pages/Login'))
const Article = React.lazy(() => import('./pages/Article'))
const ArticleEditor = React.lazy(() => import('./pages/ArticleEditor'))

export const InfoContext = React.createContext({
    title: 'goblog',
    useCategory: true,
    logo: 'none'
})

class App extends Component {
    state = {
        info: {}
    }

    constructor (props) {
        super(props)
        this.getInfo()
    }

    getInfo() {
        axios.get('/api/info')
            .then(r => {
                let info = {
                    title: r.data.name,
                    useCategory: r.data.useCategory,
                    logo: r.data.logo
                }
                this.setState({info: info})
            })
    }

    render () {
        return (
            <div className="App">
                <CssBaseline/>
                <Suspense fallback={<LoadingFrame/>}>
                    <InfoContext.Provider value={this.state.info}>
                        <Switch>
                            <Route path="/admin" component={Admin}/>
                            <Route path="/login" component={Login}/>
                            <Route path="/signup" component={Signup}/>
                            <Route path="/profile" component={Profile}/>
                            <Route path="/article/:id" component={Article}/>
                            <Route path="/articleEditor/:id" component={ArticleEditor}/>
                            <Route path="/articleEditor" component={ArticleEditor}/>
                            <Route path="/:type/:id" component={Home}/>
                            <Route path="/" component={Home}/>
                        </Switch>
                    </InfoContext.Provider>
                </Suspense>
            </div>
        )
    }
}

export default App