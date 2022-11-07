import React, {FC, ReactNode} from 'react';
import Modal from 'react-bootstrap/Modal';
import {Button} from "react-bootstrap";

interface ModalProps {
  height: string | number
  title: string
  button: string
  visible: boolean
  changeVisible: () => void
  inputs: ReactNode[],
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
          <div key={index}>
            {input}
          </div>
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