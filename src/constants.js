export const TOOL_ITEM ={
    LINE : "LINE",
    RECTANGLE : "RECTANGLE",
    CIRCLE : "CIRCLE",
    ARROW : "ARROW",
    BRUSH : "BRUSH",
    ERASER:"ERASER",
    TEXT:"TEXT"
}

export const TOOL_ACTION_TYPES ={
    NONE : "NONE",
    DRAWING : "DRAWING",
    ERASING : "ERASING",
    WRITING : "WRITING",
}

export const BOARD_ACTION ={
    CHANGE_TOOL : "CHANGE_TOOL",
    DRAW_DOWN: "DRAW_DOWN",
    DRAW_UP : "DRAW_UP",
    DRAW_MOVE: "DRAW_MOVE",
    ERASE : "ERASE",
    CHANGE_ACTION_TYPE : "CHANGE_ACTION_TYPE",
    CHANGE_TEXT : "CHANGE_TEXT",
    UNDO : "UNDO",
    REDO : "REDO",
}

export const ARROW_LENGTH = 20;
export const ELEMENT_ERASE_THRESHOLD=0.1;

export const COLORS = {
    BLACK: "#000000",
    RED : "	#ff0000",
    GREEN : "	#00FF00",
    BLUE : "#0000ff",
    ORANGE : "#FFA500",
    YELLOW : "#FFFF00",
    WHITE : "#ffffff",
}


export const TOOL_BOX_ACTIONS = {
    CHANGE_STROKE :"CHANGE_STROKE",
    CHANGE_FILL :"CHANGE_FILL",
    CHANGE_SIZE :"CHANGE_SIZE",
}

export const FILL_TOOL_TYPES=[TOOL_ITEM.RECTANGLE,TOOL_ITEM.CIRCLE];

export const STROKE_TOOL_TYPES=[TOOL_ITEM.RECTANGLE,TOOL_ITEM.CIRCLE,TOOL_ITEM.LINE,TOOL_ITEM.ARROW,TOOL_ITEM.BRUSH,TOOL_ITEM.TEXT];

export const SIZE_TOOL_TYPES=[TOOL_ITEM.RECTANGLE,TOOL_ITEM.CIRCLE,TOOL_ITEM.LINE,TOOL_ITEM.ARROW,TOOL_ITEM.TEXT];