import { withIronSessionSsr } from "iron-session/next";
import Link from "next/link";
import sessionOptions from "../config/session";
import { useTravelContext } from "../context/travel";
import styles from "../styles/Home.module.css";
import * as actions from '../context/travel/actions'
import { useState, useRef } from 'react'
import { Router } from "next/router";
import { fetchEmission } from '../util/carbonInterface';
import Sidebar from "../components/Sidebar";
import { Container, Row, Col, Navbar, Nav, Card, Form, Button } from 'react-bootstrap';

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
        <div className="d-flex">
            <Sidebar />
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Row className="border rounded-5 p-3 bg-white-shadow">
                    <Col md={6}>
                        <Row className="align-items-center">
                            <div className="mb-4">
                                <h2>Flight Emission Calculator</h2>
                                <p>Fill in the details to calculate the CO₂ emissions for your car journey.</p>
                            </div>
                            <Form onSubmit={handleSubmit} className="w-100">
                                <Form.Group className="mb-3">
                                    <Form.Control type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Origin Code" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination Code" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control type="number" value={passengers} onChange={(e) => setPassengers(e.target.value)} placeholder="Passengers" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Select value={flightClass} onChange={(e) => setFlightClass(e.target.value)}>
                                        <option value="economy">Economy</option>
                                        <option value="premium">Premium</option>
                                    </Form.Select>
                                </Form.Group>
                                <Button variant="primary" type="submit" disabled={fetching} className="btn-lg btn-primary w-100">Calculate Emissions</Button>
                            </Form>
                        </Row>

                    </Col>

                    <Col md={6} className="rounded-4 d-flex justify-content-center align-items-center flex-column" style={{ background: '#103cbe' }}>
                        {fetching}
                        {emissionsResult ? (
                            <div>
                                <h3 className="text-white mb-3">Emission Results</h3>
                                <p className="text-white"> Carbon Emissions for your flight from {emissionsResult.origin} to {emissionsResult.destination}: {emissionsResult.emissions} kg CO2 </p>
                            </div>

                        ) : (
                            <div>
                                <h3 className="text-white mb-3">Awaiting Calculations</h3>
                                <p className="text-white">Enter details to see emission results</p>
                            </div>
                        )}
                    </Col>


                </Row>
            </Container >
        </div>


    )




}