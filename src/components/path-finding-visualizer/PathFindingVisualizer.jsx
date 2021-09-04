import './PathFindingVisualizer.scss';
import Astar from '../../Algorithims/Astar/Astar.jsx';
import Node from '../node/Node.jsx';
import { useState, useEffect } from 'react';

const cols = 25;
const rows = 10;

const NODE_START_ROW = 0;
const NODE_START_COL = 0;
const NODE_END_ROW = rows -1;
const NODE_END_COL = cols-1;

export default function PathFindingVisualizer() {
  const [Grid, setGrid] = useState([]); 
  const [Path, setPath]= useState([]);
  const [VisitedNodes , setVisitedNodes] = useState([]);

  useEffect(() =>{
    initGrid();
  },[])

  // Create Grid
  const initGrid = ()=>{
    const grid = new Array(rows);

    for (let i=0; i < grid.length; i++){
      grid[i] = new Array(cols);
    }

    createSpot(grid);
    setGrid(grid);
    addNeighbours(grid);

    const startNode = grid[NODE_START_ROW][NODE_START_COL];
    const endNode = grid[NODE_END_ROW][NODE_END_COL];
    let path = Astar(startNode, endNode);
    startNode.isWall = false;
    endNode.isWall = false;
    setPath(path.path);
    setVisitedNodes(path.visitedNodes);
  }

  //Create spot in the grid
  const createSpot =(grid)=>{
      for (let i=0; i < rows; i++){
        for (let j=0; j < cols; j++){
          grid[i][j] = new Spot(i,j);
        }
      }
    }

  //add neighbours
  const addNeighbours =(grid)=>{
    for (let i=0; i < rows; i++){
      for (let j=0; j < cols; j++){
        grid[i][j].addneighbours(grid);
      }
    }
  }

  function Spot(i,j){
    this.x = i;
    this.y = j;
    this.isStart = this.x === NODE_START_ROW && this.y === NODE_START_COL;
    this.isEnd = this.x === NODE_END_ROW && this.y === NODE_END_COL;
    this.g = 0;
    this.f = 0;
    this.h = 0;
    this.neighbours = [];
    this.isWall = false;
    if(Math.random(1) < 0.2){
      this.isWall = true;
    }
    this.previous = undefined;
    this.addneighbours = function(grid){
      let i = this.x;
      let j = this.y;
      if (i > 0) this.neighbours.push(grid[i-1][j]);
      if (i < rows - 1) this.neighbours.push(grid[i+1][j]);
      if (j > 0) this.neighbours.push(grid[i][j-1])
      if (j < cols - 1) this.neighbours.push(grid[i][j+1])
    }

  }

  const gridWithNodes = (
    <div>
      {Grid.map((rows, rowIndex) => {
        return (  
          <div key={rowIndex} className='row-wrap'>
            {rows.map((col, colIndex)=>{
              const {isStart, isEnd, isWall} = col;
              return (
                <Node key={colIndex} isStart={isStart} isEnd={isEnd} 
                      col={colIndex} row={rowIndex} isWall={isWall}/>
              )
            })}
          </div>
        )
      })}
    </div>
  )
  
  const visualizeShortestPath = (shortestPathNode) =>{
    for (let i = 0; i < shortestPathNode.length; i++){
      setTimeout(()=>{
        const node = shortestPathNode[i];
        document.getElementById(`node-${node.x}-${node.y}`).className = "node node-shortest-path"
      }, 10*i)
    }
  }

  const visualizePath = () =>{
    for (let i = 0; i <= VisitedNodes.length; i++){
      if(i === VisitedNodes.length){
        setTimeout(()=>{
          visualizeShortestPath(Path);
        }, 20*i)
      }
      else{
        setTimeout(()=>{
          const node = VisitedNodes[i];
          document.getElementById(`node-${node.x}-${node.y}`).className = "node node-visited"
        }, 20*i)
      }
    }
  };

  console.log(Path);
  return (
    <div className="path-finding-visualizer" id="path-finding-visualizer">
      <div className="path-container">
        <h1>Path Finder</h1>
        <div className="controls">
          <p>Use the visualize button to find the shortest path out of the maze, when done add refresh the page to create a new maze</p>
          <button onClick={visualizePath}>Visualise Path</button>
        </div>
        {gridWithNodes}
      </div>
    </div>
  )
}
