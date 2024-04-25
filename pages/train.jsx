import { withIronSessionSsr } from "iron-session/next";
import Link from "next/link";
import sessionOptions from "../config/session";
import { useTravelContext } from "../context/travel";
import styles from "../styles/Home.module.css";
import * as actions from '../context/travel/actions'
import { useState, useRef } from 'react'
import { Router } from "next/router";
import { fetchTrain } from '../util/carbonInterface';
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

export default function Car(props) {
    const [{ emissionsResultTrain }, dispatch] = useTravelContext()
    const [distanceUnit, setDistanceUnit] = useState("mi")
    const [distanceValue, setDistanceValue] = useState("")
    const [fetching, setFetching] = useState(false)


    async function displayOnDashboard(data) {
        if (fetching || !distanceValue.trim()) return
        setFetching(true)
        const res = await fetch(
            `/api/saveTrain`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emissionsResultTrain: data,
                userId: props.user.id
            })
        })

        const postTrainData = await res.json()
        console.log(postTrainData)
        setFetching(false)

    }

    async function handleSubmit(e) {
        e.preventDefault()
        setFetching(true)
        try {
            const data = await fetchTrain(distanceUnit, distanceValue)
            console.log("Emission data:", data)

            console.log("data: ", data)
            dispatch({
                action: actions.CALCULATE_TRAIN_EMISSIONS,
                payload: {
                    distanceUnit: distanceUnit,
                    distanceValue: distanceValue,
                    emissions: data.data.attributes.carbon_g
                }
            })
            await displayOnDashboard(data)
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
                                <h2>Train Emission Calculator</h2>
                                <p>Fill in the details to calculate the CO₂ emissions for your train ride.</p>
                            </div>
                            <Form onSubmit={handleSubmit} className="w-100">
                                <Form.Group className="mb-3">
                                    <Form.Control type="number" value={distanceValue} onChange={(e) => setDistanceValue(e.target.value)} placeholder="Distance" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Select value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value)}>
                                        <option value="km">km</option>
                                        <option value="mi">mi</option>
                                    </Form.Select>
                                </Form.Group>
                                <Button variant="primary" type="submit" disabled={fetching} className="btn-lg btn-primary w-100">Calculate Emissions</Button>
                            </Form>
                        </Row>

                    </Col>

                    <Col md={6} className="rounded-4 d-flex justify-content-center align-items-center flex-column" style={{ background: '#103cbe' }}>
                        {fetching}
                        {emissionsResultTrain ? (
                            <div>
                                <h3 className="text-white mb-3">Emission Results</h3>
                                <p className="text-white"> Carbon Emissions for your train ride from {emissionsResultTrain.distanceValue} {emissionsResultTrain.distanceUnit}: {emissionsResultTrain.emissions} G CO2 </p>
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