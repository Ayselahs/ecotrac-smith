import { withIronSessionApiRoute } from "iron-session/next"
import sessionOptions from "../../config/session"
import db from '../../db'
import dbConnect from "../../db/util/connection"
import { saveTrain } from "../../db/controllers/train"

export default withIronSessionApiRoute(
    async function handler(req, res) {
        if (!req.session.user) {
            return res.status(401).json({ error: 'User not logged in' })
        }
        const userId = req.session.user._id
        const user = req.session.user

        switch (req.method) {
            case 'POST':
                try {
                    const { emissionsResultTrain } = req.body
                    console.log("emissionsResult", emissionsResultTrain)

                    if (!userId) {
                        req.session.destroy()
                        return res.status(401).json({ error: "Session not found" })
                    }
                    //console.log("Data for plane", dataToSave)
                    const saveTrainData = await saveTrain(userId, emissionsResultTrain)
                    console.log("Data for plane", saveTrainData)

                    if (!saveTrainData) {
                        return res.status(404).json({ error: "User not found or emission not added." })
                    }
                    res.status(200).json(saveTrainData)
                } catch (error) {
                    console.error("Error with request:", error)
                    return res.status(400).json({ error: error.message })
                }

            default:
                return res.status(404).end()
        }
    },
    sessionOptions
)