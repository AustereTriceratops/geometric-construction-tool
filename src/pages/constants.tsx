export const ADD = 'add point';
export const STRAIGHTEDGE = 'straightedge';
export const COMPASS = 'compass';
export const ERASE = 'erase';
export type InputMode = 'add point' | 'straightedge' | 'compass' | 'erase';

export const NO_SEL = 'no_sel';
export const ONE_SEL = 'one_sel';
export const READY = 'ready';
export type SecondaryInputStep = 'no_sel' | 'one_sel' | 'ready';

export const COLORS = {
    BACKGROUND: '#e9d6bd',
    OBJECT_HIGHLIGHT: "#888",
    BUTTON: '#bbbbbb',
    BUTTON_SELECTED: "#626a72",
    TRANSPARENT: "#ffffff00",
    TEXT: '#555',

    BORDER: "#99b8ff",
    DEBUG: '#4a82bb',
    GREEN: '#7fa629',
    BLUE: '#6db4ff',
    YELLOW: '#ebc958'
}