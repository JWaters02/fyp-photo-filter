import React, { useState, useEffect } from "react";

const ManageAccount = (props: any) => {
    const [userDetails, setUserDetails] = useState({ familyName: "", email: "", username: "", role: "" });

    useEffect(() => {
        setUserDetails(props);
    }, [props]);

    return (
        <div>
            <h1>Home</h1>
        </div>
    );
}

export default ManageAccount;