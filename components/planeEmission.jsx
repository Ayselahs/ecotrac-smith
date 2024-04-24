
export default function PlaneList({ planes }) {
    return (
        <div>
            <h3>Emission Details</h3>
            <p><strong>Flight from {planes.origin} to {planes.destination}:</strong></p>
            <ul>
                <li>CO2 Emissions: {planes.emissions} kg</li>
                <li>Passengers: {planes.passengers}</li>
                <li>Flight Class: {planes.flightClass}</li>
            </ul>
        </div>
    )
}