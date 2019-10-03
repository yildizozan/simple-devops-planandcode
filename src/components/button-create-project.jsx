import React, { Component } from 'react';
import { connect } from 'react-redux';
import { projectCreate } from '../actions/project.action';
import axios from 'axios';
import gitOrg, {gitOrgName, Github} from '../modules/ApiGithub';

class ButtonCreateProject extends Component {

  constructor(props) {
    super(props);
    
    this.state = { success: true, url: '' };

    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleCreateProject = this.handleCreateProject.bind(this);
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

  handleCreateProject = (e) => {
    e.preventDefault();
    
    let repoName = this.refs.repo;

    
    
    gitOrg.repo({
      name: repoName.value,
      description: 'My first world program'
    }, (err, status, body, headers) => {
      console.log(err); //json object
      console.log(status); //json object
      console.log(body); //json object
      console.log(headers); //json object
      
      if (err !== null) {
        console.log("Repo oluşturulamadı!");
        this.setState({
          success: false
        });
      }
  
      if (status !== undefined) {

        /**
         * Proje baarıyla oluşturuldu.
         * Haliyle artık firebase kaydediyoruz.
         * Dispatch etmemiz gerekli.
         */
        this.props.projectCreate({ projectName: repoName.value });
        
        const url = 'https://github.com/' + gitOrgName + '/' + repoName.value + '.git';
        console.log("Repo başarıyla oluşturuldu.");
        this.setState({
          success: true,
          url: 'git clone https://github.com/' + gitOrgName + '/' + repoName.value + '.git'
        });
  
        axios.get('http://localhost:8081' + '/' + gitOrgName + '/' + repoName.value + '/create')
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });

        repoName.value = '';
      }
  

    });
    
  }

  createFirestore() {

  }

  render() {
    return (
      <div>
          <a className="mdl-navigation__link" onClick={this.handleOpenDialog}>Yeni Proje</a>
          <form onSubmit={this.handleCreateProject}>
          <dialog open={this.state.openDialog} className="mdl-dialog mdl-shadow--32dp">
              <h4 className="mdl-dialog__title">Yeni Proje?</h4>
              <div className="mdl-dialog__content">
                  <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                      <input className="mdl-textfield__input" type="text" pattern="^[a-zA-Z0-9\-]+$" id="sample4" ref="repo"/>
                      <label className="mdl-textfield__label" htmlFor="sample4">Projenin ismi giriniz...</label>
                      <span className="mdl-textfield__error">Geçerli bir isim giriniz!</span>
                  </div>
                
                  { (this.state.success) ? <p>{ this.state.url }</p> : <p>Proje oluşturulamadı.</p> }

              </div>
              <div className="mdl-dialog__actions">
              <button type="submit" className="mdl-button mdl-button--accent">Oluştur</button>
              <button type='button' className="mdl-button" onClick={this.handleCloseDialog}>Kapat</button>
              </div>
          </dialog>
          </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    projectCreate: (param) => dispatch(projectCreate(param))
  }
}

export default connect(null, mapDispatchToProps)(ButtonCreateProject);