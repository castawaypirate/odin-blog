import { createContext, useContext, useEffect, useRef, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, fetchAuthor, login, register, logout, loading } = context;

  const isAuthorized = (requireRole) => {
    return user && user.role === requireRole;
  };

  return { user, fetchAuthor, login, register, logout, loading, isAuthorized };
};

export const AuthProvider = ({ children }) => {
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

  const fetchAuthor = async () => {
    try {
      setLoading(true);

      const response = await withRetry(() =>
        authService.getAuthor({
          headers: {
            Authorization: `Bearer ${accessTokenRef.current}`,
          },
        }),
      );

      if (!response.ok) {
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

  async function refresh() {
    try {
      const response = await authService.refresh();

      if (!response.ok) {
        return { status: response.status };
      } else {
        const result = await response.json();
        if (!result.accessToken) {
          return { status: 500 };
        }
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
      formData["requireRole"] = import.meta.env.VITE_AUTHOR_PARAM;
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
      if (accessTokenRef.current) {
        await fetchAuthor();
      } else {
        const refreshResponse = await refresh();
        if (refreshResponse.status === 200) {
          await fetchAuthor();
        }
      }
    }
    init();
  }, []);

  return (
    <AuthContext
      value={{ user, fetchAuthor, login, register, logout, loading }}
    >
      {children}
    </AuthContext>
  );
};
