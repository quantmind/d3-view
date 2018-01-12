import {dispatch} from 'd3-dispatch';


export default dispatch(
    'message',
    'component-created',
    'component-mount',
    'component-children-mounted',
    'component-mounted',
    'component-destroy',
    'directive-refresh'
);
