import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import User from '../db/models/user';
import dbConnect from "../db/util/connection";



export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req }) {
        await dbConnect()
        const user = req.session.user
        console.log("User", user)
        const props = {};
        if (!user) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false
                }
            }
        }

        const userId = await User.findById(user._id).lean()
        const planeEmissions = userId ? userId.planeEmission.map(emission => ({
            ...emission,
            _id: emission._id.toString(),
            legs: emission.legs.map(leg => ({
                ...leg,
                _id: leg._id.toString()
            })),
            dateCalculated: emission.dateCalculated.toISOString()
        })) : [];
        console.log("User data:", userId)
        console.log("emissions", planeEmissions)

        return {
            props: {
                emissions: planeEmissions,
                user: {
                    ...user,
                    _id: user._id.toString()
                }
            }
        }

    },
    sessionOptions


)


export default function loggedDashboard({ user, emissions }) {

    return (
        <div>
            <h2>{user.username}'s Emissions Dashboard</h2>
            <ul>
                {emissions && emissions.length > 0 ? (
                    emissions.map((emission, index) => (
                        <li key={index}>
                            Date: {new Date(emission.dateCalculated).toLocaleDateString()}
                            <ul>
                                <li>Passengers: {emission.passengers}</li>
                                <li>Emissions: {emission.emissions}kg CO2</li>
                                {emission.legs.map((leg, legIndex) => (
                                    <li key={legIndex}>
                                        {leg.departure_airport} to {leg.destination_airport} ({leg.cabin_class})
                                    </li>
                                ))}
                            </ul>

                        </li>
                    ))

                ) : (
                    <p> No emission data</p>
                )}
            </ul>
            <Link href="/dashboard" className={styles.card}>
                <h2>Home &rarr;</h2>
                <p>Return to the homepage.</p>
            </Link>
        </div>

    )
}
