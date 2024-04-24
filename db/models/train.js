import { Schema } from 'mongoose'

const TrainSchema = new Schema({
    distance_unit: {
        type: String,
        required: true,
    },
    distance_value: {
        type: Number,
        required: true,
    },
    emissions: {
        type: Number,
        required: true,
    },
    dateCalculated: {
        type: Date,
        default: Date.now
    },
})

export default TrainSchema