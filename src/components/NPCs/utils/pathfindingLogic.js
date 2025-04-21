import * as THREE from "three";

export class PathfindingLogic {
  constructor() {
    this.epsilon = 0.0001;
    this.zones = {};
    this.defaultZone = 'default';
    this.maxPathGenerationAttempts = 100;
  }

  // Load and process the Blender JSON
  async loadFromJSON(url, { debugPathfinding = false, debugErrors = false } = {}) {
    try {
      if (debugPathfinding) console.log("[NPCs/Pathfinding] Loading waypoint graph from:", url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      const waypoints = data.vertices.map(v => new THREE.Vector3(v[0], v[1], v[2]));
      
      const adjacencyList = new Map();
      waypoints.forEach((_, index) => {
        adjacencyList.set(index, new Set());
      });
      
      data.edges.forEach(edge => {
        const [a, b] = edge;
        adjacencyList.get(a).add(b);
        adjacencyList.get(b).add(a);
      });
      
      this.zones[this.defaultZone] = { waypoints, adjacencyList };
      
      if (debugPathfinding) {
        console.log("[NPCs/Pathfinding] Waypoint graph loaded:", {
          waypoints: waypoints.length,
          edges: data.edges.length,
          firstWaypoint: waypoints[0].toArray()
        });
      }
      return true;
      
    } catch (error) {
      if (debugErrors) console.error("[NPCs/Errors] Error loading waypoint graph:", error);
      return false;
    }
  }

  findPath(startPos, endPos, { debugPathfinding = false, debugErrors = false } = {}) {
    const zoneData = this.zones[this.defaultZone];
    if (!zoneData) {
      if (debugErrors) console.error("[NPCs/Errors] Zone not loaded");
      return null;
    }

    const { waypoints, adjacencyList } = zoneData;
    
    const startWaypoint = this.findNearestWaypoint(startPos, waypoints);
    const endWaypoint = this.findNearestWaypoint(endPos, waypoints);
    
    if (startWaypoint === null || endWaypoint === null) {
      if (debugErrors) console.error("[NPCs/Errors] Invalid start/end positions");
      return null;
    }
    
    if (startWaypoint.index === endWaypoint.index) {
      if (debugPathfinding) console.log("[NPCs/Pathfinding] Start and end at same waypoint");
      return [waypoints[startWaypoint.index].clone()];
    }
    
    // Try direct path first
    let directPath = this.findDirectPath(
      startWaypoint.index, 
      endWaypoint.index, 
      adjacencyList, 
      waypoints, 
      { debugPathfinding }
    );
    
    if (directPath) {
      if (debugPathfinding) console.log("[NPCs/Pathfinding] Direct path found via BFS");
      return this.finalizePath(startPos, endPos, directPath);
    }

    // Fallback to A* with retries
    for (let attempt = 0; attempt < this.maxPathGenerationAttempts; attempt++) {
      const path = this.findPathAStar(
        startWaypoint.index,
        endWaypoint.index,
        adjacencyList,
        waypoints,
        { debugPathfinding, attempt }
      );
      
      if (path) {
        if (debugPathfinding) {
          console.log("[NPCs/Pathfinding] Path found via A* (attempt " + (attempt + 1) + ")", {
            length: path.length,
            waypoints: path.map(p => p.toArray())
          });
        }
        return this.finalizePath(startPos, endPos, path);
      }
    }

    if (debugErrors) console.error("[NPCs/Errors] All pathfinding attempts failed");
    return null;
  }

  findDirectPath(startIndex, endIndex, adjacencyList, waypoints, { debugPathfinding = false } = {}) {
    if (debugPathfinding) console.log("[NPCs/Pathfinding] Starting BFS search");
    
    const visited = new Set([startIndex]);
    const queue = [[startIndex]];
    
    while (queue.length > 0) {
      const currentPath = queue.shift();
      const currentNode = currentPath[currentPath.length - 1];
      
      if (currentNode === endIndex) {
        if (debugPathfinding) console.log("[NPCs/Pathfinding] BFS found path length:", currentPath.length);
        return currentPath.map(index => waypoints[index].clone());
      }
      
      for (const neighbor of adjacencyList.get(currentNode)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...currentPath, neighbor]);
        }
      }
    }
    
    if (debugPathfinding) console.log("[NPCs/Pathfinding] No direct BFS path found");
    return null;
  }

  findPathAStar(startIndex, endIndex, adjacencyList, waypoints, { debugPathfinding = false, attempt = 0 } = {}) {
    if (debugPathfinding) console.log(`[NPCs/Pathfinding] A* attempt ${attempt + 1}`);
    
    const openSet = new Set([startIndex]);
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    // Initialize scores
    waypoints.forEach((_, index) => {
      gScore.set(index, Infinity);
      fScore.set(index, Infinity);
    });

    gScore.set(startIndex, 0);
    fScore.set(startIndex, this.heuristic(waypoints[startIndex], waypoints[endIndex]));

    while (openSet.size > 0) {
      const current = this.getLowestFScore(openSet, fScore);

      if (current === endIndex) {
        if (debugPathfinding) console.log("[NPCs/Pathfinding] A* found path");
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
            this.heuristic(waypoints[neighbor], waypoints[endIndex]));

          if (!openSet.has(neighbor)) {
            openSet.add(neighbor);
          }
        }
      }
    }

    if (debugPathfinding) console.log("[NPCs/Pathfinding] A* failed this attempt");
    return null;
  }

  // Helper methods
  finalizePath(startPos, endPos, path) {
    if (path.length === 0) return [];
    if (path.length === 1) return [path[0].clone()];
    
    return [
      this.projectPositionToPath(startPos, path[0], path[1]),
      ...path.slice(1, -1),
      this.projectPositionToPath(endPos, path[path.length-1], path[path.length-2])
    ];
  }

  projectPositionToPath(position, pathPoint1, pathPoint2) {
    const line = new THREE.Line3(pathPoint1, pathPoint2);
    const projected = new THREE.Vector3();
    line.closestPointToPoint(position, true, projected);
    return projected;
  }

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

    for (const index of openSet) {
      const score = fScore.get(index);
      if (score < lowestScore) {
        lowestScore = score;
        lowest = index;
      }
    }

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

  // Debug visualization
  createDebugScene(zone = this.defaultZone) {
    const zoneData = this.zones[zone];
    if (!zoneData) return null;

    const { waypoints, adjacencyList } = zoneData;
    const group = new THREE.Group();
    
    // Add waypoint markers
    waypoints.forEach((pos, index) => {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
      );
      sphere.position.copy(pos);
      group.add(sphere);
    });
    
    // Add connections
    adjacencyList.forEach((neighbors, index) => {
      const origin = waypoints[index];
      neighbors.forEach(neighborIndex => {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          origin,
          waypoints[neighborIndex]
        ]);
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