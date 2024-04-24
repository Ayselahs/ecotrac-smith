import { withIronSessionApiRoute } from "iron-session/next"
import sessionOptions from "../../config/session"
import db from '../../db'
import dbConnect from "../../db/util/connection"
import { save } from "../../db/controllers/plane"

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
                    const { emissionsResult } = req.body
                    console.log("emissionsResult", emissionsResult)

                    if (!userId) {
                        req.session.destroy()
                        return res.status(401).json({ error: "Session not found" })
                    }
                    //console.log("Data for plane", dataToSave)
                    const savePlaneData = await save(userId, emissionsResult)
                    console.log("Data for plane", savePlaneData)

                    if (!savePlaneData) {
                        return res.status(404).json({ error: "User not found or emission not added." })
                    }
                    res.status(200).json(savePlaneData)
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