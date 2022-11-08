import React, {useState} from 'react';
import {Button, Card} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "../hooks/redux";
import {BoxArrowInLeft, PencilSquare} from "react-bootstrap-icons";
import {socialAPI} from "../service/SocialService";
import {socialSlice} from "../store/reducers/SocialSlice";
import CustomModal from "./UI/CustomModal";
import {IChanges} from "../models/IChanges";

const ProfileSettings = () => {
  const {name, surname, login} = useAppSelector(state => state.socialReducer)
  const [inputName, setInputName] = useState('')
  const [inputMail, setInputMail] = useState('')
  const [inputSurname, setInputSurname] = useState('')
  const [profileReq, {}] = socialAPI.useProfilePostMutation()
  const [changeProfile, {

  }] = socialAPI.useChangeProfileMutation()
  const [loginView, setLoginView] = useState(false)
  const [registerView, setRegisterView] = useState(false)
  const dispatch = useAppDispatch()

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
      dispatch(socialSlice.actions.setError(res.message))
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
      profileReq(profile).then((res: any) => localProfileChanges(res, type, null))
    } else {
      changeProfile({profile: {surname: surname, name: name}, changes: changes}).then((res: any) => localProfileChanges(res, type, changes))
    }
  }

  const loginViewHandler = () => setLoginView(!loginView)
  const registerViewHandler = () => setRegisterView(!registerView)

  const inputNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => setInputName(event.target.value)
  const inputSurnameHandler = (event: React.ChangeEvent<HTMLInputElement>) => setInputSurname(event.target.value)
  const inputMailHandler = (event: React.ChangeEvent<HTMLInputElement>) => setInputMail(event.target.value)

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
      <CustomModal
        height={300}
        title={'Login'}
        button={'Login'}
        visible={loginView}
        changeVisible={loginViewHandler}
        inputs={loginInputsArr}
        success={() => profileHandler('login')}
      />
      <CustomModal
        height={300}
        title={login ? 'Edit Profile' : 'Registration'}
        button={login ? 'Edit' : 'Register'}
        visible={registerView}
        changeVisible={registerViewHandler}
        inputs={registerInputsArr}
        success={() => profileHandler(login ? 'edit' : 'register')}
      />
      <Card.Header>
        <Card.Title style={{display: 'flex', flexDirection: 'row'}}>
          {name} {surname}
          <Button
            onClick={loginViewHandler}
          >
            <BoxArrowInLeft size={30} />
          </Button>
          <Button
            onClick={registerViewHandler}
          >
            {login
              ? <PencilSquare size={30} />
              : 'Register'
            }
          </Button>
        </Card.Title>
      </Card.Header>
    </>
  )
};

export default ProfileSettings;