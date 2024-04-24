import { Schema } from 'mongoose'


const PlaneSchema = new Schema({
    legs: [{
        departure_airport: {
            type: String,
            required: true,
        },
        destination_airport: {
            type: String,
            required: true,
        },
        cabin_class: {
            type: String,
            enum: ['economy', 'premium'],
            default: 'economy'
        }
    }],
    passengers: {
        type: Number,
        required: true,
    },
    emissions: {
        type: Number
    },
    dateCalculated: {
        type: Date,
        default: Date.now
    },
}, { _id: true })

export default PlaneSchema