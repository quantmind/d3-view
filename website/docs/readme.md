The easiest way to get started with d3-view is to dive into coding.

The smallest d3-view example looks like this:
```javascript
d3.view({
    components: {
        hello () {
            return `<p>Hello, world!</p>`;
        }
    }
}).mount('#root');
```