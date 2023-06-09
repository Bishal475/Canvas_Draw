import { useRef, useState, useEffect, useLayoutEffect } from "react";
import rough from "roughjs/bundled/rough.esm";
import { elementType, actionType } from "../service/TypeDef";
import { createElement, drawElement } from "../service/ToolService";

const useHistory = (initialState) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (action, override = false) => {
    // action could be a 1)current state or 2)function
    // 1) setState(items) 2) setState(prevState => prevState)
    const newState =
      typeof action === "function" ? action(history[index]) : action;
    if (override) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].splice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex((prevState) => prevState + 1);
    }
  };

  //   const undo = () => index > 0 && setIndex((prevState) => prevState - 1);
  //   const redo = () =>
  //     index < history.length - 1 && setIndex((prevState) => prevState + 1);

  return [history[index], setState];
};

const BoardComponent = (props) => {
  const [elements, setElements] = useHistory([]);
  const [action, setAction] = useState("none");
  //   const [tool, setTool] = useState(elementType.rectangle);
  const [selectedElement, setSelectedElement] = useState(null);

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);
    elements.forEach((element) => {
      //   if (action === actionType.writing && isTextSelected) return;
      drawElement(roughCanvas, context, element);
    });
  }, [elements, action]);

  const handleMouseDown = (event) => {
    // console.log(props,elementType.pencil,props.tool===elementType.pencil)
    const clientX = event.clientX;
    const clientY = event.clientY;
    if (
      props.tool === elementType.pencil ||
      props.tool === elementType.line ||
      props.tool === elementType.rectangle ||
      props.tool === elementType.text ||
      props.tool === elementType.marker ||
      props.tool === elementType.circle ||
      props.tool === elementType.ellipse ||
      props.tool === elementType.arrow
    ) {
      const id = elements.length;
      // console.log("TollBox : ", id, clientX, clientY, clientX, clientY, tool);
      // First entry will be like element at its place...like a dot
      const element = createElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        props.tool
      );
      setElements((prevState) => [...prevState, element]);
      setAction(
        props.tool === elementType.text
          ? actionType.writing
          : actionType.drawing
      );
      setSelectedElement(element);
    }
  };
  const handleMouseUp = (event) => {
    // console.log("X = ",event.clientX,":::: Y = ",event.clientY)
    setAction("none");
    setSelectedElement(null);
  };
  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    // let xofsets;
    // let yofsets;
    if (action !== "none") {
      if (action === actionType.drawing) {
        // console.log(elesments)
        const index = elements.length - 1;
        const { x1, y1, type } = elements[index];
        updateElement(index, x1, y1, clientX, clientY, type, {});
      }

      //   if (selectedElement.type === elementType.marker || selectedElement.type === elementType.pencil) {
      //    const xofsets = selectedElement.points.map((point) => clientX - point.x);
      //    const yofsets = selectedElement.points.map((point) => clientY - point.y);
      //     setSelectedElement({ ...selectedElement, xofsets, yofsets });
      //   }

      //   console.log(action);
      //   console.log(selectedElement);
      if (
        selectedElement.type === elementType.marker ||
        selectedElement.type === elementType.pencil
      ) {
        const newpoints = selectedElement.points.map((_, index) => {
          return {
            x: clientX - selectedElement.xofsets[index],
            y: clientY - selectedElement.yofsets[index],
          };
        });
        const elementsCopy = [...elements];
        elementsCopy[selectedElement.id] = {
          ...elementsCopy[selectedElement.id],
          points: newpoints,
        };
        setElements(elementsCopy, true);
      } else {
        console.log("SL", selectedElement);
        const { id, x1, y1, type } = selectedElement;
        const options =
          type === elementType.text ? { text: selectedElement.text } : {};
        updateElement(id, x1, y1, clientX, clientY, type, options);
      }
    }
  };

  const updateElement = (id, x1, y1, x2, y2, type, options) => {
    const elementsCopy = [...elements];
    console.log(elementsCopy[id]);
    switch (type) {
      case elementType.line:
      case elementType.circle:
      case elementType.arrow:
      case elementType.rectangle:
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
        break;
      case elementType.ellipse:
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
        break;
      case elementType.pencil:
        elementsCopy[id].points = [
          ...elementsCopy[id].points,
          { x: x2, y: y2 },
        ];
        break;
      case elementType.marker:
        elementsCopy[id].points = [
          ...elementsCopy[id].points,
          { x: x2, y: y2 },
        ];
        break;
      case elementType.text:
        const textWidth = document
          .getElementById("canvas")
          .getContext("2d")
          .measureText(options.text).width;
        const textHeight = 24;
        elementsCopy[id] = {
          ...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type),
          text: options.text,
        };
        break;
      default:
        throw new Error(`Type not recognized ${type}`);
    }

    setElements(elementsCopy, true);
  };

  return (
    <canvas
      id="canvas"
      width="500"
      height="500"
      className="col"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    ></canvas>
  );
};

export default BoardComponent;
