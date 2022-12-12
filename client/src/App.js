import './App.css';

import useAuth from './state/useAuth';

function App() {
  const { isLoading, error, profile, login, logout } = useAuth();
  if (isLoading) return <h1>Loading...</h1>;

  if (error) {
    console.log(error);
    return <h1>Error</h1>;
  }

  async function handleLogin(ev) {
    ev.preventDefault();
    await login("adminxxx","password!").then(console.log).catch(console.error);
  }

  async function handleLogout(ev) {
    ev.preventDefault();
    await logout().then(console.log).catch(console.error);
  }

  return (
    <div className="App">
      <h1>Hello {profile ? profile.user : 'World'}!</h1>
      <br/>
      {profile ? <button onClick={handleLogout}>Logout</button> : <button onClick={handleLogin}>Login</button>}
    </div>
  );
}

export default App;
