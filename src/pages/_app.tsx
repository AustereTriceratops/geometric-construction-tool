import { useState, useMemo, useEffect, MouseEvent } from 'react';
import * as THREE from 'three';

import Controls from "@/pages/components/Controls";
import MainScene from '@/pages/MainScene';
import "@/pages/app.css";
import { 
  InputMode, ADD, ERASE, COMPASS, STRAIGHTEDGE, NO_SEL, ONE_SEL, READY, SecondaryInputStep
} from "@/pages/constants";
import { projectToLine } from './utils';
import ConstructionState from '@/pages/api/ConstructionState';
import LineData from '@/pages/api/LineData';

const MAX_SCALE = 40;
const MIN_SCALE = 0.2;


export default function App() {
  const [inputMode, setInputMode] = useState<InputMode>(ADD);

  const [anchorPointIndex, setAnchorPointIndex] = useState<number | null>(null);
  const [secondaryPoint, setSecondaryPoint] = useState<THREE.Vector2 | null>(null);

  const resetSecondaryInputStep = () => {
    setAnchorPointIndex(null);
    setSecondaryPoint(null);
    // setActiveLine([]);
  }

  // TODO: figure out how to use this with the compass tool
  const secondaryInputStep = useMemo<SecondaryInputStep>(() => {
    if (anchorPointIndex == null) {
      return NO_SEL;
    } else {
      if (secondaryPoint == null) {
        return ONE_SEL;
      } else {
        return READY;
      }
    }
  }, [anchorPointIndex, secondaryPoint]);

  const updateInputMode = (newMode: InputMode) => {
    // if we switch from straightedge to comapss or vice-versa
    // then we'd like to keep our selected points
    if (inputMode == newMode) {
      resetSecondaryInputStep();
    } else if (!(
      (inputMode == STRAIGHTEDGE || inputMode == COMPASS) &&
      (newMode == STRAIGHTEDGE || newMode == COMPASS)
    )) {
      resetSecondaryInputStep();
    }
    setInputMode(newMode);
  }

  /// ===== CANVAS =====
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }, []);

  const aspect = useMemo(() => width/height, [width, height]);

  /// ===== CAMERA =====
  const [scale, setScale] = useState(5);
  const [cameraOffsetX, setCameraOffsetX] = useState(0);
  const [cameraOffsetY, setCameraOffsetY] = useState(0);

  /// ===== POINTS =====
  const [points, setPoints] = useState<THREE.Vector2[]>(
    [new THREE.Vector2(0, 0), new THREE.Vector2(1.2, 2), new THREE.Vector2(-2, -0.6)]
  );

  const addPoint = (p: THREE.Vector2) => {
    const newPoint = p.clone();
    const newPoints = points.concat([newPoint]);
    const newHistory = history.concat(new ConstructionState(newPoints));

    setPoints(newPoints);
    setHistory(newHistory);
  };

  const deletePoint = (index: number) => {
    const newPoints = points.filter((p, i) => i != index);

    setPoints(newPoints);
    setHistory(history.concat(new ConstructionState(newPoints)));
  };


  /// ===== LINES =====
  const [lines, setLines] = useState<LineData[]>([]);
  const [activeLine, setActiveLine] = useState<LineData | null>(null);


  /// ===== HISTORY =====
  const [history, setHistory] = useState<ConstructionState[]>([new ConstructionState(points)]);
  
  const undo = () => {
    const len = history.length;
    if (len <= 1) return;

    const lastState = history[len - 2];

    setPoints(lastState.points);
    setLines(lastState.lines);
    setHistory(history.slice(0, len - 1));
  };

  const clear = () => {
    setPoints([]);
    setHistory(history.concat([new ConstructionState()]));
  };


  /// ===== EVENTS =====
  const [dragging, setDragging] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [time, setTime] = useState(new Date().getTime());

  // TODO: maybe this should just be a function instead of a memo
  // returns the mouse coordinates in terms of the scene's coordinate space
  const mouseCoords = useMemo<THREE.Vector2>(() => {
    // both in [0, 1]
    let x = mouseX/width;
    let y = mouseY/height;

    // transform to x in [-aspect, aspect], y in [-1, 1]
    x = aspect*(2*x - 1);
    y = 2*y - 1;

    // transform to scene space
    x = scale * x + cameraOffsetX;
    y = -scale * y + cameraOffsetY;

    return new THREE.Vector2(x, y);
  }, [mouseX, mouseY, width, height, aspect, scale, cameraOffsetX, cameraOffsetY]);


  const clickBackground = (event: MouseEvent<HTMLDivElement>) => {
    const currentTime = new Date().getTime();
    if (currentTime - time > 150) return;

    if (inputMode == ADD) {
      addPoint(mouseCoords);
    }
  };

  const clickPoint = (index: number) => {
    return (ev: MouseEvent<HTMLDivElement>) => {
      ev.stopPropagation();
      
      if (inputMode == ERASE) {
        deletePoint(index);
      } else if (inputMode == STRAIGHTEDGE || inputMode == COMPASS) {
        if (secondaryInputStep == NO_SEL) {
          setAnchorPointIndex(index);
        } else if (secondaryInputStep == ONE_SEL) {
          setSecondaryPoint(points[index].clone());
        }
      }
    }
  };

  const onPointerDown = (ev: MouseEvent<HTMLDivElement>) => {
    if (ev.button == 0 || ev.button == 1) {
      setDragging(true);
      setTime(new Date().getTime());

      if (
        inputMode == STRAIGHTEDGE && secondaryInputStep == READY &&
        anchorPointIndex != null && secondaryPoint != null
      ) {
        const anchorPoint = points[anchorPointIndex];
        const startPoint = projectToLine(mouseCoords, anchorPoint, secondaryPoint);
        setActiveLine(new LineData(startPoint, startPoint));
      }
    } else if (ev.button == 2) {
      resetSecondaryInputStep();
    }
  };

  const onPointerUp = () => {
    setDragging(false);

    if (inputMode == STRAIGHTEDGE && secondaryInputStep == READY) {
      if (activeLine != null) {
        const newLines = lines.concat([activeLine]);

        setLines(newLines);
        setActiveLine(null);
        setHistory(history.concat([new ConstructionState(points, newLines)]));
      }
    } else if (inputMode == COMPASS && secondaryInputStep == ONE_SEL) {
      // NOT GOOD
      // clicking background must be treated completely separately from clicking points
      // setSecondaryPoint(mouseCoords.clone());
    }
  };

  const onPointerMove = (ev: MouseEvent<HTMLDivElement>) => {
    setMouseX(ev.clientX);
    setMouseY(ev.clientY);

    if (dragging) {
      if (anchorPointIndex != null && secondaryPoint != null && activeLine != null) {
        if (inputMode == STRAIGHTEDGE) {
          const anchorPoint = points[anchorPointIndex];
          setActiveLine(new LineData(activeLine.start, projectToLine(mouseCoords, anchorPoint, secondaryPoint)));
        } else if (inputMode == COMPASS) {
          console.log('drawing arcs');
        }
      } else {
        setCameraOffsetX(cameraOffsetX - 2*aspect*scale*ev.movementX/width);
        setCameraOffsetY(cameraOffsetY + 2*scale*ev.movementY/height);
      }
    }
  };

  const onScroll = (ev: React.WheelEvent<HTMLDivElement>) => {
    const increment = 0.002 * scale * ev.deltaY;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + increment));
    const dScale = newScale - scale;
    setScale(newScale);

    const biasX = mouseX/width;
    const biasY = mouseY/height;
    setCameraOffsetX(cameraOffsetX - (2.0 * biasX - 1) * dScale);
    setCameraOffsetY(cameraOffsetY + (2.0 * biasY - 1) * dScale);
  };

  return (
    <div style={{position: 'relative', width: '100vw', height: '100vh'}}>
      <MainScene
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        onScroll={onScroll}
        clickPoint={clickPoint}
        clickBackground={clickBackground}

        scale={scale}
        aspect={aspect}
        cameraOffsetX={cameraOffsetX}
        cameraOffsetY={cameraOffsetY}

        points={points}
        inputMode={inputMode}
        anchorPointIndex={anchorPointIndex}
        secondaryPoint={secondaryPoint}
        secondaryInputStep={secondaryInputStep}
        mouseCoords={mouseCoords}

        lines={lines}
        activeLine={activeLine}
      />

      <Controls
        inputMode={inputMode}
        setInputMode={updateInputMode}
        secondaryInputStep={secondaryInputStep}
        undo={undo}
        clear={clear}
      />
    </div>
  )
}
