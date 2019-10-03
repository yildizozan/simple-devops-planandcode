import React, { Component } from 'react';
import { connect } from 'react-redux';
import List from '../components/list';

export default class Main extends Component {

    constructor(props) {
        super(props);

        console.log("Main current project is " + props);
        this.state = { projectID: null };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.project !== this.state.projectID) {
            this.setState({ projectID: nextProps.project });
        }
    }

    render() {
        console.log("Main render " + this.state.projectID);
        if (this.state.projectID !== null)
            return (
                <div className="container-for-cards">
                    <List title={"To Do"}   showButtonAddCard={true}    showButtonComplete={true}   projectID={this.state.projectID} listName={"todo"}/>
                    <List title={"Doing"}   showButtonAddCard={false}   showButtonComplete={true}   projectID={this.state.projectID} listName={"doing"}/>
                    <List title={"Build"}   showButtonAddCard={false}   showButtonComplete={false}   projectID={this.state.projectID} listName={"build"}/>
                    <List title={"Test"}    showButtonAddCard={false}   showButtonComplete={false}   projectID={this.state.projectID} listName={"test"}/>
                    <List title={"Deploy"}  showButtonAddCard={false}   showButtonComplete={false}   projectID={this.state.projectID} listName={"deploy"}/>
                    <List title={"Done"}    showButtonAddCard={false}   showButtonComplete={false}   projectID={this.state.projectID} listName={"done"}/>
                </div>
            )
        else
            return (<div>Proje seçiniz!</div>);
    }
}

/*
function mapStateToProps(state) {
    return {
        project: state.project,
    };
}

// Buradan export edilmesi gerekilen
export default connect(mapStateToProps, null)(Main);
*/