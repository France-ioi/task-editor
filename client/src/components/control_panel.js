import React from 'react';
import { connect } from 'react-redux';
import { Button, Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap';


class ControlPanel extends React.Component {

    render() {
        var { task, toggleExplorer, saveTask, showSection, active_section, username } = this.props;
        return (
            <Navbar inverse fixedTop>
                <Navbar.Text pullLeft>
                <Glyphicon glyph="user"/>
                    {username}
                </Navbar.Text>
                <Navbar.Form pullLeft>
                    <Button onClick={toggleExplorer}>Open</Button>
                </Navbar.Form>
                { task.ready &&
                    <Navbar.Text pullLeft>
                        <Glyphicon glyph="folder-open"/>
                        {task.path}
                    </Navbar.Text>
                }
                { task.ready &&
                    <Nav>
                        <NavItem active={active_section == 'json'} onClick={()=>showSection('json')}
                            eventKey={1} href="#">JSON editor</NavItem>
                        {/*
                        <NavItem active={active_section == 'svn'} onClick={()=>showSection('svn')}
                            eventKey={2} href="#">SVN</NavItem>
                        */}
                        <NavItem active={active_section == 'import'} onClick={()=>showSection('import')}
                            eventKey={3} href="#">Task importer</NavItem>
                        <NavItem active={active_section == 'files_manager'} onClick={()=>showSection('files_manager')}
                            eventKey={4} href="#">Files manager</NavItem>
                    </Nav>
                }
                <Navbar.Form pullLeft>
                    { task.ready && <Button onClick={()=>saveTask()} title="Save and commit">Save</Button> }
                    {' '}
                    { task.ready && <Button onClick={()=>saveTask('view')} title="Save, commit, import and view">Save &amp; import</Button> }
                    {' '}
                    { task.ready && task.url && <a target="_blank" href={task.url} className="btn btn-primary">View</a> }
                </Navbar.Form>
            </Navbar>
        );
    }

}

export default ControlPanel;