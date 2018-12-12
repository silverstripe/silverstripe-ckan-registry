!function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s="./client/src/bundles/bundle.js")}({"./client/src/boot/index.js":function(e,t,n){"use strict";var o=n("./client/src/boot/registerComponents.js"),r=function(e){return e&&e.__esModule?e:{default:e}}(o);window.document.addEventListener("DOMContentLoaded",function(){(0,r.default)()})},"./client/src/boot/registerComponents.js":function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),a=o(r),u=n("./client/src/components/CKANResourceLocator.js"),i=o(u);t.default=function(){a.default.component.registerMany({CKANResourceLocator:i.default})}},"./client/src/bundles/bundle.js":function(e,t,n){"use strict";n("./client/src/legacy/entwine.js"),n("./client/src/boot/index.js")},"./client/src/components/CKANResourceLocator.js":function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},s=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),l=n(1),c=o(l),d=n(3),f=o(d),p=n("./client/src/lib/CKANApi.js"),v=o(p),h=n(8),m=o(h),b=n(4),y=n("./node_modules/lodash/debounce.js"),_=o(y),j=n(0),g=n(2),O=o(g),R=n(5),w=o(R),S=n("./client/src/components/ResourceLocator/URLInput.js"),x=o(S),I=function(e){function t(e){r(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={uri:v.default.generateURI(e.value)||"",spec:e.value||null,validationPending:!1,forceInvalid:!1,currentDataset:null,forceInvalidTimeout:null},n.handleChange=n.handleChange.bind(n),n.handleResourceSelect=n.handleResourceSelect.bind(n),n.delayedValidateInput=(0,_.default)(n.validateInput.bind(n),500),n}return u(t,e),s(t,[{key:"getInvalidURLMessage",value:function(){var e=this.state,t=e.currentDataset,n=e.spec,o=e.forceInvalid,r={type:"error"};return o||n&&!t?(r.value=m.default._t("CKANResourceLocator.INVALID_DATASET_URL","The provided data source URL does not appear to be a valid CKAN data set."),r):null}},{key:"handleChange",value:function(e){var t=e.target.value;clearTimeout(this.state.forceInvalidTimeout),this.setState({uri:t,forceInvalid:!1,forceInvalidTimeout:null}),this.delayedValidateInput()}},{key:"handleResourceSelect",value:function(e,t){var n=t.value;this.setState({spec:i({},this.state.spec,{resource:n})})}},{key:"validateInput",value:function(){var e=this,t=this.state.uri,n=this.props.defaultEndpoint,o=v.default.parseURI(t);if(o&&!o.endpoint&&n&&(o.endpoint=n,o.dataset&&this.setState({uri:v.default.generateURI(o)})),!o||!o.endpoint)return void this.setState({spec:null,forceInvalidTimeout:setTimeout(function(){return e.setState({forceInvalid:!0})},2e3)});this.setState({validationPending:!0});var r=function(){return e.setState({validationPending:!1,spec:null,currentDataset:null})};if(o.resource&&!o.dataset)return void v.default.loadResource(o.endpoint,o.resource).then(function(t){var n=i({},o,{dataset:t.package_id});e.setState({spec:n,uri:v.default.generateURI(n)||""}),e.validateInput()},r);v.default.loadDataset(o.endpoint,o.dataset).then(function(n){var r=t;n.name&&(o.dataset=n.name,r=v.default.generateURI(o)),o.resource&&n&&(r=r.substring(0,r.lastIndexOf("/",r.lastIndexOf("/")-1))),e.setState({uri:r,validationPending:!1,spec:o,currentDataset:n||null})},r)}},{key:"renderResourceSelect",value:function(){var e=this.state,t=e.uri,n=e.currentDataset,o=e.spec,r=this.props.SelectComponent,a={title:"Resource name",extraClass:"form-field--no-divider stacked"};if(!n||!t||!t.length){var u=(0,O.default)(b.Input);return c.default.createElement(u,i({},a,{type:"text",disabled:!0}))}var s=m.default._t("CKANResourceLocator.INVALID_RESOURCE_SELECTION","Datastore is not available for the selected resource."),l=n.resources.map(function(e){return{value:e.id,title:e.name||e.description||null,disabled:!e.datastore_active,description:e.datastore_active?null:s}}),d=l.find(function(e){return e.value===o.resource}),f=null;return d&&d.disabled&&(f={type:"error",value:s}),c.default.createElement(r,i({},a,{message:f,className:{"is-invalid":f},name:"now-i-have-a-name",source:l,value:o.resource,onChange:this.handleResourceSelect}))}},{key:"renderHiddenInput",value:function(){var e=this.state,t=e.spec,n=e.validationMessage,o=!t||n?null:JSON.stringify(t);return c.default.createElement(b.Input,{name:this.props.name,type:"hidden",value:o})}},{key:"render",value:function(){var e=this.state,t=e.uri,n=e.validationPending,o=this.getInvalidURLMessage(),r=!!o,a={title:m.default._t("CKANResourceLocator.DATA_SOURCE_URL","Data source URL"),extraClass:"form-field--no-divider stacked",message:o,value:t,invalid:r,onChange:this.handleChange},u=(0,w.default)("ckan-resource-locator__uri-input",{"ckan-resource-locator__uri-input--loading":n});return c.default.createElement("div",{className:"ckan-resource-locator"},c.default.createElement("div",{className:u},c.default.createElement(x.default,a)),c.default.createElement("div",{className:"ckan-resource-locator__big-slash"},"/"),c.default.createElement("div",{className:"ckan-resource-locator__resource-select"},this.renderResourceSelect()),this.renderHiddenInput())}}]),t}(l.Component);I.propTypes={name:f.default.string.isRequired,value:f.default.object.isRequired,defaultEndpoint:f.default.string,SelectComponent:f.default.oneOfType([c.default.PropTypes.string,c.default.PropTypes.func])},t.default=(0,O.default)((0,j.inject)(["SingleSelectField"],function(e){return{SelectComponent:e}},function(){return"ElementEditor.ElementList"})(I))},"./client/src/components/ResourceLocator/URLInput.js":function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(1),l=o(s),c=n(3),d=o(c),f=n(2),p=o(f),v=n(4),h=n(5),m=o(h),b=function(e){function t(e){r(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.handleChange=n.handleChange.bind(n),n}return u(t,e),i(t,[{key:"handleChange",value:function(e){var t=this.props.onChange;"function"==typeof t&&t(e)}},{key:"render",value:function(){var e=this.props,t=e.className,n=e.invalid,o=e.value,r={className:(0,m.default)(t,"no-change-track",{"is-invalid":n}),value:o,type:"text",onChange:this.handleChange};return l.default.createElement(v.Input,r)}}]),t}(s.Component);b.propTypes={value:d.default.string,invalid:d.default.bool,className:d.default.oneOf([d.default.string,d.default.array,d.default.object]),onChange:d.default.func},b.defaultProps={value:"",invalid:!1},t.default=(0,p.default)(b)},"./client/src/legacy/entwine.js":function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}var r=n(9),a=o(r),u=n(1),i=o(u),s=n(7),l=o(s),c=n(0);a.default.entwine("ss",function(e){e(".js-injector-boot .ckan-resource-locator__container").entwine({onmatch:function(){var e={},t=(0,c.loadComponent)("CKANResourceLocator",e),n=this.data("schema"),o=this.val(),r={name:this.attr("name"),defaultEndpoint:n.defaultEndpoint||null,description:n.description.html||"",value:o?JSON.parse(o):void 0};l.default.render(i.default.createElement(t,r),this[0])}})})},"./client/src/lib/CKANApi.js":function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){var n=[],o=!0,r=!1,a=void 0;try{for(var u,i=e[Symbol.iterator]();!(o=(u=i.next()).done)&&(n.push(u.value),!t||n.length!==t);o=!0);}catch(e){r=!0,a=e}finally{try{!o&&i.return&&i.return()}finally{if(r)throw a}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},u=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=n(6),s=function(e){return e&&e.__esModule?e:{default:e}}(i),l=function(){function e(){o(this,e)}return u(e,null,[{key:"parseURI",value:function(e){if("string"!=typeof e)throw new Error("URI provided must be of type string");if(!e.length)return!1;var t=e,n="https://",o=t.match(/^https?:\/\//);o&&(n=o[0],t=t.substr(n.length)),t.endsWith("/")&&(t=t.substring(0,t.length-1));var r=t.split("/");return r.length>=5?(r.splice(0,r.length-4,r.slice(0,r.length-4).join("/")),{endpoint:""+n+r[0]+"/",dataset:r[2],resource:r[4]}):(4===r.length&&r.splice(0,2,r.slice(0,2).join("/")),3===r.length?{endpoint:""+n+r[0]+"/",dataset:r[2],resource:null}:t.match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)?{endpoint:null,dataset:null,resource:t}:!o&&!t.includes("/")&&{endpoint:null,dataset:t,resource:null})}},{key:"generateURI",value:function(e){if("object"!==(void 0===e?"undefined":a(e))||!e.endpoint||!e.dataset)return!1;var t=e.endpoint;try{new URL(t)}catch(e){return!1}"/"!==t.slice(-1)&&(t+="/");var n=t+"dataset/"+e.dataset;return e.resource?n+"/resource/"+e.resource:n}},{key:"loadDataset",value:function(e,t){var n=this,o=function(e){if(!e.success||!e.result.count)return!1;var n=e.result.results[0];return(n.name===t||n.id===t)&&n};return this.makeRequest(e,"package_search",{fq:"name:"+t}).then(function(e){return e.json().then(o)},function(){return Promise.resolve(!1)}).then(function(r){return r||n.makeRequest(e,"package_search",{fq:"id:"+t}).then(function(e){return e.json().then(o)},function(){return Promise.resolve(!1)})})}},{key:"loadResource",value:function(e,t){return this.makeRequest(e,"resource_show",{id:t}).then(function(e){return e.json().then(function(e){return!!e.success&&e.result})})}},{key:"validateEndpoint",value:function(e){return this.makeRequest(e,"site_read").then(function(e){return e.ok?e.json().then(function(e){return e&&e.success}):Promise.resolve(!1)},function(){return Promise.resolve(!1)})}},{key:"makeRequest",value:function(e,t,n){var o=e+"api/3/action/"+t;return n&&Object.values(n).length&&(o+="?"+Object.entries(n).map(function(e){var t=r(e,2);return t[0]+"="+t[1]}).join("&")),(0,s.default)(o)}}]),e}();t.default=l},"./node_modules/lodash/_Symbol.js":function(e,t,n){var o=n("./node_modules/lodash/_root.js"),r=o.Symbol;e.exports=r},"./node_modules/lodash/_baseGetTag.js":function(e,t,n){function o(e){return null==e?void 0===e?s:i:l&&l in Object(e)?a(e):u(e)}var r=n("./node_modules/lodash/_Symbol.js"),a=n("./node_modules/lodash/_getRawTag.js"),u=n("./node_modules/lodash/_objectToString.js"),i="[object Null]",s="[object Undefined]",l=r?r.toStringTag:void 0;e.exports=o},"./node_modules/lodash/_freeGlobal.js":function(e,t,n){(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t;e.exports=n}).call(t,n("./node_modules/webpack/buildin/global.js"))},"./node_modules/lodash/_getRawTag.js":function(e,t,n){function o(e){var t=u.call(e,s),n=e[s];try{e[s]=void 0;var o=!0}catch(e){}var r=i.call(e);return o&&(t?e[s]=n:delete e[s]),r}var r=n("./node_modules/lodash/_Symbol.js"),a=Object.prototype,u=a.hasOwnProperty,i=a.toString,s=r?r.toStringTag:void 0;e.exports=o},"./node_modules/lodash/_objectToString.js":function(e,t){function n(e){return r.call(e)}var o=Object.prototype,r=o.toString;e.exports=n},"./node_modules/lodash/_root.js":function(e,t,n){var o=n("./node_modules/lodash/_freeGlobal.js"),r="object"==typeof self&&self&&self.Object===Object&&self,a=o||r||Function("return this")();e.exports=a},"./node_modules/lodash/debounce.js":function(e,t,n){function o(e,t,n){function o(t){var n=y,o=_;return y=_=void 0,w=t,g=e.apply(o,n)}function c(e){return w=e,O=setTimeout(p,t),S?o(e):g}function d(e){var n=e-R,o=e-w,r=t-n;return x?l(r,j-o):r}function f(e){var n=e-R,o=e-w;return void 0===R||n>=t||n<0||x&&o>=j}function p(){var e=a();if(f(e))return v(e);O=setTimeout(p,d(e))}function v(e){return O=void 0,I&&y?o(e):(y=_=void 0,g)}function h(){void 0!==O&&clearTimeout(O),w=0,y=R=_=O=void 0}function m(){return void 0===O?g:v(a())}function b(){var e=a(),n=f(e);if(y=arguments,_=this,R=e,n){if(void 0===O)return c(R);if(x)return O=setTimeout(p,t),o(R)}return void 0===O&&(O=setTimeout(p,t)),g}var y,_,j,g,O,R,w=0,S=!1,x=!1,I=!0;if("function"!=typeof e)throw new TypeError(i);return t=u(t)||0,r(n)&&(S=!!n.leading,x="maxWait"in n,j=x?s(u(n.maxWait)||0,t):j,I="trailing"in n?!!n.trailing:I),b.cancel=h,b.flush=m,b}var r=n("./node_modules/lodash/isObject.js"),a=n("./node_modules/lodash/now.js"),u=n("./node_modules/lodash/toNumber.js"),i="Expected a function",s=Math.max,l=Math.min;e.exports=o},"./node_modules/lodash/isObject.js":function(e,t){function n(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}e.exports=n},"./node_modules/lodash/isObjectLike.js":function(e,t){function n(e){return null!=e&&"object"==typeof e}e.exports=n},"./node_modules/lodash/isSymbol.js":function(e,t,n){function o(e){return"symbol"==typeof e||a(e)&&r(e)==u}var r=n("./node_modules/lodash/_baseGetTag.js"),a=n("./node_modules/lodash/isObjectLike.js"),u="[object Symbol]";e.exports=o},"./node_modules/lodash/now.js":function(e,t,n){var o=n("./node_modules/lodash/_root.js"),r=function(){return o.Date.now()};e.exports=r},"./node_modules/lodash/toNumber.js":function(e,t,n){function o(e){if("number"==typeof e)return e;if(a(e))return u;if(r(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=r(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(i,"");var n=l.test(e);return n||c.test(e)?d(e.slice(2),n?2:8):s.test(e)?u:+e}var r=n("./node_modules/lodash/isObject.js"),a=n("./node_modules/lodash/isSymbol.js"),u=NaN,i=/^\s+|\s+$/g,s=/^[-+]0x[0-9a-f]+$/i,l=/^0b[01]+$/i,c=/^0o[0-7]+$/i,d=parseInt;e.exports=o},"./node_modules/webpack/buildin/global.js":function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},0:function(e,t){e.exports=Injector},1:function(e,t){e.exports=React},2:function(e,t){e.exports=FieldHolder},3:function(e,t){e.exports=PropTypes},4:function(e,t){e.exports=Reactstrap},5:function(e,t){e.exports=classnames},6:function(e,t){e.exports=IsomorphicFetch},7:function(e,t){e.exports=ReactDom},8:function(e,t){e.exports=i18n},9:function(e,t){e.exports=jQuery}});