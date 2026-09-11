import { MouseEvent, ReactNode, useState } from "react"
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
})

interface ToolButtonProps {
    name: string;
    onClick: () => void;
    children: ReactNode;
}

const ToolButton = (props: ToolButtonProps) => {
    const {name, onClick, children} = props;

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
                fontWeight: '700'
            }}>
                <div className={roboto.className}>
                    {name}
                </div>
            </div>
            <div
                className='toolButton'
                onClick={onClick}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {children}
            </div>
        </div>
    )
};

export default ToolButton;