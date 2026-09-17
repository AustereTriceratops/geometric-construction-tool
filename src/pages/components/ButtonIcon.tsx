import { ReactNode } from "react";

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

export default ButtonIcon;