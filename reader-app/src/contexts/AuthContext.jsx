import { createContext, useEffect } from "react";
import { useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState();
  const [user, setUser] = useState({});

  useEffect(() => {
    // const controller = new AbortController();

    async function fetchUser() {
      try {
        const response = await fetch("http://localhost:8000/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          const result = await response.json();
          console.error(result);
        } else {
          const result = await response.json();
          setUser(result);
        }
      } catch (err) {
        console.error(err);
      }
    }

    async function refresh() {
      try {
        const response = await fetch("http://localhost:8000/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) {
          const result = await response.json();
          console.error(result);
        } else {
          const result = await response.json();
          setAccessToken(result.accessToken);
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (accessToken) {
      fetchUser();
    } else {
      refresh();
    }
    // return () => controller.abort();
  }, [accessToken]);

  return (
    <AuthContext value={[user, setUser, accessToken, setAccessToken]}>
      {children}
    </AuthContext>
  );
};

// import api from "@/api";
// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useLayoutEffect,
// } from "react";
//
// const AuthContext = createContext(undefined);
//
// export const useAuth = () => {
//   const authContext = useContext(AuthContext);
//
//   if (!authContext) {
//     throw new Error("useAuth must be used within a AuthProvider");
//   }
//
//   return authContext;
// };
//
// // eslint-disable-next-line react-refresh/only-export-components
// const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState();
//
//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const response = await api.get("/api/me");
//         setToken(response.data.accessToken);
//       } catch {
//         setToken(null);
//       }
//     };
//     fetchMe();
//   }, []);
//
//   useLayoutEffect(() => {
//     const authInterceptor = api.interceptors.request.use((config) => {
//       config.headers.Authorization =
//         !config._retry && token
//           ? `Bearer ${token}`
//           : config.headers.Authorization;
//       return config;
//     });
//
//     return () => {
//       api.interceptors.request.eject(authInterceptor);
//     };
//   }, [token]);
//
//   // useLayoutEffect because we want to be done before any other component finished rendering
//   useLayoutEffect(() => {
//     const refreshInterceptor = api.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         const originalRequest = error.config;
//
//         if (
//           error.response.status === 403 &&
//           error.response.data.message === "Unauthorized"
//         ) {
//           try {
//             const response = await api.get("/api/refreshToken");
//             setToken(response.data.accessToken);
//             originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
//             originalRequest._retry = true;
//             return api(originalRequest);
//           } catch {
//             setToken(null);
//           }
//         }
//
//         return Promise.reject(error);
//       },
//     );
//
//     return () => {
//       api.interceptors.response.eject(refreshInterceptor);
//     };
//   }, []);
// };
