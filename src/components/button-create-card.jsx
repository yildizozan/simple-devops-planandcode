import React, { Component } from 'react';

export default class ButtonCreateCard extends Component {

    
    render() {
        return(
            <h4><div onClick={this.props.onClick}><i className="fa fa-plus" aria-hidden="true"></i></div></h4>
        );
    }

}