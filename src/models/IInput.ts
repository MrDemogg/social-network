import {ChangeEvent} from "react";

export interface IInput {
  title: string
  value: string
  changeHandler: (e: ChangeEvent<HTMLInputElement>) => void
}