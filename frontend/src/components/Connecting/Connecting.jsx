import { useEffect, useState } from "react";

const Connecting = () => {

    const [dots, setDots] = useState("");

    const addDot = () => {
        setDots(dots => dots.length >= 5 ? "" : dots + ".");
    };

    useEffect(() => {
        const inter = setInterval(addDot, 500);
        return () => clearInterval(inter);
    }, []);
    
    return (
        <div id="connecting" className="specific-page-content">
            <h2>Connecting{dots}</h2>
        </div>
    );
};

export default Connecting;