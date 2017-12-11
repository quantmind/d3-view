import {map} from 'd3-collection';

import promise from '../promise';


export default {
    '/test': (o) => {
        if (!o || o.method === 'get')
            return asText('<p>This is a test</p>');
        else
            return notFound();
    },
    '/fake/test': (o) => {
        if (!o || o.method === 'get')
            return asText('<p>This is a test</p>');
        else
            return notFound();
    },
    '/submitTest': (o) => {
        if (o.method === 'post')
            return asJson(o, {success: true});
        else
            return notFound();
    },
    '/sidebar': (o) => {
        if (!o || o.method === 'get')
            return asText(sidebar);
        else
            return notFound();
    },
};


function notFound () {
    return {
        status: 404
    };
}

function asText (text) {
    return {
        status: 200,
        headers: map({'content-type': 'text/plain'}),
        text () {
            return promise.ok(text);
        }
    };
}


function asJson (input, data) {
    return {
        input: input,
        status: 200,
        headers: map({'content-type': 'application/json'}),
        json () {
            return promise.ok(data);
        }
    };
}


const sidebar = `<div class="sidebar">
    <div id="{{ id }}">
        <div class="list-group">
            <a class="sidebar-brand" href="{{ brandUrl }}">{{ brand }}</a>
            <a d3-for="item in primaryItems"
                class="list-group-item list-group-item-action list-group-item-primary"
                d3-attr-href="item.url"
                d3-append="item.label || item.name">
                <i d3-class="item.icon" aria-hidden="true"></i>
            </a>
        </div>
        <div class="list-group bottom">
            <a d3-for="item in secondaryItems"
                class='list-group-item list-group-item-action list-group-item-secondary'
                d3-attr-href="item.url"
                d3-html="item.name">
            </a>
        </div>
    </div>
    <div class="content-wrapper" d3-html="sidebarContent"></div>
</div>`;
