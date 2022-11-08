import React, {useState} from 'react';
import {Button, Card, Form, InputGroup} from "react-bootstrap";
import {useAppSelector} from "../hooks/redux";
import {Comment} from "react-loader-spinner";

const Posts = () => {
  const [newPostText, setNewPostText] = useState('')

  const {posts, loading, error} = useAppSelector(state => state.socialReducer)

  const newPostChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => setNewPostText(event.target.value)

  return (
    <Card.Body>
      <div style={{width: '80%', margin: '0 auto'}}>
        <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <InputGroup style={{width: '95%'}}>
            <Form.Control
              value={newPostText}
              onChange={newPostChangeHandler}
              placeholder={"What's happening?"}
            />
          </InputGroup>
          <Button
          >
            Post
          </Button>
        </div>
        <Card>
          <Card.Body>
            {
              loading && <Comment visible={loading} height={'80'} width={'80'} backgroundColor="#3d2dd345" color={'#fff'} />
            }
            {
              error
                ? <Card.Title>{error}</Card.Title>
                : posts.map(post =>
                  <Card style={{width: '95%', margin: '0 auto'}}>
                    <Card.Header>
                      <Card.Title>{post.name} {post.surname} said:</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Card.Text>{post.message}</Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <div style={{width: '80%', margin: '0 auto'}}>
                        <Card.Text>User mail: {post.mail}</Card.Text>
                        <Card.Text>Post date: {post.date}</Card.Text>
                      </div>
                    </Card.Footer>
                  </Card>
                )
            }
          </Card.Body>
        </Card>
      </div>
    </Card.Body>
  );
};

export default Posts;