import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import authService from "../services/authService";
import { toErrors } from "../utils/errors";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { withRetry, user, fetchUser, login, register, logout, loading } =
    context;

  const isAuthorized = (requireRole) => {
    return user && user.role === requireRole;
  };

  return {
    withRetry,
    user,
    fetchUser,
    login,
    register,
    logout,
    loading,
    isAuthorized,
  };
};

export const AuthProvider = ({ children }) => {
  let accessTokenRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await authService.refresh();

      if (response.ok) {
        const result = await response.json();
        if (!result.accessToken) {
          // api returns 200 with accessToken = null but we handle it as unathorized on the client
          return { status: 401, msg: "No session" };
        }
        accessTokenRef.current = result.accessToken;
        return { status: 200 };
      }

      return { status: response.status, msg: "Something went wrong" };
    } catch (err) {
      console.error(err);
      return { status: 500, msg: "Internal server error" };
    }
  }, []);

  const withRetry = useCallback(
    async (doRequest) => {
      const response = await doRequest({
        headers: {
          Authorization: `Bearer ${accessTokenRef.current}`,
        },
      });
      if (response.status !== 401) return response;

      const refreshResponse = await refresh();
      if (refreshResponse.status === 401) {
        setUser(null);
        accessTokenRef.current = null;
        return { ok: false, refreshResponse };
      } else if (refreshResponse.status === 500) {
        return { ok: false, refreshResponse };
      } else {
        const retried = await doRequest({
          headers: {
            Authorization: `Bearer ${accessTokenRef.current}`,
          },
        });
        if (retried.status === 401) {
          setUser(null);
          accessTokenRef.current = null;
        }
        return retried;
      }
    },
    [refresh],
  );

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);

      const response = await withRetry((options) =>
        authService.getUser(options),
      );

      if (response.ok) {
        const result = await response.json();
        setUser(result);
      } else {
        console.warn(response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [withRetry]);

  const login = async (formData, setErrors) => {
    try {
      const response = await authService.login(formData);

      if (response.ok) {
        const result = await response.json();
        accessTokenRef.current = result.accessToken;
        return true;
      }

      const result = await toErrors(response);
      setErrors(result);
      return false;
    } catch (err) {
      console.error(err);
      setErrors([{ msg: "Something went wrong" }]);
      return false;
    }
  };

  const register = async (formData, setErrors) => {
    try {
      const response = await authService.register(formData);

      if (response.ok) {
        const result = await response.json();
        accessTokenRef.current = result.accessToken;
        return true;
      }
      const result = await toErrors(response);
      setErrors(result);
      return false;
    } catch (err) {
      console.error(err);
      setErrors([{ msg: "Something went wrong" }]);
      return false;
    }
  };

  const logout = async () => {
    let success = false;
    try {
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
    async function init() {
      try {
        if (accessTokenRef.current) {
          await fetchUser();
        } else {
          // we need this to not get 401 on page load/reload
          const refreshResponse = await refresh();
          if (refreshResponse.status === 200) {
            await fetchUser();
          }
        }
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [fetchUser, refresh]);

  return (
    <AuthContext
      value={{
        withRetry,
        user,
        fetchUser,
        login,
        register,
        logout,
        loading,
      }}
    >
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
