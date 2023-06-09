import { useEffect, useState } from "react";

const ToolComponent = (props) => {
  const [tool, setTool] = useState("");

useEffect(()=>{
    props.toolSelected(tool)
})

  const tools = {
    pen: "Pencil",
    marker: "Marker",
    rect: "Rectangle",
    text: "Text",
    oval: "Ecllipse",
    line: "Line",
    poly: "Polygon",
    arrow: "Arrow"
  };

  const polygons = ["Trangle", "Quadilateral", "Pentagon", "Hexagon"];

  const handleToolClick = (event) => {
    console.log(event.target.value);
    setTool(event.target.value)
  };
  return (
    <div className="col-2">
      {Object.keys(tools).map((e) => {
        return e !== "poly" ? (
          <div className="row" key={e}>
            <div className="col-2">
              <input
                type="radio"
                value={e}
                name="tool"
                onClick={handleToolClick}
              ></input>
            </div>
            <div className="col">{tools[e]}</div>
            <hr />
          </div>
        ) : (
          <div>
            <div className="row" key={e}>
              <div className="col-2">
                <input type="radio" value={e} name="tool"></input>
              </div>
              <div className="col">{tools[e]}</div>
            </div>
            <div className="row">
              <div className="col">
                <select onClick={handleToolClick}>
                  {polygons.map((x) => {
                    return <option value={x}>{x}</option>;
                  })}
                </select>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToolComponent;
