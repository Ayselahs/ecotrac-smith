import { Schema } from 'mongoose'

const TrainSchema = new Schema({
    origin: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    passengers: {
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