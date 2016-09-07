export {default as view} from './src/core';
export {default as viewModel} from './src/model';
export {default as viewExpression} from './src/parser';
export {default as viewProviders} from './src/utils/providers';
export {default as viewWarn} from './src/utils/warn';
export {default as viewForms} from './src/forms';
export {version as viewVersion} from './package.json';

export {
    htmlElement as viewElement,
    compile as viewTemplate,
    html as viewHtml
} from './src/utils/html';

