//
// useAuth() - Authentication/Authorization State Manager
//
import { createContext, useContext, useEffect, useState } from 'react';
import handleFetchResponse from '../lib/handleFetchResponse';

const Ctx = createContext();

// on page load, ensure that we don't have a token
sessionStorage.setItem('accessToken', '');

function fetchOptions(opts = {}) {
  const { method = 'GET', body, accessToken } = opts;
  const options = {
    method,
    headers: {
      'Accept': 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
  };

  if (accessToken) {
    options.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  return options;
}

//
// Provider
//
export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [profile, setProfile] = useState();

  useEffect(() => {
    fetch('/auth/session', fetchOptions())
      .then(handleFetchResponse)
      .then(data => {
        console.log(data);
        sessionStorage.setItem('accessToken', data.token);
        setProfile({ user: data.user, roles: data.roles });
      })
      .catch(err => {
        if (!(err.status === 401)) setError(err); // rethrow unexpected errors
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  function clearAuthState() {
    setProfile();
    sessionStorage.setItem('accessToken', '');
  }

  async function login(user, password) {
    console.log('logging in');
    clearAuthState();

    return fetch(
      '/auth/login',
      fetchOptions({ method: 'POST', body: { user, password } })
    )
      .then(handleFetchResponse)
      .then(resJSON => {
        // console.log(resJSON);
        const { user, roles, token } = resJSON;
        setProfile({ user, roles });
        sessionStorage.setItem('accessToken', token);
        return true;
      })
      .catch(() => false);
  }

  function logout() {
    clearAuthState();
    return fetch('/auth/logout', fetchOptions({ method: 'POST' }))
      .then(() => true)
      .catch(() => false);
  }

  return (
    <Ctx.Provider value={{ isLoading, error, profile, login, logout }}>
      {children}
    </Ctx.Provider>
  );
};

//
// Consumer
//
export default function useAuth() {
  return useContext(Ctx);
}
