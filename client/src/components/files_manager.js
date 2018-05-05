import React from 'react';
import { connect } from 'react-redux';
import { Button, Alert, Breadcrumb, Glyphicon } from 'react-bootstrap';
import Loader from './ui/loader';
import Breadcrumbs from './ui/breadcrumbs';


const RowDir = (props) =>
    <a href="#" onClick={props.nav}>
        <Glyphicon glyph="folder-close" /> {props.name}
    </a>


const RowFile = (props) =>
    <a target="_blank" href={props.href}>
        <Glyphicon glyph="file" /> {props.name}
    </a>


function pathJoin(path1, path2) {
    return path1 == '' ? path2 : path1 + '/' + path2;
}


class FilesManager extends React.Component {

    componentDidMount() {
        this.nav(this.props.task_path);
    }


    nav = (path) => {
        this.props.dispatch({type: 'FILES_MANAGER_FETCH_READ_DIR', path })
    }


    remove = (name) => {
        this.props.dispatch({type: 'FILES_MANAGER_FETCH_REMOVE', name });
    }


    render() {
        const href = (filename) => {
            return [
                window.__CONFIG__.url_prefix,
                this.props.path,
                filename
            ].join('/');
        }

        return (
            <div>
                { this.props.loading ? <Loader/> : <Breadcrumbs nav={this.nav} path={this.props.path}/>}
                { this.props.list && this.props.list.map(item =>
                    <div key={item.name}>
                        {item.is_dir ?
                            <RowDir name={item.name} nav={()=>this.nav(pathJoin(this.props.path, item.name))}/>
                            :
                            <RowFile name={item.name} href={href(item.name)}/>
                        }
                        {' '}
                        <a href="#" onClick={()=>this.remove(item.name)}>
                            <Glyphicon glyph="remove"/>
                        </a>
                    </div>
                )}
            </div>
        );
    }

}

export default connect(
    state => state.files_manager
)(FilesManager);
