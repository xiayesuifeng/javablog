import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Button, IconButton, MenuItem, Paper, Snackbar, TextField, Tooltip } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import DoneIcon from '@material-ui/icons/Done'
import 'codemirror/lib/codemirror.css'
import 'tui-editor/dist/tui-editor.css'
import '../tui-editor-contents.css'
import 'highlight.js/styles/github.css'
import 'tui-editor/dist/tui-editor-extScrollSync.js'
import Editor from 'tui-editor'
import { InfoContext } from '../App'
import { ArticleApi } from '../api/article'
import { CategoryApi } from '../api/category'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth'

const styles = theme => ({
    root: {
        display: 'flex',
        textAlign: 'left',
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh'
    },
    info: {
        width: '100%',
        display: 'inline-flex',
        flexWrap: 'wrap',
        marginBottom: theme.spacing.unit
    },
    editor: {
        display: 'inline-flex',
        flexDirection: 'column',
        padding: theme.spacing.unit * 3,
        width: '80%',
        height: '80%',
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
    },
    doneFAB: {
        zIndex: 99999,
        position: 'fixed',
        bottom: theme.spacing.unit * 3,
        right: theme.spacing.unit * 3
    },
    nameField: {
        flex: 1,
        marginLeft: theme.spacing.unit
    },
    categoryField: {
        minWidth: 150
    },
    tagField: {
        width: 150,
        marginLeft: theme.spacing.unit
    },
    editorDiv: {
        flex: 1
    }
})

class ArticleEditor extends Component {
    state = {
        edit: false,
        categories: [],
        tags: [],
        tag: '',
        category: 0,
        title: '',
        snackBarOpen: false,
        message: '',
    }

    componentDidMount () {
        let option = {
            el: document.querySelector('#tui-editor'),
            language: 'zh',
            height: '100%',
            exts: ['scrollSync', 'table', 'colorSyntax'],
        }

        if (isWidthUp('sm', this.props.width)) {
            option = {...option, previewStyle: 'vertical',}
        }
        let editor = new Editor(option)

        this.setState({editor})
    }

    componentWillMount () {
        let id = this.props.match.params.id
        if (id !== undefined) {
            ArticleApi.getArticleById(id)
                .then(data => {
                    document.title = '编辑 ' + data.article.title

                    ArticleApi.getArticleMDByUUID(data.article.Uuid)
                        .then(data => {
                            this.state.editor.setValue(data.markdown)
                        })
                    this.setState({
                        tag: data.article.tag,
                        category: data.article.category_id,
                        title: data.article.title,
                        edit: true
                    })
                })
        } else {
            document.title = '新建文章'
        }

        CategoryApi.getCategory()
            .then(data => {
                this.setState({categories: data.categorys})
            })

    }

    handleSubmit = useCategory => () => {
        let id = this.props.match.params.id
        let data = {
            title: this.state.title,
            tag: this.state.tag,
            context: this.state.editor.getValue()
        }

        if (useCategory)
            data = {...data, category_id: this.state.category}

        if (this.state.edit) {
            ArticleApi.editArticle(id, data)
                .then(() => {
                    this.props.history.push('/article/' + id)
                })
                .catch(err => {
                    this.setState({snackBarOpen: true, message: '提交失败!' + err})
                })
        } else {
            ArticleApi.addArticle(data)
                .then(() => {
                    this.props.history.push('/')
                })
                .catch(err => {
                    this.setState({snackBarOpen: true, message: '提交失败!' + err})
                })
        }
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
            <InfoContext.Consumer>
                {context => (
                    <div className={classes.root}>
                        <Tooltip id="tooltip-fab" title="返回">
                            <IconButton aria-label="ArrowBack" className={classes.ArrowBackButton}
                                        onClick={() => this.props.history.goBack()}>
                                <ArrowBackIcon/>
                            </IconButton>
                        </Tooltip>
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
                        <Paper className={classes.editor}>
                            <div className={classes.info}>
                                {context.useCategory &&
                                <TextField
                                    select
                                    label="分类"
                                    value={this.state.category}
                                    SelectProps={{
                                        MenuProps: {
                                            className: classes.menu,
                                        },
                                    }}
                                    className={classes.categoryField}
                                    margin="normal"
                                    onChange={e => this.setState({category: e.target.value})}
                                >
                                    {this.state.categories.map(category => (
                                        <MenuItem key={category.ID} value={category.ID}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </TextField>}
                                <TextField
                                    label="标签"
                                    margin="normal"
                                    value={this.state.tag}
                                    className={classes.tagField}
                                    onChange={e => this.setState({tag: e.target.value})}
                                />
                                <TextField
                                    id="name"
                                    label="标题"
                                    value={this.state.title}
                                    margin="normal"
                                    className={classes.nameField}
                                    onChange={e => this.setState({title: e.target.value})}
                                />
                            </div>
                            <div className={classes.editorDiv}>
                                <div id="tui-editor"/>
                            </div>
                        </Paper>
                        <Tooltip title="提交">
                            <Button variant="fab" color="primary" className={classes.doneFAB}
                                    onClick={this.handleSubmit(context.useCategory)}>
                                <DoneIcon/>
                            </Button>
                        </Tooltip>
                    </div>)}
            </InfoContext.Consumer>
        )
    }
}

ArticleEditor.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withWidth()(withStyles(styles)(ArticleEditor))