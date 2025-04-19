import * as THREE from "three";

export class PathfindingLogic {
  constructor() {
    this.epsilon = 0.0001;
    this.zones = {};
    this.defaultZone = 'default';
    this.maxPathGenerationAttempts = 100;
  }

  // Load and process the Blender JSON
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
      
      //console.log(`Waypoint graph loaded for zone ${zone}:`, waypoints.length, "waypoints");
      return true;
      
    } catch (error) {
      console.error("Error loading waypoint graph:", error);
      return false;
    }
  }

  // Improved findPath method
  findPath(startPos, endPos, zone = this.defaultZone) {
    const zoneData = this.zones[zone];
    if (!zoneData) {
      console.error(`Zone ${zone} not found`);
      return null;
    }

    const { waypoints, adjacencyList } = zoneData;
    
    // Find the initial waypoints
    const startWaypoint = this.findNearestWaypoint(startPos, waypoints);
    const endWaypoint = this.findNearestWaypoint(endPos, waypoints);
    
    if (startWaypoint === null || endWaypoint === null) {
      console.error('Could not find start/end waypoints');
      return null;
    }
    
    // If start and end waypoints are the same, but the positions are different,
    // we need to handle this special case
    if (startWaypoint.index === endWaypoint.index) {
      //console.log('Start and end waypoints are the same');
      // Return a path with just the waypoint
      const waypointPosition = waypoints[startWaypoint.index].clone();
      return [waypointPosition];
    }
    
    // Check first if there's a direct path using breadth-first search
    let directPath = this.findDirectPath(startWaypoint.index, endWaypoint.index, adjacencyList, waypoints);
    if (directPath && directPath.length > 1) {
      //console.log('Direct path found using BFS');
      // Add projected start/end positions
      const finalPath = [
        this.projectPositionToPath(startPos, directPath[0], directPath[1]), 
        ...directPath.slice(1, -1),
        this.projectPositionToPath(endPos, directPath[directPath.length-1], directPath[directPath.length-2])
      ];
      return finalPath;
    }
    
    // If direct path failed, try A* with multiple attempts
    for (let attempt = 0; attempt < this.maxPathGenerationAttempts; attempt++) {
      // For retries, try alternative nearby waypoints
      const alternativeStartWaypoint = attempt > 0 ? 
        this.findAlternativeWaypoint(startWaypoint, adjacencyList, waypoints, attempt) : 
        startWaypoint;
        
      const alternativeEndWaypoint = attempt > 0 ? 
        this.findAlternativeWaypoint(endWaypoint, adjacencyList, waypoints, attempt) : 
        endWaypoint;
      
      if (alternativeStartWaypoint === null || alternativeEndWaypoint === null) {
        continue;
      }
      
      // A* implementation
      const path = this.findPathAStar(
        alternativeStartWaypoint.index, 
        alternativeEndWaypoint.index, 
        adjacencyList, 
        waypoints
      );
      
      if (path && path.length > 1) {
        // Add projected start/end positions to stay on the mesh
        const finalPath = [
          this.projectPositionToPath(startPos, path[0], path[1]),
          ...path.slice(1, -1),
          this.projectPositionToPath(endPos, path[path.length-1], path[path.length-2])
        ];
        
        console.log('Path generated successfully', {
          from: startPos,
          to: endPos,
          length: finalPath.length,
          attempt: attempt + 1
        });
        
        return finalPath;
      }
      
      console.warn(`Path generation attempt ${attempt + 1} failed`);
    }
    
    console.error('Failed to generate a valid path after multiple attempts');
    return null;
  }
  
  // Find a direct path using breadth-first search
  findDirectPath(startIndex, endIndex, adjacencyList, waypoints) {
    const visited = new Set([startIndex]);
    const queue = [[startIndex]]; // Queue of paths (not just nodes)
    
    while (queue.length > 0) {
      const currentPath = queue.shift();
      const currentNode = currentPath[currentPath.length - 1];
      
      if (currentNode === endIndex) {
        // We found the target, convert indices to positions
        return currentPath.map(index => waypoints[index].clone());
      }
      
      // Explore neighbors
      for (const neighbor of adjacencyList.get(currentNode)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          // Create a new path with the neighbor appended
          const newPath = [...currentPath, neighbor];
          queue.push(newPath);
        }
      }
    }
    
    return null; // No path found
  }
  
  // Find alternative waypoints for retry attempts
  findAlternativeWaypoint(originalWaypoint, adjacencyList, waypoints, attempt) {
    // Start with the original waypoint
    let currentIndex = originalWaypoint.index;
    
    // Determine how many steps to take (based on attempt number)
    const steps = Math.min(5, Math.floor(attempt / 10) + 1);
    
    // Walk a random path from the original waypoint
    for (let i = 0; i < steps; i++) {
      const neighbors = Array.from(adjacencyList.get(currentIndex));
      if (neighbors.length === 0) break;
      
      // Pick a random neighbor
      const nextIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
      currentIndex = nextIndex;
    }
    
    return {
      index: currentIndex,
      position: waypoints[currentIndex]
    };
  }
  
  // Project a position onto the path defined by two waypoints
  projectPositionToPath(position, pathPoint1, pathPoint2) {
    // Create a line segment defined by the two path points
    const line = new THREE.Line3(pathPoint1, pathPoint2);
    
    // Project the position onto this line segment
    const projected = new THREE.Vector3();
    line.closestPointToPoint(position, true, projected);
    
    return projected;
  }
  
  // A* implementation for finding paths
  findPathAStar(startIndex, endIndex, adjacencyList, waypoints) {
    const openSet = new Set([startIndex]);
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    // Initialize scores
    for (let i = 0; i < waypoints.length; i++) {
      gScore.set(i, Infinity);
      fScore.set(i, Infinity);
    }

    gScore.set(startIndex, 0);
    fScore.set(startIndex, this.heuristic(waypoints[startIndex], waypoints[endIndex]));

    while (openSet.size > 0) {
      const current = this.getLowestFScore(openSet, fScore);

      if (current === endIndex) {
        // Path found, reconstruct it
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

    return null; // No path found
  }

  // Standard A* heuristic
  heuristic(a, b) {
    return a.distanceTo(b);
  }

  // Find nearest waypoint to a position
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

  // Get node with lowest f-score from open set
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

  // Reconstruct path from A* results
  reconstructPath(cameFrom, current, waypoints) {
    const path = [waypoints[current].clone()];
    while (cameFrom.has(current)) {
      current = cameFrom.get(current);
      path.unshift(waypoints[current].clone());
    }
    return path;
  }

  // Visualization helper
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
      
      // Identify waypoints with only one connection
      const connections = adjacencyList.get(index).size;
      if (connections <= 1) {
        sphere.material.color.set(0x0000ff); // Blue for endpoints
      }
      
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