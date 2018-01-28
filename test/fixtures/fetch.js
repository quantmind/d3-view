import {isAbsoluteUrl} from '../../index';
import jsonform from './jsonform';

export default function (url, ...o) {
    if (isAbsoluteUrl(url)) url = new URL(url).pathname;
    var result = fixtures[url];
    if (result) {
        try {
            return Promise.resolve(result(...o));
        } catch (err) {
            return Promise.reject(err);
        }
    } else return Promise.resolve(error(404));
}


const fixtures = {
    '/test': (o) => {
        if (!o || o.method === 'GET')
            return asText('<p>This is a test</p>');
        else
            return error(405);
    },
    '/fake/test': (o) => {
        if (!o || o.method === 'GET')
            return asText('<p>This is a test</p>');
        else
            return error(405);
    },
    '/submitTest': (o) => {
        if (o.method === 'POST')
            return asJson(o, {success: true});
        else
            return error(405);
    },
    '/sidebar': (o) => {
        if (!o || o.method === 'GET')
            return asText(sidebar);
        else
            return error(405);
    },
    '/jsonform': (o) => {
        if (!o || o.method === 'GET')
            return asJson(o, JSON.parse(jsonform));
        else
            return error(405);
    },
    '/error': () => {
        throw new Error('error');
    }
};


function error (status) {
    return {
        status: status,
        headers: new Map
    };
}


function asText (text) {
    return {
        status: 200,
        headers: new Map([['content-type', 'text/plain']]),
        text () {
            return Promise.resolve(text);
        }
    };
}


function asJson (input, data) {
    return {
        input: input,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json () {
            return Promise.resolve(data);
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
