import React from 'react';

import classes from './BuildControl.module.css';

const buildControl = (props) => (
    <div className={classes.BuildControl}>
        <div className={classes.Label}>{props.label}</div>
        <button 
            className={classes.Less} 
            onClick={props.remove} 
            disabled={props.disabled}
            title={props.disabled?"Debe de añadir un ingrediente antes":""}> Less </button>
        <button 
            className={classes.More}
            onClick={() => props.added(props.type)}> More </button>
    </div>
);

export default buildControl;