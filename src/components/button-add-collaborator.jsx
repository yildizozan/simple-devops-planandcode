import React, { Component } from 'react';
import gitOrg, { gitTeam, gitOrgName, Github } from '../modules/ApiGithub';


export default class ButtonAddCollaborator extends Component {

  constructor(props) {
    super(props);
    
    this.state = { success: true, username: '' };

    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleAddCollaborator = this.handleAddCollaborator.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
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

  callback (err, status, body, headers) {
    console.log(err);     //json object
    console.log(status);  //json object
    console.table(body);  //json object
    console.log(headers); //json object
  };

  handleAddCollaborator = (e) => {
    e.preventDefault();
    
    console.log(this.state.username);
    let teams = [];
    gitOrg.teams((err, status, body, headers) => {
      if (status !== undefined) {
        Github.team(status[0].id).addMembership(this.state.username, this.callback)
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.project !== this.state.project) {
      this.setState({ project: nextProps.project });
    }
  }

  render() {
      return (
        <div>
            <a className="mdl-navigation__link" onClick={this.handleOpenDialog}>{this.state.project}Kişi ekle</a>
            <form onSubmit={this.handleAddCollaborator}>
            <dialog open={this.state.openDialog} className="mdl-dialog mdl-shadow--32dp">
                <h4 className="mdl-dialog__title">{this.state.project}Kişi ekle</h4>
                <div className="mdl-dialog__content">
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input className="mdl-textfield__input" type="text" pattern="^[a-zA-Z0-9\-]+$" id="sample4" value={this.state.username} onChange={this.handleUsername}/>
                        <label className="mdl-textfield__label" htmlFor="sample4">Kullanıcı adı...</label>
                        <span className="mdl-textfield__error">Geçerli bir isim giriniz!</span>
                    </div>
                  
                    { (this.state.success) ? <p>{ this.state.url }</p> : <p>Kişi eklenemedi.</p> }

                </div>
                <div className="mdl-dialog__actions">
                <button type="submit" className="mdl-button mdl-button--accent">Davet Yolla</button>
                <button type='button' className="mdl-button" onClick={this.handleCloseDialog}>Kapat</button>
                </div>
            </dialog>
            </form>
        </div>
      ); // end of return
  } // end of render()

  handleUsername(event) {
    this.setState({
      username: event.target.value
    });
  }
} // end of class
