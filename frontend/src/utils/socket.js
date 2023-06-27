import io from "socket.io-client";

let socket;
if (process.env.NODE_ENV === "production") {
    socket = io();
} else {
    socket = io("http://localhost:5000", {
        transports: ['websocket'],
    });
}

export default socket;