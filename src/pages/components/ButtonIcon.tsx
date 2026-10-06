import { ReactNode } from "react";
import { COLORS } from "../constants";

interface ButtonIconProps {
    onClick: () => void;
    selected?: Boolean;
    hovered: Boolean;
    setHovered: (b: Boolean) => void;
    children: ReactNode;
}

// wrapper for SVGIcons from MUI
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
                backgroundColor: (selected) ? COLORS.BUTTON_SELECTED : ((hovered) ? COLORS.OBJECT_HIGHLIGHT : COLORS.BUTTON),
                fontSize: '48px',
                width:'fit-content',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                padding: '8px',
                borderRadius: '12px',
                borderStyle: 'solid',
                borderColor: (selected) ? 'white' : COLORS.TRANSPARENT,
            }}
        >
            {children}
        </div>
    )
}

export default ButtonIcon;