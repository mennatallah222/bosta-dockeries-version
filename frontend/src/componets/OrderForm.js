import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles.css";

const OrderForm = () => {
    const [formData, setFormData] = useState({
        user_id: "",
        pickupLocation: {
            streetAddress: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
        },
        dropoffLocation: {
            streetAddress: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
        },
        packageDetails: {
            length: "",
            width: "",
            height: "",
            contents: "",
            isFragile: false,
            specialRequirements: "",
        },
        courierInfo: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.user_id) {
            setFormData((prevData) => ({
                ...prevData,
                user_id: user.user_id,
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [section, field] = name.split(".");

        setFormData((prevData) => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [field]: field === "isFragile" ? e.target.checked : value,
            },
        }));
    };

    const transformFormData = (data) => {
        return {
            user_id: data.user_id.toString(),
            pickup_location: {
                street_address: data.pickupLocation.streetAddress,
                city: data.pickupLocation.city,
                state: data.pickupLocation.state,
                postal_code: data.pickupLocation.postalCode,
                country: data.pickupLocation.country,
            },
            drop_off_location: {
                street_address: data.dropoffLocation.streetAddress,
                city: data.dropoffLocation.city,
                state: data.dropoffLocation.state,
                postal_code: data.dropoffLocation.postalCode,
                country: data.dropoffLocation.country,
            },
            package_details: {
                length: Number(data.packageDetails.length),
                width: Number(data.packageDetails.width),
                height: Number(data.packageDetails.height),
                contents: data.packageDetails.contents,
                is_fragile: data.packageDetails.isFragile,
                special_requirements: data.packageDetails.specialRequirements,
            },
            courier_info: data.courierInfo,
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const transformedData = transformFormData(formData);
        console.log("Submitting order:", transformedData);

        try {
            const response = await fetch('http://localhost:8080/api/orders/addOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transformedData),
            });

            if (response.ok) {
                const responseData = await response.json();
                const orderId = responseData.ID;
                alert("Order created successfully");

                navigate(`/order-details/${orderId}`);
            } else {
                const errorData = await response.text();
                alert("Failed to create order: " + errorData);
            }
        } catch (error) {
            console.error("Error submitting the form:", error);
            alert("Something went wrong! Please try again.");
        }
    };

    return (
        <div className="order-form-container">
            <form onSubmit={handleSubmit}>
                <h1>Create Order</h1>

                <section>
                    <h3>Pick-up Location</h3>
                    <input type="text" name="pickupLocation.streetAddress" placeholder="Street Address" onChange={handleChange} required />
                    <input type="text" name="pickupLocation.city" placeholder="City" onChange={handleChange} required />
                    <input type="text" name="pickupLocation.state" placeholder="State" onChange={handleChange} required />
                    <input type="text" name="pickupLocation.postalCode" placeholder="Postal Code" onChange={handleChange} required />
                    <input type="text" name="pickupLocation.country" placeholder="Country" onChange={handleChange} required />
                </section>

                <section>
                    <h3>Drop-off Location</h3>
                    <input type="text" name="dropoffLocation.streetAddress" placeholder="Street Address" onChange={handleChange} required />
                    <input type="text" name="dropoffLocation.city" placeholder="City" onChange={handleChange} required />
                    <input type="text" name="dropoffLocation.state" placeholder="State" onChange={handleChange} required />
                    <input type="text" name="dropoffLocation.postalCode" placeholder="Postal Code" onChange={handleChange} required />
                    <input type="text" name="dropoffLocation.country" placeholder="Country" onChange={handleChange} required />
                </section>

                <section>
                    <h3>Package Details</h3>
                    <input type="number" name="packageDetails.length" placeholder="Length" onChange={handleChange} required />
                    <input type="number" name="packageDetails.width" placeholder="Width" onChange={handleChange} required />
                    <input type="number" name="packageDetails.height" placeholder="Height" onChange={handleChange} required />
                    <input type="text" name="packageDetails.contents" placeholder="Contents" onChange={handleChange} required />
                    <label>
                        <input type="checkbox" name="packageDetails.isFragile" onChange={handleChange} />
                        Is fragile
                    </label>
                    <textarea name="packageDetails.specialRequirements" placeholder="Special Requirements" onChange={handleChange}></textarea>
                </section>

                <section>
                    <h3>Courier Info</h3>
                    <input type="text" name="courierInfo" placeholder="Courier Info" onChange={(e) => setFormData({ ...formData, courierInfo: e.target.value })} required />
                </section>

                <button type="submit">Create Order</button>
            </form>
        </div>
    );
};

export default OrderForm;
