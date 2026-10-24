import { createContext, useContext, useEffect, useRef, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, fetchUser, login, register, logout, loading } = context;

  // const isAuthorized = (requireRole) => {
  //   return user && user.role === requireRole;
  // }

  return { user, fetchUser, login, register, logout, loading };
};

export const AuthProvider = ({ children }) => {
  // const [accessToken, setAccessToken] = useState();
  let accessTokenRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function withRetry(doRequest) {
    const response = await doRequest();
    if (response.status !== 401) return response;
    const refreshResponse = await refresh();
    if (refreshResponse.status === 401) {
      setUser(null);
      return { ok: false, refreshResponse };
    } else if (refreshResponse.status === 500) {
      return { ok: false, refreshResponse };
    } else {
      return doRequest();
    }
  }

  const fetchUser = async () => {
    try {
      setLoading(true);
      // const response = await authService.getUser({
      //   headers: {
      //     Authorization: `Bearer ${accessTokenRef.current}`,
      //   },
      // });

      const response = await withRetry(() =>
        authService.getUser({
          headers: {
            Authorization: `Bearer ${accessTokenRef.current}`,
          },
        }),
      );

      if (!response.ok) {
        // const result = await response.text();
        // console.log(result);
        console.log(response);
      } else {
        const result = await response.json();
        console.log(result);
        setUser(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // const fetchUser = async () => {
  //   try {
  //     // const response = await fetch("http://localhost:8000/me", {
  //     //   method: "GET",
  //     //   headers: {
  //     //     "Content-Type": "application/json",
  //     //     Authorization: `Bearer ${accessTokenRef.current}`,
  //     //   },
  //     //   credentials: "include",
  //     // });
  //
  //     const response = await authService.getUser({
  //       headers: {
  //         Authorization: `Bearer ${accessTokenRef.current}`,
  //       },
  //     });
  //
  //     if (!response.ok) {
  //       const result = await response.text();
  //       console.log(result);
  //       setUser(null);
  //     } else {
  //       const result = await response.json();
  //       console.log(result);
  //       setUser(result);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  async function refresh() {
    try {
      // const response = await fetch("http://localhost:8000/refresh", {
      //   method: "POST",
      //   credentials: "include",
      // });

      const response = await authService.refresh();

      if (!response.ok) {
        // const result = await response.json();
        return { status: response.status };
      } else {
        const result = await response.json();
        if (!result.accessToken) {
          return { status: 500 };
        }
        // setAccessToken(result.accessToken);
        accessTokenRef.current = result.accessToken;
        return { status: 200 };
      }
    } catch (err) {
      console.error(err);
      return { status: 500 };
    } finally {
      setLoading(false);
    }
  }

  const login = async (formData, setErrors) => {
    try {
      // const response = await fetch("http://localhost:8000/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   credentials: "include",
      //   body: JSON.stringify(formData),
      // });

      const response = await authService.login(formData);

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

  const register = async (formData, setErrors) => {
    try {
      const response = await authService.register(formData);

      if (!response.ok) {
        const result = await response.json();
        setErrors(result);
        return false;
      } else {
        const result = await response.json();
        accessTokenRef.current = result.accessToken;
        return true;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    let success = false;
    try {
      // const response = await fetch("http://localhost:8000/logout", {
      //   headers: {
      //     Authorization: `Bearer ${accessTokenRef.current}`,
      //   },
      //   method: "POST",
      //   credentials: "include",
      // });

      const response = await authService.logout({
        headers: {
          Authorization: `Bearer ${accessTokenRef.current}`,
        },
      });

      success = response.ok;

      if (success) {
        const result = await response.json();
        console.log(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      accessTokenRef.current = null;
      setUser(null);
    }
    return success;
  };

  useEffect(() => {
    // const controller = new AbortController();
    async function init() {
      if (accessTokenRef.current) {
        await fetchUser();
      } else {
        // we need this to not get 401 on page load/reload
        const refreshResponse = await refresh();
        if (refreshResponse.status === 200) {
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

    <AuthContext value={{ user, fetchUser, login, logout }}>
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
