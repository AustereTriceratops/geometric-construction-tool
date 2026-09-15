import { MouseEvent, ReactNode, useState } from "react"
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
})

interface ToolButtonProps {
    name: string;
    selected?: Boolean;
    onClick: () => void;
    children: ReactNode;
}

const ToolButton = (props: ToolButtonProps) => {
    const {name, selected, onClick, children} = props;

    const [hovered, setHovered] = useState(false);

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
            <div
                onClick={onClick}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: (hovered) ? '#888888' : '#bbbbbb',
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
        </div>
    )
};

export default ToolButton;