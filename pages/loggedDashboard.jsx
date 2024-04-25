import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import User from '../db/models/user';
import dbConnect from "../db/util/connection";
import Sidebar from "../components/Sidebar";
import Header from "../components/header";
import { Container, Row, Col, Navbar, Nav, Card, Form, Button, Table } from 'react-bootstrap';



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
        console.log("emissions", trainEmissions)

        return {
            props: {
                emissions: [...planeEmissions, ...trainEmissions],
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

                <Col md={9}>
                    <h2 className="text-center">{user.username}'s Emissions Dashboard</h2>
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Details</th>
                                    <th>Passengers</th>
                                    <th>Emissions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emissions && emissions.length > 0 ? (
                                    emissions.map((emission, index) => (
                                        <tr key={index}>
                                            <td> Date: {new Date(emission.dateCalculated).toLocaleDateString()}</td>
                                            <td>{emission.type}</td>
                                            <td>
                                                {emission.type === 'plane' ? (
                                                    emission.legs.map((leg, legIndex) => (
                                                        <span key={legIndex}>
                                                            {leg.departure_airport} to {leg.destination_airport} ({leg.cabin_class})
                                                        </span>
                                                    ))
                                                ) : (
                                                    `Distance: ${emission.distance_value} ${emission.distance_unit}`
                                                )}
                                            </td>
                                            <td>{emission.type === 'plane' ? emission.passengers : 'N/A'}</td>
                                            <td> {emission.emissions} {emission.type === 'plane' ? 'kg' : 'g'} CO2</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">No emission data</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>











                </Col>
            </Row>

        </Container >


    )
}
