import { createContext, useEffect, useRef, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // const [accessToken, setAccessToken] = useState();
  let accessTokenRef = useRef(null);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:8000/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessTokenRef.current}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const result = await response.text();
        console.log(result);
      } else {
        const result = await response.json();
        console.log(result);
        setUser(result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  async function refresh() {
    try {
      const response = await fetch("http://localhost:8000/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        // const result = await response.json();
        return false;
      } else {
        const result = await response.json();
        // setAccessToken(result.accessToken);
        accessTokenRef.current = result.accessToken;
        return true;
      }
    } catch (err) {
      console.error(err);
    }
  }

  const login = async (formData, setErrors) => {
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const result = await response.json();
        setErrors(result);
        return false;
      } else {
        const result = await response.json();
        // setAccessToken(result.accessToken);
        accessTokenRef.current = result.accessToken;
        return true;
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // const controller = new AbortController();
    async function init() {
      if (accessTokenRef.current) {
        await fetchUser();
      } else {
        if (await refresh()) {
          await fetchUser();
        }
      }
    }
    init();
    // return () => controller.abort();
  }, []);

  // async function getCurrentUser() {
  //     if (accessTokenRef.current) {
  //       try {
  //         const response = await fetch("http://localhost:8000/me", {
  //           method: "GET",
  //           headers: {
  //             Authorization: `Bearer ${accessTokenRef.current}`,
  //           },
  //           credentials: "include",
  //         });
  //
  //         if (!response.ok) {
  //           const result = await response.json();
  //           console.error(result);
  //         } else {
  //           const result = await response.json();
  //           setUser(result);
  //         }
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     }
  //   }

  return (
    // <AuthContext value={[user, setUser, accessToken, setAccessToken]}>
    //   {children}
    // </AuthContext>

    <AuthContext value={{ user, setUser, accessTokenRef, login, fetchUser }}>
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
