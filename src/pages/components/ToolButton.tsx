import { MouseEvent, ReactNode, useState } from "react";
import { Roboto } from 'next/font/google';

import ButtonIcon from "./ButtonIcon";
import { STRAIGHTEDGE, COMPASS, SecondaryInputStep, READY, ONE_SEL, COLORS } from "../constants";


const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
})

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
                color: COLORS.TEXT,
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
                            visibility: (selected)? 'visible' : 'hidden',
                            width: '20px',
                            height: '20px',
                            borderRadius: '6px',
                            backgroundColor: (secondaryInputStep == READY) ? COLORS.GREEN : ((secondaryInputStep == ONE_SEL) ? COLORS.BLUE : COLORS.YELLOW)
                        }}></div>
                        <div style={{
                            visibility: (selected)? 'visible' : 'hidden',
                            width: '20px',
                            height: '20px',
                            borderRadius: '6px',
                            backgroundColor: (secondaryInputStep == READY ) ? COLORS.GREEN : ((secondaryInputStep == ONE_SEL) ? COLORS.YELLOW : COLORS.TRANSPARENT)
                        }}></div>
                    </div>
                </div>
                : (name == COMPASS)
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
                                visibility: (selected)? 'visible' : 'hidden',
                                width: '20px',
                                height: '20px',
                                borderRadius: '6px',
                                backgroundColor: (secondaryInputStep == READY) ? COLORS.GREEN : ((secondaryInputStep == ONE_SEL) ? COLORS.BLUE : COLORS.YELLOW)
                            }}></div>
                            <div style={{
                                visibility: (selected)? 'visible' : 'hidden',
                                width: '20px',
                                height: '20px',
                                borderRadius: '6px',
                                backgroundColor: (secondaryInputStep == READY ) ? COLORS.GREEN : ((secondaryInputStep == ONE_SEL) ? COLORS.YELLOW : COLORS.TRANSPARENT)
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