import LineData from './LineData';
import ArcData from './ArcData';
import PointData from './PointData';

class ConstructionState {
  points: PointData[];
  lines: LineData[];
  arcs: ArcData[];

  constructor(points: PointData[] = [], lines: LineData[] = [], arcs: ArcData[] = []) {
    this.points = points;
    this.lines = lines;
    this.arcs = arcs;
  }
}

export default ConstructionState;