import React, { useEffect, useRef, useState } from "react";

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [ctx,setCtx] = useState(null) 
  const [drawing,setDrawing] = useState(false)

  useEffect(()=>{
    const canvas = canvasRef.current;
    setCtx(canvas.getContext("2d"))
  },[ctx])
  
  const handleMouseDown = (event) => {
    // setPoints([...points, event.clientX, event.clientY]);
    !drawing ? setDrawing(true): setDrawing(false);
    if(drawing){
        ctx.beginPath();
        ctx.moveTo(event.clientX, event.clientY);
    }else{
        ctx.closePath();
        ctx.stroke();
        setCtx(null)
    }
  };

  const handleMouseMove = (event) => {
    // setPoints([...points, event.clientX, event.clientY]);
    if(drawing){
        ctx.lineTo(event.clientX, event.clientY);
        ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    // setPoints([]);
    ctx.closePath();
    ctx.stroke();
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        id="canvas"
        width="500"
        height="500"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      ></canvas>
    </div>
  );
};

export default Whiteboard;
