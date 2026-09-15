import { STRAIGHTEDGE, COMPASS, SecondaryInputStep, READY, ONE_SEL } from "../constants";

import { MouseEvent, ReactNode, useState } from "react";
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
})


interface ButtonIconProps {
    onClick: () => void;
    selected?: Boolean;
    hovered: Boolean;
    setHovered: (b: Boolean) => void;
    children: ReactNode;
}

const ButtonIcon = (props: ButtonIconProps) => {
    const {onClick, selected, hovered, setHovered, children} = props;

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'flex',
                flexDirection: 'row',
                backgroundColor: (selected) ? '#626a72' : ((hovered) ? '#888888' : '#bbbbbb'),
                fontSize: '48px',
                width:'fit-content',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                padding: '8px',
                borderRadius: '12px',
                borderStyle: 'solid',
                borderColor: (selected) ? '#ffffff' : '#ffffff00',
            }}
        >
            {children}
        </div>
    )
}


interface ToolButtonProps {
    onClick: () => void;
    name: string;
    selected?: Boolean;
    secondaryInputStep?: SecondaryInputStep;
    children: ReactNode;
}

const ToolButton = (props: ToolButtonProps) => {
    const {name, selected, onClick, secondaryInputStep, children} = props;

    const [hovered, setHovered] = useState<Boolean>(false);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
        }}>
            <div style={{
                visibility: (hovered) ? 'visible' : 'hidden',
                paddingTop: '4px',
                paddingBottom: '2px',
                paddingLeft: '5px',
                color: '#555',
                font: 'roboto',
                fontSize: '12px',
                fontWeight: '700',
                userSelect: 'none',
            }}>
                <div className={roboto.className}>
                    {name}
                </div>
            </div>

            {
                (name == STRAIGHTEDGE) 
                ?
                <div style={{display: 'flex', flexDirection: 'row', gap: '0.3rem'}}>
                    <ButtonIcon
                        onClick={onClick}

                        selected={selected}
                        hovered={hovered}
                        setHovered={setHovered}
                    >
                        {children}
                    </ButtonIcon>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.1rem', justifyContent: 'center'}}>
                        <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '6px',
                            backgroundColor: (secondaryInputStep == READY) ? '#7fa629' : ((secondaryInputStep == ONE_SEL) ? '#6db4ff' : '#ebc958')
                        }}></div>
                        <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '6px',
                            backgroundColor: (secondaryInputStep == READY ) ? '#7fa629' : ((secondaryInputStep == ONE_SEL) ? '#ebc958' : '#ffffff00')
                        }}></div>
                    </div>
                </div>
                :
                <ButtonIcon
                    onClick={onClick}

                    selected={selected}
                    hovered={hovered}
                    setHovered={setHovered}
                >
                    {children}
                </ButtonIcon>
            }
        </div>
    )
};

export default ToolButton;