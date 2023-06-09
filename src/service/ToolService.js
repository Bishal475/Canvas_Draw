import rough from "roughjs/bundled/rough.esm";
import { elementType, actionType, positionType } from "../service/TypeDef";
import { getStroke } from "perfect-freehand";

const generator = rough.generator();

export const createElement = (id, x1, y1, x2, y2, type) => {
  switch (type) {
    case elementType.line:
      const roughElementForLine = generator.line(x1, y1, x2, y2, {});

      return { id, x1, y1, x2, y2, roughElement: roughElementForLine, type };
    case elementType.rectangle:
      const roughElementForRectangle = generator.rectangle(
        x1,
        y1,
        x2 - x1,
        y2 - y1,
        {}
      );
      return {
        id,
        x1,
        y1,
        x2,
        y2,
        roughElement: roughElementForRectangle,
        type,
      };

    case elementType.circle:
      const roughElementForCircle = generator.circle(
        x1,
        y1,
        2 * Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
        {}
      );
      return { id, x1, y1, x2, y2, roughElement: roughElementForCircle, type };

    case elementType.ellipse:
      const roughElementForEllipse = generator.ellipse(
        x1,
        y1,
        2.8 * Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
        Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
        {}
      );
      return { id, x1, y1, x2, y2, roughElement: roughElementForEllipse, type };
    case elementType.pencil:
      return { id, type, points: [{ x: x1, y: y1 }] };
    case elementType.marker:
      return { id, type, points: [{ x: x1, y: y1 }] };
    case elementType.text:
      return { id, type, x1, y1, x2, y2, text: "" };
    case elementType.arrow:
        return {id, type, x1,y1,x2,y2}
    default:
      throw new Error(`Type not recognised : ${type}`);
  }
};

export const nearPoint = (x, y, x1, y1, name) => {
  const offset = 10;
  return Math.abs(x - x1) < offset && Math.abs(y - y1) < offset ? name : null;
};
export function distance(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
export function onLine(x1, y1, x2, y2, x, y, distanceOffset = 1) {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x: x, y: y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  const insideLine =
    Math.abs(offset) < distanceOffset ? positionType.inside : null;
  return insideLine;
}

export function getSvgPathFromStroke(stroke) {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
}

export const drawElement = (roughCanvas, context, element, text, color) => {
  // console.log("Draw Ele : ",element)
  switch (element.type) {
    case elementType.line:
    case elementType.rectangle:
      roughCanvas.draw(element.roughElement);
      break;
    case elementType.pencil:
      const stroke = getStroke(element.points, {
        size: 10,
      });
      const pathData = getSvgPathFromStroke(stroke);
      const myPath = new Path2D(pathData);
      context.fillStyle = color;
      // console.log("con : ",context)
      context.fill(myPath);
      break;

    case elementType.marker:
      const strok = getStroke(element.points, {
        size: 20,
      });
      const pathdata = getSvgPathFromStroke(strok);
      const myath = new Path2D(pathdata);
      context.fill(myath);
      break;

    case elementType.text:
      context.textBaseline = "center";
      context.font = "24px sans-serif";
      context.fillText(element.text, element.x1, element.y1);
      break;
    case elementType.circle:
      roughCanvas.draw(element.roughElement);
      break;

    case elementType.ellipse:
      roughCanvas.draw(element.roughElement);
      break;
    case elementType.arrow:
      drawArrow(
        context,
        element.x1,
        element.y1,
        element.x2,
        element.y2,
        3,
        "red"
      );
      break;
    default:
      throw new Error(`Type not recognised : ${element.type}`);
  }
};

export function drawArrow(ctx, fromx, fromy, tox, toy, arrowWidth, color) {
  //variables to be used when creating the arrow
  var headlen = 10;
  var angle = Math.atan2(toy - fromy, tox - fromx);

  ctx.save();
  ctx.strokeStyle = color;

  //starting path of the arrow from the start square to the end square
  //and drawing the stroke
  ctx.beginPath();
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.lineWidth = arrowWidth;
  ctx.stroke();

  //starting a new path from the head of the arrow to one of the sides of
  //the point
  ctx.beginPath();
  ctx.moveTo(tox, toy);
  ctx.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 7),
    toy - headlen * Math.sin(angle - Math.PI / 7)
  );

  //path from the side point of the arrow, to the other side point
  ctx.lineTo(
    tox - headlen * Math.cos(angle + Math.PI / 7),
    toy - headlen * Math.sin(angle + Math.PI / 7)
  );

  //path from the side point back to the tip of the arrow, and then
  //again to the opposite side point
  ctx.lineTo(tox, toy);
  ctx.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 7),
    toy - headlen * Math.sin(angle - Math.PI / 7)
  );

  //draws the paths created above
  ctx.stroke();
  ctx.restore();
}
