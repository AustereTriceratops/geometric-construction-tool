import { InputMode, DRAW, ERASE, STRAIGHTEDGE, COMPASS } from "@/pages/constants";
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
            display: 'inline-flex',
            flexDirection: 'column',
            width: '48px',
            top: '5rem',
            left: '2rem',
            gap: '1rem'
        }}>
            <div className='modeButton' onClick={() => setInputMode(DRAW)}>
                <Create fontSize='inherit'/>
            </div>
            <div className='modeButton' onClick={() => setInputMode(STRAIGHTEDGE)}>
                <Straighten fontSize='inherit'/>
            </div>
            <div className='modeButton' onClick={() => setInputMode(COMPASS)}>
                <Architecture fontSize='inherit'/>
            </div>
            <div className='modeButton' onClick={() => setInputMode(ERASE)}>
                <SvgIcon fontSize='inherit'>
                    <Erase/>
                </SvgIcon>
            </div>
            <div className='modeButton'>
                <Undo fontSize='inherit' onClick={() => undo()}/>
            </div>
            <div className='modeButton' onClick={() => clear()}>
                <Delete fontSize='inherit'/>
            </div>
        </div>
    )
}

export default Controls;