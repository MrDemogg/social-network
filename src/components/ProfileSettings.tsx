import React, {useState} from 'react';
import {Button, Card} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "../hooks/redux";
import {BoxArrowInLeft, BoxArrowInRight, PencilSquare, PersonPlusFill} from "react-bootstrap-icons";
import {socialAPI} from "../service/SocialService";
import {socialSlice} from "../store/reducers/SocialSlice";
import CustomModal from "./UI/CustomModal";
import {IChanges} from "../models/IChanges";

const ProfileSettings = () => {
  const {name, surname, login, errorInfo} = useAppSelector(state => state.socialReducer)
  const [inputName, setInputName] = useState('')
  const [inputMail, setInputMail] = useState('')
  const [inputSurname, setInputSurname] = useState('')
  const [inputSubMail, setInputSubMail] = useState('')
  const [profileReq] = socialAPI.useProfilePostMutation()
  const [changeProfile] = socialAPI.useChangeProfileMutation()
  const [subscribe] = socialAPI.useSubscribeMutation()
  const [fetchPosts] = socialAPI.useFetchAllPostsMutation()
  const [loginView, setLoginView] = useState(false)
  const [registerView, setRegisterView] = useState(false)
  const [followView, setFollowView] = useState(false)
  const dispatch = useAppDispatch()

  const getPostsHandler = (anotherName?: string, anotherSurname?: string) => {
    if (login) {
      dispatch(socialSlice.actions.setLoading(true))
      fetchPosts({name: anotherName ? anotherName : name, surname: anotherSurname ? anotherSurname : surname}).then((res: any) => {
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

  const localProfileChanges = (res: any, type: string, changes?: IChanges | null) => {
    if (res.data === 'success') {
      if (type !== 'edit') {
        dispatch(socialSlice.actions.login(true))
        dispatch(socialSlice.actions.setName(inputName))
        dispatch(socialSlice.actions.setSurname(inputSurname))
      } else {
        if (changes) {
          dispatch(socialSlice.actions.login(true))
          if (changes.name) {
            dispatch(socialSlice.actions.setName(inputName))
          }
          if (changes.surname) {
            dispatch(socialSlice.actions.setSurname(inputSurname))
          }
        }
      }
    } else {
      dispatch(socialSlice.actions.setError(JSON.parse(res.error.data)))
    }
  }

  const profileHandler = (type: string) => {
    const profile = {name: inputName, surname: inputSurname, mail: type === 'login' ? null : inputMail}
    const changes = {
      name: inputName === '' ? undefined : inputName,
      surname: inputSurname === '' ? undefined : inputSurname,
      mail: inputMail === '' ? undefined : inputMail
    }
    if (type === 'login' || type === 'register') {
      profileReq(profile).then((res: any) => {
        console.log(res)
        if (res.data !== 'success') {
          dispatch(socialSlice.actions.setError(JSON.parse(res)))
        } else {
          localProfileChanges(res, type, null)
        }
      })
    } else {
      getPostsHandler()
      changeProfile({profile: {surname: surname, name: name}, changes: changes}).then((res: any) => {
        console.log(res)
        if (res.data !== 'success') {
          dispatch(socialSlice.actions.setError(JSON.parse(res)))
        } else {
          localProfileChanges(res, type, changes)
          getPostsHandler(inputName, inputSurname)
        }
      })
    }
  }

  const logoutHandler = () => {
    dispatch(socialSlice.actions.login(false))
    dispatch(socialSlice.actions.setName(''))
    dispatch(socialSlice.actions.setSurname(''))
  }

  const subscribeHandler = () => {
    subscribe({name: name, surname: surname, subMail: inputSubMail}).then((res: any) => {
      if (res.data !== 'success') {
        dispatch(socialSlice.actions.setError(JSON.parse(res.error.data) ? JSON.parse(res.error.data) : res.error.error))
      } else {
        getPostsHandler()
      }
    })
  }

  const loginViewHandler = () => setLoginView(!loginView)
  const registerViewHandler = () => setRegisterView(!registerView)
  const followViewHandler = () => setFollowView(!followView)

  const inputNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => setInputName(event.target.value)
  const inputSurnameHandler = (event: React.ChangeEvent<HTMLInputElement>) => setInputSurname(event.target.value)
  const inputMailHandler = (event: React.ChangeEvent<HTMLInputElement>) => setInputMail(event.target.value)
  const inputSubMailHandler = (event: React.ChangeEvent<HTMLInputElement>) => setInputSubMail(event.target.value)

  const loginInputsArr = [
    {
      title: 'Name:',
      changeHandler: inputNameHandler,
      value: inputName
    },
    {
      title: 'Surname:',
      changeHandler: inputSurnameHandler,
      value: inputSurname
    }
  ]

  const registerInputsArr = [...loginInputsArr, {title: 'Mail:', changeHandler: inputMailHandler, value: inputMail}]

  return (
    <>
      <Card.Header>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '80%', margin: '0 auto'}}>
          <Card.Title style={{display: 'flex', flexDirection: 'row'}}>
            {name} {surname}
            <div style={{marginLeft: 20}}>
              {login
                ? <Button
                    onClick={logoutHandler}
                  >
                    <BoxArrowInRight size={30} />
                  </Button>
                : <Button
                    onClick={loginViewHandler}
                  >
                    <BoxArrowInLeft size={30} />
                  </Button>
              }
              <Button
                onClick={registerViewHandler}
                style={{marginLeft: 20}}
              >
                {login
                  ? <PencilSquare size={30} />
                  : 'Register'
                }
              </Button>
            </div>
          </Card.Title>
          {login
            && <Button
                onClick={followViewHandler}
              >
                <PersonPlusFill /> Follow / Unfollow User
              </Button>
          }
        </div>
      </Card.Header>
      <CustomModal
        height={330}
        title={'Login'}
        button={'Login'}
        visible={loginView}
        changeVisible={loginViewHandler}
        inputs={loginInputsArr}
        success={() => profileHandler('login')}
      />
      <CustomModal
        height={330}
        title={login ? 'Edit Profile' : 'Registration'}
        button={login ? 'Edit' : 'Register'}
        visible={registerView}
        changeVisible={registerViewHandler}
        inputs={registerInputsArr}
        success={() => profileHandler(login ? 'edit' : 'register')}
      />
      <CustomModal
        height={250}
        title={'Follow / Unfollow user'}
        button={'Follow / Unfollow'}
        visible={followView}
        changeVisible={followViewHandler}
        inputs={[
          {
            value: inputSubMail,
            title: 'Mail:',
            changeHandler: inputSubMailHandler
          }
        ]}
        success={subscribeHandler}
      />
    </>
  )
};

export default ProfileSettings;