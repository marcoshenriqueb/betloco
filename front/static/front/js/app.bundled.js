!function (error) {
  console.error(error);
  if (typeof document === 'undefined') {
    return;
  } else if (!document.body) {
    document.addEventListener('DOMContentLoaded', print);
  } else {
    print();
  }
  function print() {
    var pre = document.createElement('pre');
    pre.className = 'errorify';
    pre.textContent = error.message || error;
    if (document.body.firstChild) {
      document.body.insertBefore(pre, document.body.firstChild);
    } else {
      document.body.appendChild(pre);
    }
  }
}({"message":"/var/www/python/betloco/resources/js/react/redux/reducers/orderReducer.js: Unexpected token (43:8) while parsing file: /var/www/python/betloco/resources/js/react/redux/reducers/orderReducer.js\n\n  41 |     case 'UPDATE_ORDER_HANDLE_ORDER':\n  42 |       return Object.assign({}, state, {\n> 43 |         ...action.payload\n     |         ^\n  44 |       });\n  45 |       break;\n  46 | ","name":"SyntaxError","stack":"SyntaxError: /var/www/python/betloco/resources/js/react/redux/reducers/orderReducer.js: Unexpected token (43:8)\n  41 |     case 'UPDATE_ORDER_HANDLE_ORDER':\n  42 |       return Object.assign({}, state, {\n> 43 |         ...action.payload\n     |         ^\n  44 |       });\n  45 |       break;\n  46 | \n    at Parser.pp.raise (/var/www/python/betloco/node_modules/babel-core/node_modules/babylon/lib/parser/location.js:22:13)\n    at Parser.pp.unexpected (/var/www/python/betloco/node_modules/babel-core/node_modules/babylon/lib/parser/util.js:89:8)\n    at Parser.pp.parseIdentifier (/var/www/python/betloco/node_modules/babel-core/node_modules/babylon/lib/parser/expression.js:1067:10)\n    at Parser.pp.parsePropertyName (/var/www/python/betloco/node_modules/babel-core/node_modules/babylon/lib/parser/expression.js:872:117)\n    at Parser.pp.parseObj (/var/www/python/betloco/node_modules/babel-core/node_modules/babylon/lib/parser/expression.js:788:12)\n    at Parser.pp.parseExprAtom (/var/www/python/betloco/node_modules/babel-core/node_modules/babylon/lib/parser/expression.js:491:19)\n    at Parser.parseExprAtom (/var/www/python/betloco/node_modules/babel-core/node_modules/babylon/lib/plugins/jsx/index.js:18:22)\n    at Parser.pp.parseExprSubscripts (/var/www/python/betloco/node_modules/babel-core/node_modules/babylon/lib/parser/expression.js:277:19)\n    at Parser.pp.parseMaybeUnary (/var/www/python/betloco/node_modules/babel-core/node_modules/babylon/lib/parser/expression.js:257:19)\n    at Parser.pp.parseExprOps (/var/www/python/betloco/node_modules/babel-core/node_modules/babylon/lib/parser/expression.js:188:19)"})