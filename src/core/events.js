import {dispatch} from 'd3-dispatch';


export default dispatch(
    'message',
    'component-created',
    'component-mount',
    'component-mounted',
    'component-error',
    'directive-refresh'
);
