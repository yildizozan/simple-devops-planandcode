import * as actionType from '../actions/project.types';

const initialState = { project: null, projectsNames: null };

export default function reducer(state = initialState, action) {
    switch(action.type) {
        case actionType.PROJECT_CREATE:
            return {
                ...state,
                project: action.project
            };

        case actionType.PROJECT_GET:
            return {
                ...state,
                project: action.projectsNames
            };

        case actionType.PROJECT_GET_NAMES:
            console.log(state);
            console.log(action.projectsNames);
            return {
                ...state,
                projectsNames: action.projectsNames
            };

        case actionType.CARD_CREATE:
            return {
                ...state,
                project: action.project
            };

        default:
            return state;
    }
}
