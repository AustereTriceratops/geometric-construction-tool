import { Line } from '@react-three/drei';

interface PreviewLineProps {
    x_1: number;
    y_1: number;
    x_2: number;
    y_2: number;
}

const PreviewLine = (props : PreviewLineProps) => {
    const {x_1, y_1, x_2, y_2} = props;

    return (
        <Line
            dashed
            points={[[x_1, y_1], [x_2, y_2]]}
            lineWidth={2}
            color="black"
            dashScale={10}
        />
    )
}

export default PreviewLine;