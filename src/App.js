import React, { useState } from 'react';
import { auth, messaging, requestPermission } from './firebase';
import {
  signInWithEmail,
  signOut,
  signUpWithEmail,
} from './firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Toast, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [show, setShow] = useState(false);
  const [toast, setToast] = useState({
    title: '',
    body: '',
  });
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [isTokenFound, setTokenFound] = useState(false);

  const handleClick = async () => {
    console.log(messaging);

    await messaging
      .getToken()
      .then((currentToken) => {
        if (currentToken) {
          console.log('Token generated is ', currentToken);
          setShow(true);
          setToast({
            title: 'success',
            body: 'Token generated is: ' + currentToken,
          });
          // sendTokenToServer(currentToken);
          // updateUIForPushEnabled(currentToken);
        } else {
          // Show permission request.
          console.log('No ID token available. Request permission.');
          // setTokenFound(false);
          requestPermission();

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
    const unsub = messaging.onMessage((payload) => {
      console.log('Message received. ', payload);

      new Notification(
        payload.notification.title,
        payload.notification
      );
      setToast({
        title: payload.notification.title,
        body: payload.notification,
      });
    });
    return () => unsub;
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
          delay={5000}
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
            <strong className="mr-auto">{toast.title}</strong>
            <small>just now</small>
          </Toast.Header>
          <Toast.Body>
            <span style={{ color: '#212121' }}>{toast.body}</span>
          </Toast.Body>
        </Toast>
        <div className="center">
          <h1>Welcome,</h1>
          <h3>{user.email}!</h3>

          <Button onClick={handleClick}>Get token</Button>
          <Button onClick={() => setShow(true)}>Show Toast</Button>

          <Button type="button" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </>
    ) : (
      <div className="center">
        <Form onSubmit={handleSignIn}>
          <h1>Sign in</h1>
          <h3>Email:</h3>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <h3>Password:</h3>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <Button type="submit">Sign in</Button>
        </Form>
        <br />
        <hr />
        <br />
        <Form onSubmit={handleRegister}>
          <h1>Register</h1>
          <h3>Username:</h3>
          <Form.Control
            type="email"
            value={username}
            required={true}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <h3>Email:</h3>
          <Form.Control
            type="email"
            value={email}
            required={true}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <h3>Password:</h3>
          <Form.Control
            type="password"
            value={password}
            required={true}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <Button disabled={password.length < 8} type="submit">
            Register
          </Button>
        </Form>
        <br />
      </div>
    );
  }
}

export default App;
