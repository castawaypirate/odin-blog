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

  const { user, fetchAuthor, login, register, logout, loading, withRetry } =
    context;

  const isAuthorized = (requireRole) => {
    return user && user.role === requireRole;
  };

  return {
    user,
    fetchAuthor,
    login,
    register,
    logout,
    loading,
    isAuthorized,
    withRetry,
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

  const fetchAuthor = useCallback(async () => {
    try {
      setLoading(true);

      const response = await withRetry((options) =>
        authService.getAuthor(options),
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
      const response = await authService.login({
        ...formData,
        requireRole: import.meta.env.VITE_AUTHOR_PARAM,
      });

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
          await fetchAuthor();
        } else {
          const refreshResponse = await refresh();
          if (refreshResponse.status === 200) {
            await fetchAuthor();
          }
        }
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [fetchAuthor, refresh]);

  return (
    <AuthContext
      value={{
        user,
        fetchAuthor,
        login,
        register,
        logout,
        loading,
        withRetry,
      }}
    >
      {children}
    </AuthContext>
  );
};
