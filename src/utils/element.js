import { ARROW_LENGTH, TOOL_ITEM } from "../constants";
import rough from "roughjs/bin/rough"
import { getArrowHeadsCoordinates, isPointCloseToLine } from "./math";
import getStroke from "perfect-freehand";

const gen = rough.generator();

export const createElement = (id ,x1 ,y1 ,x2 ,y2 , { type , stroke , fill ,size } ) =>{

    const element ={
        id,
        x1,
        y1,
        x2,
        y2,
        type,
        fill,
        stroke,
        size,
    }

    let options = {
        seed : id + 1,
        fillStyle : "solid",
    }

    if(stroke){
        options.stroke=stroke;
    }
    if(fill){
        options.fill=fill;
    }
    if(size){
        options.strokeWidth = size;
    }

    switch (type) {
        case TOOL_ITEM.BRUSH:{
            const brushElement={
                id,
                points : [{x:x1,y:y1}],
                path : new Path2D(getSvgPathFromStroke(getStroke( [{x:x1,y:y1}] ))),
                type,
                stroke, 
            }

            return brushElement;
        }

        case TOOL_ITEM.LINE:
            element.roughEle = gen.line(x1,y1,x2,y2,options);
            return element;
        
        case TOOL_ITEM.RECTANGLE:
            element.roughEle = gen.rectangle(x1,y1,x2-x1,y2-y1,options);
            return element;

        case TOOL_ITEM.CIRCLE:
            element.roughEle = gen.ellipse((x1+x2)/2,(y1+y2)/2,x2-x1,y2-y1,options)
            return element;

        case TOOL_ITEM.ARROW:
            const {x3,y3,x4,y4}=getArrowHeadsCoordinates(x1,y1,x2,y2,ARROW_LENGTH);
            const points = [[x1,y1] , [x2,y2] , [x3,y3] , [x2,y2] , [x4,y4]];
            element.roughEle=gen.linearPath(points,options)
            return element;
        
        case TOOL_ITEM.TEXT:
            element.text = "";
            return element;
        default:
            throw new Error("Tool Type not recognised");
    }
}


export const isPointNearElement = (element, pointX, pointY) => {
    const { x1, y1, x2, y2, type } = element;
    const context = document.getElementById("canvas").getContext("2d");
    switch (type) {
      case TOOL_ITEM.LINE:
      case TOOL_ITEM.ARROW:
        return isPointCloseToLine(x1, y1, x2, y2, pointX, pointY);
      case TOOL_ITEM.RECTANGLE:
      case TOOL_ITEM.CIRCLE:
        return (
          isPointCloseToLine(x1, y1, x2, y1, pointX, pointY) ||
          isPointCloseToLine(x2, y1, x2, y2, pointX, pointY) ||
          isPointCloseToLine(x2, y2, x1, y2, pointX, pointY) ||
          isPointCloseToLine(x1, y2, x1, y1, pointX, pointY)
        );
      case TOOL_ITEM.BRUSH:
        return context.isPointInPath(element.path, pointX, pointY);
      case TOOL_ITEM.TEXT:
        context.font=`${element.size}px Caveat`;
        context.fillStyle=element.stroke;
        const textWidth=context.measureText(element.text).width;
        const textHeight=parseInt(element.size);
        context.restore();
        return(
            isPointCloseToLine(x1,y1,x1+textWidth,y1,pointX,pointY) || 
            isPointCloseToLine(x1+textWidth,y1,x1+textWidth,y1+textHeight,pointX,pointY) ||
            isPointCloseToLine(x1+textWidth,y1+textHeight,x1,y1+textHeight,pointX,pointY) || 
            isPointCloseToLine(x1,y1+textHeight,x1,y1,pointX,pointY)
        );
      default:
        throw new Error("Type not recognized");
    }
  };



export const getSvgPathFromStroke = (stroke) =>{
    if(!stroke.length) return "";

    const d=stroke.reduce(
        (acc, [x0,y0], i , arr) =>{
            const [x1,y1] = arr[(i+1)%arr.length];
            acc.push(x0,y0,(x0+x1)/2 , (y0+y1)/2);
            return acc;
        },
        ["M",...stroke[0],"Q"]
    );

    d.push("Z");
    return d.join(" ");
};