import React, { useState } from 'react';
import { auth, messaging, onMessageListener } from './firebase';
import {
  signInWithEmail,
  signOut,
  signUpWithEmail,
} from './firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Toast } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({
    title: '',
    body: '',
  });
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isTokenFound, setTokenFound] = useState(false);

  const getToken = async (setTokenFound) => {
    try {
      const currentToken = await messaging.getToken({
        vapidKey:
          'BIUyUG_QMFrIpJjbOhsX6vOGxu60V7ez8KOApzAV2cA7m5WcExCmMKgvJaRuOSyUIDdwr2IxnuNXr4g9Otr2au8',
      });
      if (currentToken) {
        console.log('current token for client: ', currentToken);
        setTokenFound(true);
      } else {
        console.log(
          'No registration token available. Request permission to generate one.'
        );
        setTokenFound(false);
        // shows on the UI that permission is required
      }
    } catch (err) {
      console.log('An error occurred while retrieving token. ', err);
    }
  };

  useEffect(() => {
    getToken(setTokenFound);
  }, []);

  onMessageListener()
    .then((payload) => {
      setShow(true);
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
      console.log(payload);
    })
    .catch((err) => console.log('failed: ', err));

  const handleRegister = (e) => {
    e.preventDefault();
    signUpWithEmail(email, password);
  };
  const handleSignIn = (e) => {
    e.preventDefault();
    signInWithEmail(email, password).catch((err) => alert(err));
  };

  if (loading) {
    return (
      <div className="center">
        <h1>Loading...</h1>
      </div>
    );
  }
  if (error) {
    return (
      <div className="center">
        <h1>Error: {error}</h1>
      </div>
    );
  } else {
    return user ? (
      <>
        <Toast
          onClose={() => setShow(false)}
          show={show}
          delay={3000}
          autohide
          animation
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            minWidth: 200,
          }}
        >
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded mr-2"
              alt=""
            />
            <strong className="mr-auto">{notification.title}</strong>
            <small>just now</small>
          </Toast.Header>
          <Toast.Body>{notification.body}</Toast.Body>
        </Toast>
        <div className="center">
          <h1>Welcome,</h1>
          {/* <h3>username: {user.displayName}!</h3> */}
          <h3>{user.email}!</h3>
          <br />
          <button onClick={() => setShow(true)}>Show Toast</button>
          {isTokenFound && (
            <h3> Notification permission enabled 👍🏻 </h3>
          )}
          {!isTokenFound && (
            <h3> Need notification permission ❗️ </h3>
          )}

          <button type="button" onClick={signOut}>
            Sign out
          </button>
        </div>
      </>
    ) : (
      <div className="center">
        <form onSubmit={handleSignIn}>
          <h1>Sign in</h1>
          <h3>Email:</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <h3>Password:</h3>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit">Sign in</button>
        </form>
        <br />
        <hr />
        <br />
        <form onSubmit={handleRegister}>
          <h1>Register</h1>
          <h3>Username:</h3>
          <input
            type="email"
            value={username}
            required={true}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <h3>Email:</h3>
          <input
            type="email"
            value={email}
            required={true}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <h3>Password:</h3>
          <input
            type="password"
            value={password}
            required={true}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button disabled={password.length < 8} type="submit">
            Register
          </button>
        </form>
        <br />
      </div>
    );
  }
}

export default App;
