import React from 'react';
import ProfileSettings from "./components/ProfileSettings";
import {Alert, Card} from "react-bootstrap";
import Posts from "./components/Posts";
import {useAppSelector} from "./hooks/redux";
import {useDispatch} from "react-redux";
import {socialSlice} from "./store/reducers/SocialSlice";

const App = () => {
  const {login, errorInfo} = useAppSelector(state => state.socialReducer)
  const dispatch = useDispatch()

  const closeErrorHandler = () => dispatch(socialSlice.actions.setError({...errorInfo, message: null}))

  return (
    <div>
      <Card>
        <ProfileSettings />
        {login
          ? !errorInfo
              && <Posts />
          : <Card.Body><Card.Title style={{textAlign: 'center'}}>You are not logged in</Card.Title></Card.Body>
        }
        <Posts />
      </Card>
      {errorInfo.message
        && <Alert variant={"danger"} onClose={closeErrorHandler} dismissible
          style={{position: 'fixed', width: '100%', top: '50%'}}
        >
          <Alert.Heading style={{textAlign: 'center'}}>{errorInfo.message}</Alert.Heading>
          <p style={{textAlign: 'center'}}>guilty of error: {errorInfo.errorGuilt}</p>
        </Alert>
      }
    </div>
  );
};

export default App;