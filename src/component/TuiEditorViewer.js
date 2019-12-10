import React, { Component } from 'react'
import '../tui-editor-contents.css'
import 'highlight.js/styles/github.css'
import Viewer from 'tui-editor/dist/tui-editor-Viewer'

class TuiEditorViewer extends Component {
    constructor (props, context) {
        super(props, context)
        this.viewerRef = React.createRef()
    }

    componentDidMount () {
        let viewer = new Viewer({
            el: this.viewerRef.current,
            height: '100%'
        })
        this.setState({viewer})
    }

    shouldComponentUpdate (nextProps, nextState, nextContext) {
        nextState.viewer.setValue(nextProps.value)
        return true
    }

    render() {
        return (
            <div ref={this.viewerRef}/>
        )
    }
}

export default TuiEditorViewer