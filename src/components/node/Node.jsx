import './Node.scss';

export default function Node({isStart, isEnd,col,row, isWall}) {
  const classes = isStart ? 'node-start' : isWall ? 'iswall' : isEnd? 'node-end' : '';

  return (
    <div className={`node ${classes}`} id={`node-${row}-${col}`}>
      
    </div>
  )
}
