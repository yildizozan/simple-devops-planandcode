import * as actionTypes from './project.types';

export const projectCreate = param => {
    return {
        type: actionTypes.PROJECT_CREATE,
        projectName: param
    };
}

export const projectGetName = param => {
    return {
        type: actionTypes.PROJECT_GET_NAME,
        projectName: param
    }
}

export const projectCard = param => {
    return {
        type: actionTypes.CARD_CREATE,
        cardName: param
    };
}