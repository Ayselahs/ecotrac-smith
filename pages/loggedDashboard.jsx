import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import User from '../db/models/user';
import dbConnect from "../db/util/connection";
import Sidebar from "../components/Sidebar";
import Header from "../components/header";
import { Container, Row, Col, Navbar, Nav, Card, Form, Button } from 'react-bootstrap';



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
            type: 'plane',
            legs: emission.legs.map(leg => ({
                ...leg,
                _id: leg._id.toString()
            })),
            dateCalculated: emission.dateCalculated.toISOString()
        })) : [];

        const trainEmissions = userId ? userId.trainEmission.map(emission => ({
            ...emission,
            _id: emission._id.toString(),
            type: 'train',
            dateCalculated: emission.dateCalculated.toISOString()
        })) : []

        console.log("User data:", userId)
        console.log("emissions", planeEmissions)

        return {
            props: {
                emissions: [planeEmissions, trainEmissions],
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

        <Container fluid>

            <Row>
                <Col md={3} >
                    <Sidebar />
                </Col>

                <main className="col-md-9 ml-sm-auto col-lg-9 px-md-4">
                    <h2>{user.username}'s Emissions Dashboard</h2>
                    <Row>
                        {emissions && emissions.length > 0 ? (
                            emissions.map((emission, index) => (
                                <Col key={index} className="col-md-6 col-lg-4 mb-4">
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>
                                                Date: {new Date(emission.dateCalculated).toLocaleDateString()}
                                            </Card.Title>
                                            <ul className="list-unstyled">
                                                {emission.type === 'plane' ? (
                                                    <>
                                                        <li>Passengers: {emission.passengers}</li>
                                                        <li>Emissions: {emission.emissions}kg CO2</li>
                                                        {emission.legs.map((leg, legIndex) => (
                                                            <li key={legIndex}>
                                                                {leg.departure_airport} to {leg.destination_airport} ({leg.cabin_class})
                                                            </li>
                                                        ))}
                                                    </>
                                                ) : (
                                                    <>
                                                        <li>Distance: {emission.distanceValue} {emission.distanceUnit}</li>
                                                        <li>Emissions: {emission.emissions}g CO2</li>
                                                    </>

                                                )}




                                            </ul>
                                        </Card.Body>
                                    </Card>



                                </Col>
                            ))

                        ) : (
                            <p className="text-center"> No emission data</p>
                        )}
                    </Row>

                </main>
            </Row>
        </Container>


    )
}
