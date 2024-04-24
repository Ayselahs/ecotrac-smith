import { withIronSessionSsr } from "iron-session/next";
import Link from "next/link";
import sessionOptions from "../config/session";
import { useTravelContext } from "../context/travel";
import styles from "../styles/Home.module.css";
import * as actions from '../context/travel/actions'
import { useState, useRef } from 'react'
import { Router } from "next/router";
import { fetchEmission } from '../util/carbonInterface';

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req }) {
        const { user } = req.session;
        console.log("User", user)
        const props = {};
        if (user) {
            props.user = req.session.user;
        }
        props.isLoggedIn = !user;
        return { props }
    },
    sessionOptions
)

export default function Plane(props) {
    const [{ emissionsResult }, dispatch] = useTravelContext()
    const [origin, setOrigin] = useState("")
    const [destination, setDestination] = useState("")
    const [passengers, setPassengers] = useState(1)
    const [flightClass, setFlightClass] = useState('economy')
    const [fetching, setFetching] = useState(false)


    async function saveToDashboard(data) {
        if (fetching || !origin.trim() || !destination.trim()) return
        setFetching(true)
        const res = await fetch(
            `/api/savePlane`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emissionsResult: data,
                userId: props.user.id
            })
        })

        const postData = await res.json()
        console.log(postData)
        setFetching(false)

    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (fetching || !origin.trim() || !destination.trim()) return
        setFetching(true)
        try {
            const data = await fetchEmission(origin, destination, passengers, flightClass)
            console.log("Emission data:", data)

            console.log("data: ", data)
            dispatch({
                action: actions.CALCULATE_EMISSIONS,
                payload: {
                    origin,
                    destination,
                    passengers: data.data.attributes.passengers,
                    emissions: data.data.attributes.carbon_kg
                }
            })
            await saveToDashboard(data)
            console.log("Session user:", req.session.user);
        } catch (err) {
            console.error("API error", err.message)
            if (err.message === 'Failed to fetch') {
                Router.push('/login')
            }
        } finally {
            setFetching(false)
        }





    }



    return (
        <div>
            <h1>Flight Emission Calculator</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Origin Code" />
                <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination Code" />
                <input type="number" value={passengers} onChange={(e) => setPassengers(e.target.value)} placeholder="Passengers" />
                <select value={flightClass} onChange={(e) => setFlightClass(e.target.value)}>
                    <option value="economy">Economy</option>
                    <option value="premium">Premium</option>
                </select>
                <button type="submit" disabled={fetching}>Calculate Emissions</button>
            </form>
            {fetching && <p>Loading..</p>}
            {emissionsResult && (
                <div>
                    <p>Carbon Emissions for your flight from {emissionsResult.origin} to {emissionsResult.destination}: {emissionsResult.emissions} kg CO2</p>
                </div>
            )}
            <Link href="/loggedDashboard" className={styles.card}>
                <h2>Dashboard Logged &rarr;</h2>
                <p>Return to the homepage.</p>
            </Link>
        </div>
    )




}