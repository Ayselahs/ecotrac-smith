import * as actions from './actions'

export default function reducer(state, { action, payload }) {
    switch (action) {
        case actions.CALCULATE_EMISSIONS:
            return { ...state, emissionsResult: payload }
        case actions.CALCULATE_TRAIN_EMISSIONS:
            return { ...state, emissionsResultTrain: payload }
        default:
            return state
    }
}