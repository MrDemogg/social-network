import {IProfile} from "./IProfile";
import {IChanges} from "./IChanges";

export interface IProfileChange {
  profile: IProfile,
  changes: IChanges
}