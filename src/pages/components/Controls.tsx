import { InputMode, ADD, ERASE, STRAIGHTEDGE, COMPASS } from "@/pages/constants";
import ToolButton from "@/pages/components/ToolButton";
import Erase from '@/assets/eraser.svg';

import { Create, Straighten, Architecture, Undo, Delete } from '@mui/icons-material';
import { SvgIcon } from "@mui/material";

interface ControlsProps {
    setInputMode: (mode: InputMode) => void;
    undo: () => void;
    clear: () => void;
}

const Controls = (props: ControlsProps) => {
    const {setInputMode, undo, clear} = props;
    return (
        <div style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            top: '5rem',
            left: '2rem',
            gap: '0.1rem'
        }}>
            <ToolButton name="add point" onClick={() => setInputMode(ADD)}>
                <Create fontSize='inherit'/>
            </ToolButton>
            <ToolButton name="straightedge" onClick={() => setInputMode(STRAIGHTEDGE)}>
                <Straighten fontSize='inherit'/>
            </ToolButton>
            <ToolButton name="compass" onClick={() => setInputMode(COMPASS)}>
                <Architecture fontSize='inherit'/>
            </ToolButton>
            <ToolButton name='erase' onClick={() => setInputMode(ERASE)}>
                <SvgIcon fontSize='inherit'>
                    <Erase/>
                </SvgIcon>
            </ToolButton>
            <ToolButton name='undo' onClick={() => undo()}>
                <Undo fontSize='inherit' />
            </ToolButton>
            <ToolButton name='clear' onClick={() => clear()}>
                <Delete fontSize='inherit'/>
            </ToolButton>
        </div>
    )
}

export default Controls;