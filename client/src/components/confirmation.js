import React from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';


class Confirmation extends React.Component {

    yes = () => {
        this.props.dispatch({type: 'CONFIRMATION_YES' });
    }


    no = () => {
        this.props.dispatch({type: 'CONFIRMATION_NO' });
    }


    render() {
        return (
            <Modal show={this.props.visible} onHide={this.no}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.message}</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <ButtonToolbar className="pull-right">
                        <Button onClick={this.yes}>Ok</Button>
                        <Button onClick={this.no}>Cancel</Button>
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
        );
    }

}

export default connect(
    state => state.confirmation
)(Confirmation);