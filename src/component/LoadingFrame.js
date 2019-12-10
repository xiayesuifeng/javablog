import React,{Component} from 'react'
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {withRouter} from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
    root:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    }
});

class LoadingFrame extends Component {

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <CircularProgress size={200}/>
                <Typography>加载中...</Typography>
            </div>
        );
    }
}

LoadingFrame.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(LoadingFrame));