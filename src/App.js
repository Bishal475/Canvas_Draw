
import { useState } from 'react';
import './App.css';
import BoardComponent from './component/BoardComponent';
import ToolComponent from './component/ToolComponent';

function App() {
  const [tool, setTool] = useState(null)
  const getSelectedTool = (tool) => {
    console.log("Parent : ",tool)
    setTool(tool)
  }
  return (
    <div className='row'>
   <ToolComponent toolSelected={getSelectedTool}/>
   <BoardComponent tool = {tool}/>
    {/* <Whiteboard /> */}
   </div>
  );
}

export default App;
