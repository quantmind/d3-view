import model from './model';
import attr from './attr';
import html from './html';
import value from './value';
import on from './on';
import d3For from './for';
import d3If from './if';

export default {
    model,
    attr,
    html,
    value,
    on,
    'for': d3For,
    'if': d3If
};
