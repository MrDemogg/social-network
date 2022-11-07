import React, {FC} from 'react';
import {InputSettings} from "../../models/InputSettings";

interface ModalProps {
  height: string | number
  title: string
  button: string
  visible: boolean
  changeVisible: () => void
  inputs: InputSettings[]
}

const Modal: FC<ModalProps> = ({height, button, inputs, changeVisible, visible, title}) => {
  return (
    <div>
      
    </div>
  );
};

export default Modal;