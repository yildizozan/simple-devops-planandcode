import React, { Component } from 'react';
import { connect } from 'react-redux';
import { projectGetName } from '../actions/project.action';
import Main from '../containers/main';
import Http from 'http';

import ButtonCreateProject from '../components/button-create-project';
import ButtonAddCollaborator from '../components/button-add-collaborator';
import ButtonProjectDelete from '../components/button-delete-project';

import {Firestore} from '../modules/Firebase';
import gitOrg, { gitOrgName, Github } from '../modules/ApiGithub';

export default class App extends Component {
  constructor(props) {
    super(props)

    /**
     * Set state
     */
    this.state = { projects: [], project: null }

    this.handleChoiceProject = this.handleChoiceProject.bind(this);

    /**
     * Middleware ile projeleri
     * databaseden çekiyoruz.
     */
    //this.props.projectGetName();
  }

  async componentWillMount() {
    //this.setState({ projectsNames: this.props.projectsNames })

    let projectsNames = [];

      Firestore.collection("projects")
      .onSnapshot(querySnapshot => {
          let projectsNew = [];
          querySnapshot.forEach(doc => {
            projectsNew.push(doc.id);
          });

          this.setState({ projects: projectsNew });
          console.log("Current projects are ", projectsNew.join(", "));
      });
    
  }

  render() {
    console.log("Render project is " + this.state.project);

    return (
      <div className="mdl-layout mdl-js-layout">
        <header className="mdl-layout__header mdl-layout__header--scroll">
          <div className="mdl-layout__header-row">

            <span className="mdl-layout-title">Plan & Code - GTU DevOps</span>

            <div className="mdl-layout-spacer"></div>

            <nav className="mdl-navigation">
              <ButtonCreateProject />
              <ButtonAddCollaborator />
              <ButtonProjectDelete project={this.state.project} callbackProjectDelete={this.handleProjectDelete}/>
            </nav>
          </div>
        </header>
        <div className="mdl-layout__drawer">
          <span className="mdl-layout-title">Projeler</span>
          <nav className="mdl-navigation">
          {
            
            this.state.projects.map((item, i) => {
              return <a key={i} data-id={item} onClick={this.handleChoiceProject.bind(this)} className="mdl-navigation__link" href="#">{ item }</a>
            })
            
          }
          </nav>
        </div>
        <main className="mdl-layout__content">
          <div className="page-content">
            <Main project={ this.state.project } />
          </div>
        </main>
      </div>
    );  

  } // end of render()

  /**
   * 
   */
  handleProjectDelete(projectName) {
    
    Firestore.collection("projects").doc(projectName).delete()
    .then(() => {
      gitOrg.repo(projectName).destroy();
      console.log(projectName + " projesi silindi!");
      //window.location.reload(true);
    }).catch(error => {
        console.error(projectName + " proje silinme hatası: ", error);
    });
  }

  /**
   * Menuden seçilen bir projeyi
   * main containere atıyoruz.
   * 
   * @param {*} event 
   */
  handleChoiceProject(event) {
    //console.log(event.currentTarget.dataset.id);
    this.setState({ project: event.currentTarget.dataset.id });
  }

} // end class App
