import { withIronSessionSsr } from "iron-session/next";
import Link from "next/link";
import sessionOptions from "../config/session";
import { useTravelContext } from "../context/travel";
import styles from "../styles/Home.module.css";
import * as actions from '../context/travel/actions'
import { useState, useRef } from 'react'

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req }) {
        const { user } = req.session;
        const props = {};
        if (user) {
            props.user = req.session.user;
        }
        props.isLoggedIn = !user;
        return { props }
    },
    sessionOptions
)

export default function Train(props) {
    const [{ emissionsResult }, dispatch] = useTravelContext()
    const [origin, setOrigin] = useState("")
    const [destination, setDestination] = useState("")
    const [passengers, setPassengers] = useState(1)
    const [fetching, setFetching] = useState(false)



    async function handleSubmit(e) {
        e.preventDefault()
        if (fetching || !origin.trim() || !destination.trim()) return
        setFetching(true)
        const res = await fetch(
            `https://www.carboninterface.com/api/v1/estimates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            },
            body: JSON.stringify(
                {
                    travel_mode: "rail",
                    origin: {
                        name: origin
                    },
                    destination: {
                        name: destination
                    },
                    passengers: passengers,
                    emission_factor: {
                        "id": "943d0e87-c297-4e89-82d8-d6eecea798ae"
                    },
                    parameters: {
                        "passengers": 4,
                        "distance": 100,
                        "distance_unit": "km"
                    }


                }
            )


        })


        const data = await res.json()
        console.log("data: ", data)

        //if (res.status !== 200) return

        console.log("data: ", data)
        dispatch({
            action: actions.CALCULATE_EMISSIONS,
            payload: {
                origin,
                destination,
                emissions: data.co2e
            }
        })
        console.log("Sending request with:", { origin, destination, passengers, flightClass });
        console.log("Emissions", emissionsResult)
        setFetching(false)


    }

    return (
        <div>
            <h1>Train Emission Calculator</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Origin" />
                <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" />
                <input type="number" value={passengers} onChange={(e) => setPassengers(e.target.value)} placeholder="Passengers" />
                <button type="submit" disabled={fetching}>Calculate Emissions</button>
            </form>
            {fetching && <p>Loading..</p>}
            {emissionsResult && (
                <div>
                    <p>Carbon Emissions for your train ride from {emissionsResult.origin} to {emissionsResult.destination}: {emissionsResult.emissions} kg CO2</p>
                </div>
            )}
            <Link href="/dashboard" className={styles.card}>
                <h2>Dashboard Logged &rarr;</h2>
                <p>Return to the homepage.</p>
            </Link>
        </div>
    )




}