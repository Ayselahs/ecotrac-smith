import PlaneSc from '../models/plane'
import dbConnect from '../util/connection'
import User from '../models/user'

export async function save(userId, emissionsResult) {
    if (!emissionsResult || !emissionsResult.data) {
        console.error("emissionsResult is undefined")
        return null
    }
    await dbConnect()

    const emissionData = {
        legs: emissionsResult.data.attributes.legs.map(leg => ({
            departure_airport: leg.departure_airport,
            destination_airport: leg.destination_airport,
            cabin_class: leg.cabin_class || 'economy'
        })),
        passengers: emissionsResult.data.attributes.passengers,
        emissions: emissionsResult.data.attributes.carbon_kg,
        dateCalculated: new Date(emissionsResult.data.attributes.estimated_at)
    }

    console.log("Attempting to update user with ID:", userId);

    const user = await User.findByIdAndUpdate(
        userId,
        { $push: { planeEmission: emissionData } },
        { new: true, upsert: true }

    )
    console.log("User after attempted update:", user);
    if (!user) {
        console.log("No user found for:", userId)
        return null
    }


    if (emissionData) {
        console.log("Added Emission: ", emissionData)
        return emissionData
    } else {
        console.log("No new emission added")
        return null
    }






}

export async function getPastEmissions(userId) {
    await dbConnect()

    if (!userId) {
        console.log("No user ID")
        return null
    }

    const user = await User.findById(userId).populate('planeEmission')
    if (!userId) throw new Error("User not found")
    return user.planeEmissions

}

