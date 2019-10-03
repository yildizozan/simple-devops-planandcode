import React, { Component } from 'react';

export default class Card extends Component {
    
    render() {
        return(
            <div className="mdl-card mdl-shadow--4dp card">
                <div className="mdl-card__title">
                <h2 className="mdl-card__title-text">{this.props.data.data().content}</h2>
                </div>
                <div className="mdl-card__supporting-text">
                Card ID: { this.props.data.id }
                </div>
                {
                    (this.props.showButtonComplete)
                    ?
                    <div className="mdl-card__actions mdl-card--border">
                        <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onClick={(param) => { this.handleComplete(this.props.data)}} >
                            Tamamlandı
                        </a>
                    </div>
                    :
                    null
                }
            </div>
        )
    }

    handleComplete(param) {
        console.log("Card button complete handle!" + param.id);
        this.props.callbackCardComplete(param);
    }
}

/*
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vehicula mollis sapien at consequat. Vestibulum turpis velit, hendrerit at fringilla at, volutpat ut quam. Duis vitae sem massa.
*/