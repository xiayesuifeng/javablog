import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Snackbar, withStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import { Link } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import { ArticleApi } from '../../api/article'

const styles = theme => ({
    root: {
        padding: theme.spacing.unit * 5,
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing.unit
        },
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        justifyItems: 'center'
    },
    avatar: {
        backgroundColor: theme.palette.secondary.main
    },
    article: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column'

    },
    header: {
        display: 'inline-flex',
        padding: theme.spacing.unit * 3,
        paddingBottom: 0,
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    action: {
        display: 'inline-flex',
        paddingTop: 0,
        padding: theme.spacing.unit * 3,
        justifyContent: 'flex-end'
    }
})

class Article extends Component {
    state = {
        articles: [],
        snackBarOpen: false,
        message: ''
    }

    componentWillMount () {
        this.getArticles()
    }

    getArticles () {
        ArticleApi.getArticle()
            .then(data => this.setState({articles: data.articles}))
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        this.setState({snackBarOpen: false})
    }

    handleDelete = id => () => {
        ArticleApi.deleteArticle(id)
            .then(r => {
                this.getArticles()
                this.setState({snackBarOpen: true, message: '删除成功'})

            })
            .catch(err => this.setState({snackBarOpen: true, message: '删除失败!' + err}))
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
                {this.state.articles.map(article => {
                    return (
                        <Paper className={classes.article}>
                            <div className={classes.header}>
                                <Avatar aria-label="Recipe" className={classes.avatar}>
                                    {article.tag}
                                </Avatar>
                                <span>{article.title}</span>
                                <span>分类ID {article.category_id}</span>
                                <span>创建时间 {article.CreatedAt}</span>
                                <span>修改时间 {article.UpdatedAt}</span>
                            </div>
                            <div className={classes.action}>
                                <Button size="small" color="primary"
                                        className={this.state.useCategory && classes.readArticle}
                                        component={Link} to={'/article/' + article.ID}>预览</Button>
                                <Button size="small" color="primary"
                                        onClick={this.handleDelete(article.ID)}
                                >删除</Button>
                                <Button size="small" color="primary"
                                        onClick={() => this.props.history.push('/articleEditor/' + article.ID)}
                                >编辑</Button>
                            </div>
                        </Paper>)
                })}
            </div>
        )
    }
}

Article.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Article)