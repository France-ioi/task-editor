import React from 'react';
import { connect } from 'react-redux';
import { Button, Navbar, Nav, NavItem } from 'react-bootstrap';


class ControlPanel extends React.Component {

    render() {
        var { task, toggleExplorer, saveTask, showSection, active_section, username } = this.props;
        return (
            <Navbar inverse fixedTop>
                <Navbar.Text pullLeft>{username}</Navbar.Text>
                { task.ready && <Navbar.Text pullLeft>{task.path}</Navbar.Text> }
                { task.ready &&
                    <Nav>
                        <NavItem active={active_section == 'json'} onClick={()=>showSection('json')}
                            eventKey={1} href="#">JSON editor</NavItem>
                        <NavItem active={active_section == 'svn'} onClick={()=>showSection('svn')}
                            eventKey={2} href="#">SVN</NavItem>
                        <NavItem active={active_section == 'import'} onClick={()=>showSection('import')}
                            eventKey={3} href="#">Task importer</NavItem>
                        <NavItem active={active_section == 'files_manager'} onClick={()=>showSection('files_manager')}
                            eventKey={4} href="#">Files manager</NavItem>
                    </Nav>
                }
                <Navbar.Form pullLeft>
                    { task.ready && <Button onClick={saveTask}>Save</Button> }
                    {' '}
                    <Button onClick={toggleExplorer}>Open</Button>
                </Navbar.Form>
            </Navbar>
        );
    }

}

export default ControlPanel;