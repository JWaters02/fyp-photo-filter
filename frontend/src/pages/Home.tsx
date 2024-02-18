import React, { useState, useEffect } from "react";
import { CardTitle } from "reactstrap";

const Home = (props: any) => {
    return (
        <CardTitle tag="h2" className="text-center" style={{ marginTop: "20px" }}>
            Welcome to Photo system thingy
        </CardTitle>
    );
}

export default Home;