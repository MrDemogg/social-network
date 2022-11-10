import React, {useEffect, useState} from 'react';
import {Button, Card, Form, InputGroup} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "../hooks/redux";
import {Comment} from "react-loader-spinner";
import {socialAPI} from "../service/SocialService";
import {socialSlice} from "../store/reducers/SocialSlice";
import Subscribes from "./Subscribes";

const Posts = () => {
  const [newPostTextInput, setNewPostTextInput] = useState('')
  const [postReq] = socialAPI.usePostMutation()
  const [fetchPosts] = socialAPI.useFetchAllPostsMutation()

  const {name, surname, login, loading, posts} = useAppSelector(state => state.socialReducer)
  const dispatch = useAppDispatch()

  const getPostsHandler = () => {
    if (login) {
      dispatch(socialSlice.actions.setLoading(true))
      fetchPosts({name: name, surname: surname}).then((res: any) => {
        dispatch(socialSlice.actions.setLoading(false))
        if (res.error) {
          dispatch(socialSlice.actions.setError(res.error))
        } else {
          dispatch(socialSlice.actions.setPosts(JSON.parse(res.data)))
        }
      })
    }
  }

  useEffect(() => {
    getPostsHandler()
  }, [login])

  const newPostInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => setNewPostTextInput(event.target.value)

  const postHandler = () => {
    postReq({name: name, surname: surname, message: newPostTextInput}).then((res: any) => {
      if (res.data !== 'success') {
        dispatch(socialSlice.actions.setError(JSON.parse(res.error.data)))
      } else {
        getPostsHandler()
      }
    })
  }

  return (
    <>
      {login
       && <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '80%', margin: '0 auto'}}>
            <Card.Body style={{height: 600}}>
            <div style={{width: '80%', margin: '0 auto'}}>
              <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <InputGroup style={{width: '95%'}}>
                  <Form.Control
                    value={newPostTextInput}
                    onChange={newPostInputHandler}
                    placeholder={"What's happening?"}
                  />
                </InputGroup>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    postHandler()
                  }}
                  style={{marginLeft: 20}}
                >
                  Post
                </Button>
              </div>
              <Card style={{marginTop: 20}}>
                <Card.Body style={{maxHeight: 500, overflowY: 'scroll'}}>
                  {
                    loading && <div style={{margin: '0 auto', width: 80}}><Comment
                      visible={loading}
                      height={'80'}
                      width={'80'}
                      backgroundColor="#3d2dd345"
                      color={'#fff'}
                    /></div>
                  }
                  {posts && posts.length > 0
                    ? posts.map(post =>
                      <Card key={`${"id" + Math.random().toString(16).slice(2)}${post.name}${post.surname}`} style={{width: '95%', margin: '10px auto'}}>
                        <Card.Header>
                          <Card.Title>{post.name} {post.surname} said:</Card.Title>
                        </Card.Header>
                        <Card.Body>
                          <Card.Text>{post.message}</Card.Text>
                        </Card.Body>
                        <Card.Footer>
                          <div style={{width: '80%', margin: '0 auto', display: 'flex', justifyContent: 'space-between'}}>
                            <Card.Text>User mail: {post.mail}</Card.Text>
                            <Card.Text>Post date: {post.date.slice(0, 10)}</Card.Text>
                          </div>
                        </Card.Footer>
                      </Card>)
                    : !loading && <Card.Title style={{textAlign: 'center'}}>Постов пока нет, либо вы ещё ни на кого не подписались</Card.Title>
                  }
                </Card.Body>
              </Card>
            </div>
          </Card.Body>
          <Subscribes />
        </div>
      }
    </>
  );
};

export default Posts;