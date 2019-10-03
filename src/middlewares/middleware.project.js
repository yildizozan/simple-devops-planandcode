import { PROJECT_CREATE, PROJECT_GET, CARD_CREATE } from '../actions/project.types';
import * as actionTypes from '../actions/project.types';

import Firebase from '../modules/Firebase';
const Firestore = Firebase.firestore();

const MiddlewareProject = store => next => action => {

    switch(action.type)
    {
        case PROJECT_CREATE:
            console.log("MiddlewareProject", action.projectName.projectName);
            
            Firestore.collection("projects").doc(action.projectName.projectName)
            .set({
                todo: {},
                doing: {},
                build: {},
                test: {},
                deploy: {},
            })
            .then(function() {
                console.log("Document successfully written!");
                next(action);
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
                next();
            });
            
        break;

        case actionTypes.PROJECT_GET_NAME:
            Firestore.collection("projects")
                .get()
                .then(doc => {
                    if (doc.exists) {
                        action.projectName = doc.id;
                        next(action);
                        console.log("PROJECT_GET_NAME:", doc.id);
                    } else {
                        next();
                        console.log("No such PROJECT_GET_NAME document!");
                    }
                })
                .catch(error => {
                    next();
                });

            Firestore.collection("projects").doc(action.projectName)
                .onSnapshot( doc => {
                    console.log("Current data: ", doc && doc.data());
                    next(action);
                });
        break;

        /**
         * Projelerin isimlerini 
         * veritabanından çekiyoruz.
         */
        case actionTypes.PROJECT_GET_NAMES:
            let projectsNames = [];

            Firestore.collection("projects")
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    projectsNames.push(doc.id);
                });

                action.projectsNames = projectsNames;
                next(action);
            })
            .catch(error => {
                next();
            });
        break;


        default:
            next(action);
        break;
    }
}

export default MiddlewareProject;