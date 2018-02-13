import React from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup, Modal, Alert, Breadcrumb, Glyphicon } from 'react-bootstrap';
import { Loader } from './ui';


const Breadcrumbs = (props) => {
    const subs = props.path.split('/');
    const breadcrumbs = [];
    for(var i=0; i<subs.length; i++) {
        var path = [];
        for(var j=0; j<=i; j++) {
            path.push(subs[j]);
        }
        breadcrumbs.push({
            dir: subs[i] || 'ROOT',
            path: subs[i] ? path.join('/') : '/'
        });
    }
    return (
        <Breadcrumb>
            { breadcrumbs.map(item=>
                <Breadcrumb.Item key={item.path} onClick={()=>props.nav(item.path)}>{item.dir}</Breadcrumb.Item>
            )}
        </Breadcrumb>
    )
}

const List = (props) => {
    if(!props.list) return null;
    return (
        <div>
            {props.list.map(dir =>
                <div key={dir}>
                    <a href="#"
                        onClick={()=>props.nav(props.path + (props.path == '/' ? '' : '/') + dir)}>
                        <Glyphicon glyph="folder-close" /> {dir}
                    </a>
                </div>
            )}
        </div>
    )
}


class Explorer extends React.Component {

    componentDidMount() {
        this.navHome();
    }


    nav = (path) => {
        if(path != this.props.path) {
            this.props.dispatch({type: 'EXPLORER_FETCH_READDIR', path })
        }
    }

    navHome = () => {
        this.nav(window.__CONFIG__.path);
    }


    loadTask = () => {
        this.props.toggle();
        this.props.loadTask(this.props.path);
    }


    render() {
        return (
            <Modal show={this.props.visible} onHide={this.props.toggle}>
                <Modal.Header closeButton>
                    <Modal.Title>Select task folder</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    { this.props.loading ? <Loader/> : <Breadcrumbs nav={this.nav} path={this.props.path}/>}
                    <List list={this.props.list} nav={this.nav} path={this.props.path}/>
                    { this.props.error && <Alert bsStyle="danger">{this.props.error}</Alert> }
                </Modal.Body>
                <Modal.Footer>
                    <Button className="pull-left" onClick={this.navHome}>Go home</Button>
                    <Button onClick={this.loadTask}>Open</Button>
                    <Button onClick={this.props.toggle}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }

}

export default connect(
    state => state.explorer
)(Explorer);