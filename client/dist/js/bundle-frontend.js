!function(e){function t(r){if(n[r])return n[r].exports;var l=n[r]={i:r,l:!1,exports:{}};return e[r].call(l.exports,l,l.exports,t),l.l=!0,l.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s="./client/src/bundles/bundle-frontend.js")}({"./client/src/bundles/bundle-frontend.js":function(e,t,n){"use strict";n("./client/src/components/CKANTextFilter.js")},"./client/src/components/CKANTextFilter.js":function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var l=n(1),u=r(l),s=n(0),a=r(s),o=n(3),c=r(o),i=n(2),f=function(e){var t=e.columns,n=e.extraClass,r=e.id,l=e.label,s=(0,c.default)(n,"form-group","ckan-registry__text-filter"),a="TextFilter_"+r+"_Search";return u.default.createElement(i.FormGroup,{className:s},l&&u.default.createElement(i.Label,{for:a},l),u.default.createElement(i.Input,{id:a,type:"text",name:"TextFilter["+r+"][Search]"}),u.default.createElement(i.Input,{type:"hidden",name:"TextFilter["+r+"][Columns]",value:JSON.stringify(t)}))};f.propTypes={id:a.default.string.isRequired,columns:a.default.arrayOf(a.default.string),extraClass:a.default.string,label:a.default.string},f.defaultProps={columns:[],extraClass:"",label:""},t.default=f},0:function(e,t){e.exports=PropTypes},1:function(e,t){e.exports=React},2:function(e,t){e.exports=Reactstrap},3:function(e,t){e.exports=classnames}});