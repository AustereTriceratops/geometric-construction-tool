import { InputMode, ADD, ERASE, STRAIGHTEDGE, COMPASS, SecondaryInputStep } from "@/pages/constants";
import ToolButton from "@/pages/components/ToolButton";
import Erase from '@/assets/eraser.svg';

import { Create, Straighten, Architecture, Undo, Delete } from '@mui/icons-material';
import { SvgIcon } from "@mui/material";

interface ControlsProps {
    inputMode: InputMode;
    setInputMode: (mode: InputMode) => void;
    secondaryInputStep: SecondaryInputStep;
    undo: () => void;
    clear: () => void;
}

const Controls = (props: ControlsProps) => {
    const {inputMode, setInputMode, secondaryInputStep, undo, clear} = props;

    return (
        <div style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            top: '5rem',
            left: '2rem',
            gap: '0.1rem'
        }}>
            <ToolButton
                name="add point"
                selected={inputMode == ADD}
                onClick={() => setInputMode(ADD)}
            >
                <Create fontSize='inherit'/>
            </ToolButton>
            <ToolButton
                name="straightedge"
                selected={inputMode == STRAIGHTEDGE}
                onClick={() => setInputMode(STRAIGHTEDGE)}
                secondaryInputStep={secondaryInputStep}
            >
                <Straighten fontSize='inherit'/>
            </ToolButton>
            <ToolButton
                name="compass"
                selected={inputMode == COMPASS}
                onClick={() => setInputMode(COMPASS)}
                secondaryInputStep={secondaryInputStep}
            >
                <Architecture fontSize='inherit'/>
            </ToolButton>
            <ToolButton
                name='erase'
                selected={inputMode == ERASE}
                onClick={() => setInputMode(ERASE)}
            >
                <SvgIcon fontSize='inherit'>
                    <Erase/>
                </SvgIcon>
            </ToolButton>
            <ToolButton
                name='undo'
                onClick={() => undo()}
            >
                <Undo fontSize='inherit'/>
            </ToolButton>
            <ToolButton
                name='clear'
                onClick={() => clear()}
            >
                <Delete fontSize='inherit'/>
            </ToolButton>
        </div>
    )
}

export default Controls;