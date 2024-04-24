export async function fetchEmission(origin, destination, passengers, flightClass) {
    const res = await fetch(
        `https://www.carboninterface.com/api/v1/estimates`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`, // Make the call on the sever
        },
        body: JSON.stringify(
            {
                type: "flight",
                passengers: passengers,
                legs: [
                    {
                        departure_airport: origin,
                        destination_airport: destination,
                        cabin_class: flightClass  // Ensure this matches API requirements
                    },
                ]


            }
        )


    })
    if (!res.ok) throw new Error('Failed to fetch API')
    return await res.json()
}

export async function fetchTrain(distanceUnit, distanceValue) {
    const res = await fetch(
        `https://www.carboninterface.com/api/v1/estimates`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`, // Make the call on the sever
        },
        body: JSON.stringify(
            {
                type: "shipping",
                weight_value: 200,
                weight_unit: "lb",
                distance_value: distanceValue,
                distance_unit: distanceUnit,
                transport_method: "train"

            }
        )
    }
    )
    if (!res.ok) throw new Error('Failed to fetch API')
    return await res.json()
}