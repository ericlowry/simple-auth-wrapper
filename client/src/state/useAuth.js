//
// useAuth() - Authentication/Authorization State Manager
//
import { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext();

// on page load, ensure that we don't have a token
sessionStorage.setItem('accessToken', '');

//
// Provider
//
export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [profile, setProfile] = useState();

  useEffect(() => {

    fetch('/auth/session').then( res => {
      // test results
      return res.json();
    }).then( data => {
      console.log(data);
        sessionStorage.setItem('accessToken', data.token);
        setProfile({ user: data.user});
      })
      .catch(err => {
        if (!(err instanceof HttpUnauthorizedError)) setError(err); // rethrow unexpected errors
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  function clearAuthState() {
    setProfile();
    setSession();
    sessionStorage.setItem('accessToken', '');
  }

  async function localLogin(name, password) {
    clearAuthState();
    return fetch(
      '/auth/local/login',
      fetchOptions({ method: 'POST', body: { name, password } })
    )
      .then(handleHttpErrors)
      .then(res => res.json())
      .then(resJSON => {
        setProfile(resJSON.profile);
        setSession(resJSON.data);
        sessionStorage.setItem('accessToken', resJSON.token);
        return true;
      });
  }

  function logout() {
    clearAuthState();
    return fetch('/auth/logout', fetchOptions({ method: 'POST' }))
      .then(() => true)
      .catch(() => false);
  }

  return (
    <Ctx.Provider
      value={{ isLoading, error, profile, session, localLogin, logout }}
    >
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