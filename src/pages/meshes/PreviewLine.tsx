import { Line } from '@react-three/drei';

interface PreviewLineProps {
   p_start: number[];
   p_end: number[]
}

const PreviewLine = (props : PreviewLineProps) => {
    const {p_start, p_end} = props;

    return (
        <Line
            dashed
            points={[[p_start[0], p_start[1]], [p_end[0], p_end[1]]]}
            lineWidth={2}
            color="black"
            dashScale={10}
        />
    )
}

export default PreviewLine;