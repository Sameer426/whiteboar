import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import rough from "roughjs"
import BoardContext from "../../store/board-context";
import { TOOL_ACTION_TYPES, TOOL_ITEM } from "../../constants";
import toolBoxContext from "../../store/toolbox-context";
import classes from "./index.module.css"

function Board() {
  const canvasRef=useRef();    
  const textAreaRef=useRef();
  const { elements ,toolActionType,undo , redo ,boardMouseDownHandler ,boardMouseMoveHandler , boardMouseUpHandler,textAreaBlurHandler} =useContext(BoardContext);
  const {toolboxState} = useContext(toolBoxContext)

  useEffect(()=>{
    const canvas = canvasRef.current;     
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
  },[])

  useEffect(()=>{
    function handleKeyDown(event){
      if(event.ctrlKey && event.key==="z"){
        undo();
      }else if(event.ctrlKey && event.key==="y"){
        redo();
      }
    }
    document.addEventListener("keydown" , handleKeyDown);

    return()=>{
      document.removeEventListener("keydown",handleKeyDown);
    }
  },[undo,redo])

  useLayoutEffect(()=>{
    const canvas = canvasRef.current;    
    const context=canvas.getContext("2d");
    context.save();
    const roughCanvas=rough.canvas(canvas);
    elements.forEach((element)=>{
      switch (element.type) {
        case TOOL_ITEM.LINE:
        case TOOL_ITEM.RECTANGLE:
        case TOOL_ITEM.CIRCLE:
        case TOOL_ITEM.ARROW:
          roughCanvas.draw(element.roughEle);
          break;
        case TOOL_ITEM.BRUSH:
          context.fillStyle=element.stroke;
          context.fill(element.path);
          context.restore();
          break;
        case TOOL_ITEM.TEXT:
          context.textBaseline = "top";
          context.font = `${element.size}px Caveat`;
          context.fillStyle = element.stroke;
          context.fillText(element.text,element.x1,element.y1);
          context.restore();
          break;
        default:
          throw new Error("Type not recognized");
      }
    })

    return ()=>{
      context.clearRect(0,0,canvas.width,canvas.height);
    }
  },[elements])

  useEffect(()=>{
    const textArea=textAreaRef.current;
    if(toolActionType===TOOL_ACTION_TYPES.WRITING){
      setTimeout(() => {
        textArea.focus();
      }, 0);
    }
  },[toolActionType])


  const handleMouseDown = (event) => {
    boardMouseDownHandler(event,toolboxState);
  }

  const handleMouseMove = (event) => {
    boardMouseMoveHandler(event);
  }

  const handleMouseUp = () => {
    boardMouseUpHandler();
  }

  return (
    <>
      { toolActionType===TOOL_ACTION_TYPES.WRITING && 
      <textarea type="text" 
       ref={textAreaRef}
       className={classes.textElementBox}
       style={{
        top: elements[elements.length-1].y1,
        left: elements[elements.length-1].x1,
        fontSize: `${elements[elements.length-1]?.size}px`,
        color: elements[elements.length-1]?.stroke,
       }}
       onBlur={(event)=>textAreaBlurHandler(event.target.value)}
      />}
      <canvas 
      ref={canvasRef} 
      id="canvas" 
      onMouseDown={handleMouseDown} 
      onMouseMove={handleMouseMove} 
      onMouseUp={handleMouseUp} 
      />
    </>
  );
}

export default Board;