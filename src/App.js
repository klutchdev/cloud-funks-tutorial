import React, { useEffect, useState } from 'react';
import { auth, messaging } from './firebase';
import {
  signInWithEmail,
  signOut,
  signUpWithEmail,
} from './firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Toast, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  function handleBgCb(payload) {
    console.log(payload);

    setShow(true);
    setNotification({
      title: payload.notification.title,
      body: payload.notification.body,
    });
  }

  const handleClick = async () => {
    console.log(messaging);

    await messaging
      .getToken()
      .then((currentToken) => {
        if (currentToken) {
          console.log('Token generated is ', currentToken);
          setTokenFound(true);
          setShow(true);
          setNotification({
            title: 'success',
            body: 'Token generated is: ' + currentToken,
          });
          // sendTokenToServer(currentToken);
          // updateUIForPushEnabled(currentToken);
        } else {
          // Show permission request.
          console.log('No ID token available. Request permission.');
          setTokenFound(false);

          // Show permission UI.
          // updateUIForPushPermissionRequired();
          // setTokenSentToServer(false);
        }
      })
      .catch((err) =>
        console.error(
          'An error occurred while retrieving token. ',
          err
        )
      );
  };

  const handleRegister = (e) => {
    e.preventDefault();
    signUpWithEmail(email, password);
  };
  const handleSignIn = (e) => {
    e.preventDefault();
    signInWithEmail(email, password).catch((err) => alert(err));
  };

  useEffect(() => {
    const onMsg = messaging.onMessage(handleBgCb);

    return () => onMsg();
  }, []);

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
            <strong className="mr-auto">{notification.title}</strong>
            <small>just now</small>
          </Toast.Header>
          <Toast.Body>{notification.body}</Toast.Body>
        </Toast>
        <div className="center">
          <h1>Welcome,</h1>
          <h3>{user.email}!</h3>

          <Button onClick={handleClick}>Get token</Button>
          <Button onClick={() => setShow(true)}>Show Toast</Button>
          {isTokenFound ? (
            <h3> Notification permission enabled 👍🏻 </h3>
          ) : (
            <h3> Need notification permission ❗️ </h3>
          )}

          <Button type="button" onClick={signOut}>
            Sign out
          </Button>
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
          <Button type="submit">Sign in</Button>
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
          <Button disabled={password.length < 8} type="submit">
            Register
          </Button>
        </form>
        <br />
      </div>
    );
  }
}

export default App;
