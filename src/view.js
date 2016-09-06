import {version} from '../package.json';
import {View, Component} from './component';
import {htmlElement} from './html';
import {domReady} from './utils';
import {model} from './model';
import Directive from './directive';

//
//  d3-view
export function view (options) {
    return new View(options);
}

view.prototype = View.prototype;

// Global API
view.Component = Component;
view.Directive = Directive;
view.version = version;
view.directives = View.directives;
view.components = View.components;
view.providers = View.providers;
view.model = model;
view.htmlElement = htmlElement;
view.domReady = domReady;
