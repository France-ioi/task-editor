import React from 'react';


const Loader = (props) => {
    if(props.modal) {
        return (
            <div className="loader-modal">
                <div className="loader"></div>
            </div>
        )
    }
    return (
        <div className="loader"></div>
    )
}



export {
    Loader
}