import { useState, useMemo, useEffect, MouseEvent } from 'react';
import * as THREE from 'three';

import Controls from "@/pages/components/Controls";
import MainScene from '@/pages/MainScene';
import "@/pages/app.css";
import { 
  InputMode, ADD, ERASE, COMPASS, STRAIGHTEDGE, NO_SEL, ONE_SEL, READY, SecondaryInputStep
} from "@/pages/constants";
import { projectToLine, angleBetween } from './api/utils';
import ConstructionState from '@/pages/api/ConstructionState';
import LineData from '@/pages/api/LineData';
import ArcData from '@/pages/api/ArcData';
import PointData from '@/pages/api/PointData';

const MAX_SCALE = 40;
const MIN_SCALE = 0.2;


export default function App() {
  const [inputMode, setInputMode] = useState<InputMode>(ADD);

  const [anchorPointIndex, setAnchorPointIndex] = useState<number | null>(null);
  const [secondaryPoint, setSecondaryPoint] = useState<PointData | null>(null);
  const [compassRadius, setCompassRadius] = useState<number | null>(null);

  const resetSecondaryInputStep = () => {
    setAnchorPointIndex(null);
    setSecondaryPoint(null);
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
    } else if (inputMode == COMPASS && newMode == STRAIGHTEDGE) {
      if (secondaryPoint != null && secondaryPoint.isArbitrary) {
        setSecondaryPoint(null);
      }
    } else if (!(newMode == STRAIGHTEDGE || newMode == COMPASS)) {
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
  const [cameraOffset, setCameraOffset] = useState(new THREE.Vector2());

  /// ===== POINTS =====
  const [points, setPoints] = useState<PointData[]>([
      new PointData(new THREE.Vector2(-2, 0)),
      new PointData(new THREE.Vector2(2, 0)),
  ]);

  const addPoint = (p: PointData) => {
    const newPoint = p.clone();
    const newPoints = points.concat([newPoint]);
    const newHistory = history.concat(new ConstructionState(newPoints, lines, arcs));

    setPoints(newPoints);
    setHistory(newHistory);
  };

  const deletePoint = (index: number) => {
    const newPoints = points.filter((p, i) => i != index);

    setPoints(newPoints);
    setHistory(history.concat(new ConstructionState(newPoints, lines, arcs)));
  };


  /// ===== LINES =====
  const [lines, setLines] = useState<LineData[]>([]);
  const [activeLine, setActiveLine] = useState<LineData | null>(null);


  /// ===== ARCS =====
  const [arcs, setArcs] = useState<ArcData[]>([]);
  const [activeArc, setActiveArc] = useState<ArcData | null>(null);


  /// ===== HISTORY =====
  const [history, setHistory] = useState<ConstructionState[]>([new ConstructionState(points)]);
  
  const undo = () => {
    const len = history.length;
    if (len <= 1) return;

    const lastState = history[len - 2];

    setPoints(lastState.points.map((p) => p.clone()));
    setLines(lastState.lines.map((l) => l.clone()));
    setArcs(lastState.arcs.map((a) => a.clone()));
    setHistory(history.slice(0, len - 1));
    resetSecondaryInputStep();
  };

  const clear = () => {
    setPoints([]);
    setLines([]);
    setArcs([]);
    setHistory(history.concat([new ConstructionState()]));
    resetSecondaryInputStep();
  };


  /// ===== EVENTS =====
  const [dragging, setDragging] = useState(false);
  const [leftMB, setLeftMB] = useState(false);
  const [rightMB, setRightMB] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [time, setTime] = useState(new Date().getTime());

  // returns the mouse coordinates in terms of the scene's coordinate space
  const findMouseCoords = (mouseX: number, mouseY: number) => {
    // both in [0, 1]
    let x = mouseX/width;
    let y = mouseY/height;

    // transform to x in [-aspect, aspect], y in [-1, 1]
    x = aspect*(2*x - 1);
    y = 2*y - 1;

    // transform to scene space
    x = scale * x + cameraOffset.x;
    y = -scale * y + cameraOffset.y;

    return new THREE.Vector2(x, y);
  };

  const mouseCoords = useMemo(() => {
    return findMouseCoords(mouseX, mouseY);
  }, [mouseX, mouseY, width, height, aspect, scale, cameraOffset]);


  const clickBackground = (event: MouseEvent<HTMLDivElement>) => {
    const currentTime = new Date().getTime();
    if (currentTime - time > 150) return;

    if (inputMode == ADD) {
      addPoint(new PointData(mouseCoords));
    } else if (inputMode == COMPASS && secondaryInputStep == ONE_SEL) {
      setSecondaryPoint(new PointData(mouseCoords, true));
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
        } else if (secondaryInputStep == READY) {
          setAnchorPointIndex(index)
          setSecondaryPoint(null);
        }
      }
    }
  };

  const onPointerDown = (ev: MouseEvent<HTMLDivElement>) => {
    setTime(new Date().getTime());
    setDragging(true);

    if (ev.button == 0) {
      if (
        inputMode == STRAIGHTEDGE && secondaryInputStep == READY &&
        anchorPointIndex != null && secondaryPoint != null
      ) {
        const anchorPoint = points[anchorPointIndex];
        const startPoint = projectToLine(mouseCoords, anchorPoint.point, secondaryPoint.point);
        setActiveLine(new LineData(startPoint, startPoint));
      } else if (inputMode == COMPASS && anchorPointIndex != null && secondaryPoint != null) {
        const center = points[anchorPointIndex];
        const radius = center.point.distanceTo(secondaryPoint.point);
        const diff = mouseCoords.clone().sub(center.point);
        const mouseAngle = Math.atan2(diff.y, diff.x);
        setActiveArc(new ArcData(center.point, radius, mouseAngle, mouseAngle));
      }

      setLeftMB(true);
      setRightMB(false);
    } else if (ev.button = 2) {
      ev.preventDefault();

      setRightMB(true);
      setLeftMB(false);
    }
  };

  const onPointerUp = () => {
    if (leftMB) {
      if (inputMode == STRAIGHTEDGE && secondaryInputStep == READY && activeLine != null) {
        const newLines = lines.concat([activeLine]);
  
        setLines(newLines);
        setActiveLine(null);
        setHistory(history.concat([new ConstructionState(points, newLines, arcs)]));
      } else if (inputMode == COMPASS && secondaryInputStep == READY && activeArc != null) {
        if (activeArc.endAngle != activeArc.startAngle) {
          const newArcs = arcs.concat([activeArc]);
  
          setArcs(newArcs);
          setActiveArc(null);
          setHistory(history.concat([new ConstructionState(points, lines, newArcs)]));
        }
      }
    } else if (rightMB) {
      const currentTime = new Date().getTime();

      if (currentTime - time < 150 && secondaryInputStep == ONE_SEL) {
        setAnchorPointIndex(null);
      }
    }

    setDragging(false);
    setLeftMB(false);
    setRightMB(false);
  };

  const onPointerMove = (ev: MouseEvent<HTMLDivElement>) => {
    const newMouseX = ev.clientX;
    const newMouseY = ev.clientY;

    if (dragging) {
      if (
        inputMode == STRAIGHTEDGE && anchorPointIndex != null && secondaryPoint != null && activeLine != null
      ) {
        const anchorPoint = points[anchorPointIndex];
        setActiveLine(new LineData(activeLine.start, projectToLine(mouseCoords, anchorPoint.point, secondaryPoint.point)));
      } else if (
        inputMode == COMPASS && anchorPointIndex != null && secondaryPoint != null && activeArc != null
      ) {
        const diff = mouseCoords.clone().sub(activeArc.center);

        const newMouseCoords = findMouseCoords(newMouseX, newMouseY);
        const newDiff = newMouseCoords.clone().sub(activeArc.center);

        const d_angle = angleBetween(diff, newDiff);
        const newEndAngle = activeArc.endAngle + d_angle;

        setActiveArc(new ArcData(activeArc.center, activeArc.radius, activeArc.startAngle, newEndAngle));
      } else {
        const newCameraOffsetX = cameraOffset.x - 2*aspect*scale*ev.movementX/width;
        const newCameraOffsetY = cameraOffset.y + 2*scale*ev.movementY/height;
        setCameraOffset(new THREE.Vector2(newCameraOffsetX, newCameraOffsetY));
      }
    }

    setMouseX(newMouseX);
    setMouseY(newMouseY);
  };

  const onScroll = (ev: React.WheelEvent<HTMLDivElement>) => {
    const increment = 0.002 * scale * ev.deltaY;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + increment));
    const dScale = newScale - scale;
    
    setScale(newScale);
    const newCameraOffsetX = cameraOffset.x - (mouseCoords.x - cameraOffset.x) * dScale/scale;
    const newCameraOffsetY = cameraOffset.y - (mouseCoords.y - cameraOffset.y) * dScale/scale;
    setCameraOffset(new THREE.Vector2(newCameraOffsetX, newCameraOffsetY));
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
        cameraOffset={cameraOffset}

        points={points}
        inputMode={inputMode}
        anchorPointIndex={anchorPointIndex}
        secondaryPoint={secondaryPoint}
        secondaryInputStep={secondaryInputStep}
        mouseCoords={mouseCoords}

        lines={lines}
        activeLine={activeLine}
        arcs={arcs}
        activeArc={activeArc}
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
