import React, { Component } from 'react';
import {gitOrgName} from '../modules/ApiGithub';
import axios from 'axios';

export default class ButtonProjectDelete extends Component {

  constructor(props) {
    super(props);

    this.state = { success: true, url: '' };

    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleProjectDelete = this.handleProjectDelete.bind(this);
  }
  

  handleOpenDialog(e) {
    this.setState({
      openDialog: true
    });
  }

  handleCloseDialog() {
    this.setState({
      openDialog: false
    });
  }

  handleProjectDelete = (e) => {
    e.preventDefault();
    
    const projectName = this.props.project;
    this.props.callbackProjectDelete(projectName);

    axios.get('http://localhost:8081' + '/' + gitOrgName + '/' + projectName + '/delete')
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.project !== this.state.project) {
      this.setState({ project: nextProps.project });
    }
  }

  render() {
    if (this.state.project) {
      return (
        <div>
            <a className="mdl-navigation__link" onClick={this.handleOpenDialog}>{this.state.project} projesini sil</a>
            <dialog open={this.state.openDialog} className="mdl-dialog mdl-shadow--32dp">
                <h4 className="mdl-dialog__title">{this.state.project} sil?</h4>
                <div className="mdl-dialog__actions">
                <button type="submit" onClick={this.handleProjectDelete} className="mdl-button mdl-button--accent">Sil</button>
                <button type='button' className="mdl-button" onClick={this.handleCloseDialog}>Kapat</button>
                </div>
            </dialog>
        </div>
      ); // end of return
    } else {
      return(null);
    } //end of if else
  } // end of render()
} // end of class
