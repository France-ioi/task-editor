import React from 'react';
import { Breadcrumb } from 'react-bootstrap';

export default (props) => {
    if(props.path === null) return null;
    //const subs = props.path == '' ? [''] : props.path.split('/')
    const breadcrumbs = [{
        dir: 'HOME',
        path: ''
    }];

    if(props.path != '') {
        const subs = props.path.split('/')
        for(var i=0; i<subs.length; i++) {
            var path = [];
            for(var j=0; j<=i; j++) {
                path.push(subs[j]);
            }
            breadcrumbs.push({
                dir: subs[i],
                path: path.join('/')
            });
        }
    }
    return (
        <Breadcrumb>
            { breadcrumbs.map(item=>
                <Breadcrumb.Item key={item.path} onClick={()=>props.nav(item.path)}>{item.dir}</Breadcrumb.Item>
            )}
        </Breadcrumb>
    )
}