import * as THREE from "three";

export class PathfindingLogic {
  constructor() {
    this.epsilon = 0.0001;
    this.zones = {};
    this.defaultZone = 'default';
  }

  // New method to load and process the Blender JSON
  async loadFromJSON(url, zone = this.defaultZone) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      // Create waypoints from vertices
      const waypoints = data.vertices.map(v => new THREE.Vector3(v[0], v[1], v[2]));
      
      // Build adjacency list
      const adjacencyList = new Map();
      waypoints.forEach((_, index) => {
        adjacencyList.set(index, new Set());
      });
      
      // Process connections from edges
      data.edges.forEach(edge => {
        const [a, b] = edge;
        adjacencyList.get(a).add(b);
        adjacencyList.get(b).add(a); // For bidirectional connections
      });
      
      // Store the processed data
      this.zones[zone] = {
        waypoints,
        adjacencyList
      };
      
      console.log(`Waypoint graph loaded for zone ${zone}:`, waypoints.length, "waypoints");
      return true;
      
    } catch (error) {
      console.error("Error loading waypoint graph:", error);
      return false;
    }
  }

  // Modified pathfinding to work with waypoints
  findPath(startPos, endPos, zone = this.defaultZone) {
    const zoneData = this.zones[zone];
    if (!zoneData) {
      console.error(`Zone ${zone} not found`);
      return null;
    }

    const { waypoints, adjacencyList } = zoneData;

    // Find nearest waypoints (instead of faces)
    const startWaypoint = this.findNearestWaypoint(startPos, waypoints);
    const endWaypoint = this.findNearestWaypoint(endPos, waypoints);

    if (startWaypoint === null || endWaypoint === null) {
      console.error('Could not find start/end waypoints');
      return null;
    }

    // A* implementation adapted for waypoints
    const openSet = new Set([startWaypoint.index]);
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    waypoints.forEach((_, index) => {
      gScore.set(index, Infinity);
      fScore.set(index, Infinity);
    });

    gScore.set(startWaypoint.index, 0);
    fScore.set(startWaypoint.index, this.heuristic(startWaypoint.position, waypoints[endWaypoint.index]));

    while (openSet.size > 0) {
      const current = this.getLowestFScore(openSet, fScore);

      if (current === endWaypoint.index) {
        return this.reconstructPath(cameFrom, current, waypoints);
      }

      openSet.delete(current);

      for (const neighbor of adjacencyList.get(current)) {
        const tentativeGScore = gScore.get(current) +
          waypoints[current].distanceTo(waypoints[neighbor]);

        if (tentativeGScore < gScore.get(neighbor)) {
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentativeGScore);
          fScore.set(neighbor, tentativeGScore +
            this.heuristic(waypoints[neighbor], waypoints[endWaypoint.index]));

          if (!openSet.has(neighbor)) {
            openSet.add(neighbor);
          }
        }
      }
    }

    console.error('No path found');
    return null;
  }

  // Modified helper methods
  heuristic(a, b) {
    return a.distanceTo(b);
  }

  findNearestWaypoint(position, waypoints) {
    let nearest = null;
    let minDistance = Infinity;

    waypoints.forEach((waypoint, index) => {
      const distance = position.distanceTo(waypoint);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = {
          position: waypoint,
          index
        };
      }
    });

    return nearest;
  }

  getLowestFScore(openSet, fScore) {
    let lowest = null;
    let lowestScore = Infinity;

    openSet.forEach(index => {
      const score = fScore.get(index);
      if (score < lowestScore) {
        lowestScore = score;
        lowest = index;
      }
    });

    return lowest;
  }

  reconstructPath(cameFrom, current, waypoints) {
    const path = [waypoints[current].clone()];
    while (cameFrom.has(current)) {
      current = cameFrom.get(current);
      path.unshift(waypoints[current].clone());
    }
    return path;
  }

  // Optional: Visualization helper
  createDebugScene(zone = this.defaultZone) {
    const zoneData = this.zones[zone];
    if (!zoneData) return null;

    const { waypoints, adjacencyList } = zoneData;
    const group = new THREE.Group();
    
    // Add spheres for waypoints
    waypoints.forEach((pos, index) => {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
      );
      sphere.position.copy(pos);
      group.add(sphere);
    });
    
    // Add lines for connections
    adjacencyList.forEach((neighbors, index) => {
      const origin = waypoints[index];
      neighbors.forEach(neighborIndex => {
        const neighbor = waypoints[neighborIndex];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([origin, neighbor]);
        const line = new THREE.Line(
          lineGeometry,
          new THREE.LineBasicMaterial({ color: 0x00ff00 })
        );
        group.add(line);
      });
    });
    
    return group;
  }
}