import dbConnect from '../util/connection'
import User from '../models/user'

export async function saveTrain(userId, emissionsResultTrain) {
    if (!emissionsResultTrain || !emissionsResultTrain.data) {
        console.error("emissionsResultTrain is undefined")
        return null
    }
    await dbConnect()

    const emissionTrainData = {
        distance_value: emissionsResultTrain.data.attributes.distance_value,
        distance_unit: emissionsResultTrain.data.attributes.distance_unit,
        emissions: emissionsResultTrain.data.attributes.carbon_g,
        dateCalculated: new Date(emissionsResultTrain.data.attributes.estimated_at)
    }

    console.log("Attempting to update user with ID:", userId);

    const user = await User.findByIdAndUpdate(
        userId,
        { $push: { trainEmission: emissionTrainData } },
        { new: true, upsert: true }

    )
    console.log("User after attempted update:", user);
    if (!user) {
        console.log("No user found for:", userId)
        return null
    }


    if (emissionTrainData) {
        console.log("Added Emission: ", emissionTrainData)
        return emissionTrainData
    } else {
        console.log("No new emission added")
        return null
    }






}