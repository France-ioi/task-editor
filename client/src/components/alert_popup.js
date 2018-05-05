import React from 'react';
import { connect } from 'react-redux';
import { Alert, Button, ButtonToolbar, Modal } from 'react-bootstrap';


class AlertPopup extends React.Component {

    hide = () => {
        this.props.dispatch({ type: 'ALERT_HIDE' });
    }


    render() {
        return (
            <Modal show={this.props.visible} onHide={this.hide}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title || 'Error'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert bsStyle={this.props.style || 'danger'}>
                        {this.props.message}
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <ButtonToolbar className="pull-right">
                        <Button onClick={this.hide}>Ok</Button>
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
        );
    }

}

export default connect(
    state => state.alert_popup
)(AlertPopup);