import BaseGameMode, {BaseGameModeProps} from "./BaseGameMode";
import {guessDepartmentConfig} from "./configs/GuessDepartmentConfig";
import type {DepartmentType} from "../../../interfaces/department";

type GuessDepartmentModeProps = Omit<BaseGameModeProps<DepartmentType>, 'config'>

export default function GuessDepartmentMode(props: GuessDepartmentModeProps) {
    return <BaseGameMode<DepartmentType> {...props} config={guessDepartmentConfig}/>
}
