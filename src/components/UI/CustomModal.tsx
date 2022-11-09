import React, {FC} from 'react';
import Modal from 'react-bootstrap/Modal';
import {Button, Form, InputGroup} from "react-bootstrap";
import {IInput} from "../../models/IInput";

interface ModalProps {
  height: string | number
  title: string
  button: string
  visible: boolean
  changeVisible: () => void
  inputs: IInput[],
  success: () => void
}

const CustomModal: FC<ModalProps> = ({height, button, inputs, changeVisible, visible, title, success}) => {
  return (
    <Modal show={visible} onHide={changeVisible} style={{height: height}}>
      <Modal.Header closeButton>
        {title}
      </Modal.Header>
      <Modal.Body>
        {inputs.map((input, index) =>
          <InputGroup key={index} style={{marginTop: 10}}>
            <InputGroup.Text>{input.title}</InputGroup.Text>
            <Form.Control
              value={input.value}
              onChange={input.changeHandler}
            />
          </InputGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant={'outline-success'} onClick={() => {
          changeVisible()
          success()
        }}>
          {button}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;