import {useDispatch, TypedUseSelectorHook, useSelector} from "react-redux";
import {RootState, AppDispatch} from "../store/store";

export const useAppDispatch = (): any => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector