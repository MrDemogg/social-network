import React from 'react';
import {socialAPI} from "../service/SocialService";
import {useAppDispatch, useAppSelector} from "../hooks/redux";
import {Button, Card} from "react-bootstrap";
import {Comment} from "react-loader-spinner";
import {socialSlice} from "../store/reducers/SocialSlice";

const Subscribes = () => {
  const {name, surname, login, errorInfo} = useAppSelector(state => state.socialReducer)
  const {data: subscribes, isLoading} = socialAPI.useFetchAllSubsQuery({name: name, surname: surname})
  const [fetchPosts] = socialAPI.useFetchAllPostsMutation()
  const [deleteSubs] = socialAPI.useSubsDeleteMutation()
  const dispatch = useAppDispatch()

  const getPostsHandler = () => {
    if (login) {
      dispatch(socialSlice.actions.setLoading(true))
      fetchPosts({name: name, surname: surname}).then((res: any) => {
        console.log(res)
        dispatch(socialSlice.actions.setLoading(false))
        if (res.data) {
          dispatch(socialSlice.actions.setPosts(JSON.parse(res.data)))
        } else {
          dispatch(socialSlice.actions.setError({...errorInfo, message: res.error.error}))
        }
      })
    }
  }

  const deleteSubscribesHandler = () => {
    deleteSubs({name: name, surname: surname}).then(() => {
      getPostsHandler()
    })
  }

  return (
    <Card style={{marginTop: 15, height: 560}}>
      <Card.Header>
        <Card.Title>Ваши подписки:</Card.Title>
      </Card.Header>
      <Card.Body style={{overflowY: 'scroll'}}>
        {isLoading && <div style={{margin: '0 auto', width: 80}}><Comment
          visible={isLoading}
          height={'80'}
          width={'80'}
          backgroundColor="#3d2dd345"
          color={'#fff'}
        /></div>
        }
        {!isLoading && subscribes
          ? subscribes.length > 0 && subscribes.map((sub, index) => <p key={index}>{sub}</p>)
          : <Card.Title>Вы ни на кого не подписаны</Card.Title>
        }
      </Card.Body>
      <Card.Footer>
        <Button style={{width: '100%'}} onClick={(e) => {
          e.stopPropagation()
          deleteSubscribesHandler()
        }}>Отписаться от всех</Button>
      </Card.Footer>
    </Card>
  );
};

export default Subscribes;