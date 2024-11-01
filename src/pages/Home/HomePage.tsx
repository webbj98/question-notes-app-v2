import React from "react";
import { Link } from "react-router-dom";


const HomePage: React.FC = () => {
    return (
        <div>
            <h1>Home</h1>
            <button><Link to='/questions'>To Questions Page</Link></button>
            
        </div>
    )
}

export default HomePage;