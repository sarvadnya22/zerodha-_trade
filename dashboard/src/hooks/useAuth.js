// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";
// // import API_URL from "../api";

// // const useAuth = () => {
// //     const [user, setUser] = useState(null);
// //     const [loading, setLoading] = useState(true);
// //     const navigate = useNavigate();

// //     useEffect(() => {
// //         const verifyUser = async () => {
// //             try {
// //                 const { data } = await axios.post(
// //                     "http://localhost:3002/",
// //                     {},
// //                     { withCredentials: true }
// //                 );

// //                 if (data.status) {
// //                     setUser(data.user);
// //                 } else {
// //                     // Not authenticated, redirect to login
// //                     window.location.href = "http://localhost:3000/login";
// //                 }
// //             } catch (error) {
// //                 console.error("Auth verification failed:", error);
// //                 // Redirect to login on error
// //                 window.location.href = "http://localhost:3000/login";
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         verifyUser();
// //     }, [navigate]);

// //     return { user, loading };
// // };

// // export default useAuth;


// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import API_URL from "../api";

// const useAuth = () => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const verifyUser = async () => {
//             try {
//                 // Use dynamic API URL
//                 const { data } = await axios.post(
//                     `${API_URL}/`,
//                     {},
//                     { withCredentials: true }
//                 );

//                 if (data.status) {
//                     setUser(data.user);
//                 } else {
//                     handleLoginRedirect();
//                 }
//             } catch (error) {
//                 console.error("Auth verification failed:", error);
//                 handleLoginRedirect();
//             } finally {
//                 setLoading(false);
//             }
//         };

//         const handleLoginRedirect = () => {
//             const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

//             // Redirect to the separate Frontend/Landing app for login
//             // Update the production URL below once your Frontend is deployed
//             const frontendUrl = isLocal 
//                 ? "http://localhost:3000" 
//                 : "https://zenotrade-frontend.onrender.com";

//             window.location.href = `${frontendUrl}/login`;
//         };

//         verifyUser();
//     }, [navigate]);

//     return { user, loading };
// };

// export default useAuth;



import { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyUser = async () => {
            // 1. Check URL parameters for token first (from login redirect)
            const urlParams = new URLSearchParams(window.location.search);
            const urlToken = urlParams.get('token');

            // 2. Get the token from Local Storage or URL
            let token = urlToken || localStorage.getItem("token");

            // If token came from URL, store it in localStorage and clean URL
            if (urlToken) {
                localStorage.setItem("token", urlToken);
                // Clean the URL to remove the token parameter
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            // console.log("useAuth: Token from", urlToken ? "URL" : "localStorage", ":", token ? "EXISTS" : "NOT FOUND");

            // If we don't have a token, we aren't logged in. Redirect!
            if (!token) {
                // console.log(" useAuth: No token found, redirecting to login");
                handleLoginRedirect();
                setLoading(false);
                return;
            }

            try {
                // 2. Send the token in the Headers instead of using cookies
                //console.log(" useAuth: Sending token to backend for verification");
                const { data } = await axios.post(
                    `${API_URL}/`, // Make sure this route verifies the token on backend!
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Standard way to send tokens
                        },
                    }
                );

                //console.log(" useAuth: Backend response:", data);

                if (data.status) {
                    //console.log("✅useAuth: Token verified, user authenticated");
                    setUser(data.user);
                } else {
                    // Token might be invalid or expired
                    // console.log("useAuth: Backend returned status false:", data.message);
                    localStorage.removeItem("token");
                    handleLoginRedirect();
                }
            } catch (error) {
                //console.error("useAuth: Auth verification failed:", error);
                localStorage.removeItem("token");
                handleLoginRedirect();
            } finally {
                setLoading(false);
            }
        };

        const handleLoginRedirect = () => {
            const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

            const frontendUrl = isLocal
                ? "http://localhost:3000"
                : "https://zenotrade-frontend.onrender.com";

            // Redirect to login
            window.location.href = `${frontendUrl}/login`;
        };

        verifyUser();
    }, [navigate]);

    return { user, loading };
};

export default useAuth;