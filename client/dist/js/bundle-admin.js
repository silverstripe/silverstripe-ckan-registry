!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s="./client/src/bundles/bundle-admin.js")}({"./client/src/boot/index.js":function(e,t,n){"use strict";var r=n("./client/src/boot/registerComponents.js"),o=function(e){return e&&e.__esModule?e:{default:e}}(r);window.document.addEventListener("DOMContentLoaded",function(){(0,o.default)()})},"./client/src/boot/registerComponents.js":function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),a=r(o),i=n("./client/src/components/CKANResourceLocatorField.js"),s=r(i),l=n("./client/src/components/CKANPresentedOptionsField.js"),u=r(l),c=n("./client/src/components/CKANResultConditionsField.js"),d=r(c);t.default=function(){a.default.component.registerMany({CKANResourceLocatorField:s.default,CKANPresentedOptionsField:u.default,CKANResultConditionsField:d.default})}},"./client/src/bundles/bundle-admin.js":function(e,t,n){"use strict";n("./client/src/legacy/CKANResourceLocatorField-entwine.js"),n("./client/src/legacy/CKANPresentedOptionsField-entwine.js"),n("./client/src/legacy/CKANResultConditionsField-entwine.js"),n("./client/src/legacy/CKANResourceFilterForm-entwine.js"),n("./client/src/legacy/GridFieldResourceTitle.js"),n("./client/src/legacy/ResourceFilter.js"),n("./client/src/boot/index.js")},"./client/src/components/CKANPresentedOptionsField.js":function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.Component=t.SELECT_TYPE_CUSTOM=t.SELECT_TYPE_ALL=void 0;var l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(1),d=r(c),f=n(4),p=r(f),h=n(0),m=n(5),v=n(3),g=r(v),y=n("./client/src/lib/CKANApi.js"),b=r(y),_=n(8),C=r(_),O=t.SELECT_TYPE_ALL="0",j=t.SELECT_TYPE_CUSTOM="1",S=function(e){function t(e){a(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e)),r=e.value||{};return n.state=l({customOptions:[],selectType:e.selectTypeDefault,selections:[],suggestedOptions:[],suggestedOptionCache:{},loading:!1,fetchFailure:!1,separatorDelimiter:""},r),n.handleCheckboxChange=n.handleCheckboxChange.bind(n),n.handleInputChange=n.handleInputChange.bind(n),n.handleSelectTypeChange=n.handleSelectTypeChange.bind(n),n.handleDelimiterChange=n.handleDelimiterChange.bind(n),n.handleExecuteSeparator=n.handleExecuteSeparator.bind(n),n.handleTryAgain=n.handleTryAgain.bind(n),n}return s(t,e),u(t,[{key:"componentDidMount",value:function(){this.loadSuggestedOptions()}},{key:"getFieldName",value:function(e){return this.props.name+"-"+e}},{key:"getInputValue",value:function(){return this.state.customOptions.join("\n")}},{key:"getSelectType",value:function(){return void 0!==this.state.selectType?String(this.state.selectType):String(this.props.data.selectTypeDefault)}},{key:"loadSuggestedOptions",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=this.props.selectedFields;if(this.setState({suggestedOptions:[],loading:!1}),t&&this.setState({fetchFailure:!1}),!n.length)return[];var r=[],o=this.state,a=o.suggestedOptionCache,i=o.separatorDelimiter,s=o.fetchFailure,l=o.selections,u=[];if(n.forEach(function(n){if(a[n])return void(r=r.concat(a[n]));s&&!t||u.push(e.fetchOptionsForField(n))}),!u.length){r=this.splitOptionsBySeparator(r,i);var c=this.prepOptions(r);return this.setState({suggestedOptions:c,selections:l.length?l:c,loading:!1}),r}return this.setState({loading:!0}),Promise.all(u).then(function(){return e.loadSuggestedOptions()}),null}},{key:"prepOptions",value:function(e){var t=e.map(function(e){return null===e?null:String(e).trim().replace(/\s+/g," ")});return t.filter(function(e,n){return!(!e||"string"!=typeof e||0===e.length)&&t.indexOf(e)===n}).sort()}},{key:"fetchOptionsForField",value:function(e){var t=this,n=this.props.data,r=n.endpoint,a=n.resource;return b.default.loadDatastore(r,a).search([e],null,!0).then(function(n){var r=[];r=n.records.map(function(t){return t[e]}),t.setState(function(t){var n;return{suggestedOptionCache:l({},t.suggestedOptionCache,(n={},o(n,e,r),o(n,"fetchFailure",!1),n))}})}).catch(function(){t.setState(function(){return{loading:!1,fetchFailure:!0}})})}},{key:"splitOptionsBySeparator",value:function(e,t){return t&&t.length?e.reduce(function(e,n){return e.concat(n.split(t))},[]):e}},{key:"handleCheckboxChange",value:function(e){var t=this.state.selections,n=t.indexOf(e.target.value),r=t;n<0?r.push(e.target.value):r.splice(n,1),this.setState({selections:r})}},{key:"handleInputChange",value:function(e){this.setState({customOptions:e.target.value.split("\n").map(function(e){return e.trim()})})}},{key:"handleSelectTypeChange",value:function(e){this.setState({selectType:e.target.value})}},{key:"handleDelimiterChange",value:function(e){this.setState({separatorDelimiter:e.target.value})}},{key:"handleExecuteSeparator",value:function(){var e=this.state.separatorDelimiter,t=this.loadSuggestedOptions();if(e.length&&t){var n=this.prepOptions(this.splitOptionsBySeparator(t,e)),r=this.state.selections;this.props.value&&this.props.value.selections&&this.props.value.selections.length||(r=n),this.setState({suggestedOptions:n,selections:r})}}},{key:"handleTryAgain",value:function(){this.loadSuggestedOptions(!0)}},{key:"isCheckboxChecked",value:function(e){return this.state.selections.includes(e)}},{key:"renderFreetextInput",value:function(){if(this.getSelectType()!==j)return null;var e=C.default._t("CKANPresentedOptionsField.MANUAL_OPTION_DESCRIPTION","Options provided must match the data within the selected column. Each option should be placed on a new line.");return d.default.createElement(m.Row,null,d.default.createElement(m.Col,{lg:9,sm:12},d.default.createElement(m.Input,{type:"textarea",className:"ckan-presented-options__manual-options",name:this.getFieldName("options-custom"),onChange:this.handleInputChange,value:this.getInputValue()})),d.default.createElement(m.Col,{lg:3,sm:12},e))}},{key:"renderHiddenInput",value:function(){var e=this.props.name,t=this.state,n=t.selections,r=t.customOptions,o=t.separatorDelimiter,a={customOptions:r,selectType:this.getSelectType(),selections:n,separatorDelimiter:o};return d.default.createElement("input",{type:"hidden",name:e,value:JSON.stringify(a)})}},{key:"renderCheckboxList",value:function(){var e=this,t=this.getFieldName("options"),n=this.props.LoadingComponent,r=this.state,o=r.loading,a=r.suggestedOptions,i=a.length?a.map(function(n,r){return d.default.createElement(m.FormGroup,{key:n,className:"ckan-presented-options__option-group"},d.default.createElement(m.Input,{id:t+"-"+r,type:"checkbox",name:t+"[]",onChange:e.handleCheckboxChange,checked:e.isCheckboxChecked(n),value:n}),d.default.createElement(m.Label,{for:t+"-"+r},n))}):d.default.createElement("div",null,this.renderBadFetchMessage(),d.default.createElement("span",{className:"ckan-presented-options__options-list-empty"},C.default._t("CKANPresentedOptionsField.PLEASE_SELECT_COLUMNS","Please select columns to be able to select from all options")));return d.default.createElement("fieldset",{className:"ckan-presented-options__options-list"},o?d.default.createElement(n,null):i)}},{key:"renderSeparator",value:function(){return d.default.createElement(m.FormGroup,{className:"ckan-presented-options__option-separator"},d.default.createElement(m.Label,{for:"optionSeparator"},C.default._t("CKANPresentedOptionsField.DELIMITER","Delimiter")),d.default.createElement(m.InputGroup,null,d.default.createElement(m.Input,{value:this.state.separatorDelimiter,onChange:this.handleDelimiterChange}),d.default.createElement(m.InputGroupAddon,{addonType:"append"},d.default.createElement(m.Button,{onClick:this.handleExecuteSeparator,color:"primary"},C.default._t("CKANPresentedOptionsField.UPDATE","Update")))),d.default.createElement("div",{className:"form__field-description"},C.default._t("CKANPresentedOptionsField.SPLIT_OPTIONS_DESCRIPTION","Split options by characters. eg. comma")))}},{key:"renderBadFetchMessage",value:function(){var e=this.props.data.selectTypes,t=e.find(function(e){return e.value.toString()===j}).title,n=this.state.fetchFailure,r=C.default._t("CKANPresentedOptionsField.FETCH_FAILURE","There was an issue fetching the available options. "),o=C.default._t("CKANPresentedOptionsField.RETRY_FETCH","Try again?"),a=C.default.inject(C.default._t("CKANPresentedOptionsField.OR_MANUAL",' Or choose to "{manualAdd}"'),{manualAdd:t});return n&&d.default.createElement("div",{className:"ckan-presented-options__fetch-failure alert alert-danger"},r,d.default.createElement("a",{className:"ckan-presented-options__try-again alert-link",onClick:this.handleTryAgain,role:"button",tabIndex:"0"},o),a&&null)}},{key:"renderCheckboxListAndSeparator",value:function(){return this.getSelectType()!==O?null:d.default.createElement(m.Row,null,d.default.createElement(m.Col,{lg:9,sm:12},this.renderCheckboxList()),d.default.createElement(m.Col,{lg:3,sm:12},this.renderSeparator()))}},{key:"renderRadioOptions",value:function(){var e=this,t=this.props.data.selectTypes,n=this.getSelectType();return t.map(function(t){return d.default.createElement(m.FormGroup,{key:t.value,className:"ckan-presented-options__option-group"},d.default.createElement(m.Label,{for:"option-"+t.value,check:!0},d.default.createElement(m.Input,{id:"option-"+t.value,type:"radio",name:e.getFieldName("select-type"),value:t.value,onChange:e.handleSelectTypeChange,checked:n===String(t.value)}),t.title))})}},{key:"render",value:function(){var e=this.props.extraClass;return d.default.createElement("div",{className:e},this.renderRadioOptions(),this.renderCheckboxListAndSeparator(),this.renderFreetextInput(),this.renderHiddenInput())}}]),t}(c.Component);S.propTypes={selectedFields:p.default.arrayOf(p.default.string),data:p.default.shape({endpoint:p.default.string.isRequired,resource:p.default.string.isRequired,selectTypeDefault:p.default.string,selectTypes:p.default.arrayOf(p.default.shape({value:p.default.string,title:p.default.string}))}),extraClass:p.default.string,name:p.default.string,value:p.default.object,LoadingComponent:p.default.oneOfType([p.default.string,p.default.func]).isRequired},S.defaultProps={data:{},extraClass:"",selectedFields:[],value:{}},t.Component=S,t.default=(0,g.default)((0,h.inject)(["Loading"],function(e){return{LoadingComponent:e}},function(){return"CKAN.Filter.PresentedOptions"})(S))},"./client/src/components/CKANResourceLocatorField.js":function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.Component=void 0;var s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(1),c=r(u),d=n(4),f=r(d),p=n("./client/src/lib/CKANApi.js"),h=r(p),m=n(8),v=r(m),g=n(5),y=n("./node_modules/lodash/debounce.js"),b=r(y),_=n(0),C=n(3),O=r(C),j=n(7),S=r(j),k=n("./client/src/components/CKANResourceLocatorField/URLInput.js"),N=r(k),E=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={uri:h.default.generateURI(e.value||{})||"",spec:e.value||null,validationPending:!1,forceInvalid:!1,currentDataset:null,forceInvalidTimeout:null,changesNotified:!1},n.valueInput=null,n.handleChange=n.handleChange.bind(n),n.handleResourceSelect=n.handleResourceSelect.bind(n),n.handleNotificationOfChanges=n.handleNotificationOfChanges.bind(n),n.delayedValidateInput=(0,b.default)(n.validateInput.bind(n),500),n}return i(t,e),l(t,[{key:"componentDidMount",value:function(){this.state.uri.length&&this.validateInput()}},{key:"componentDidUpdate",value:function(e,t){if(this.valueInput&&JSON.stringify(t.spec)!==JSON.stringify(this.state.spec)){var n=new Event("change",{bubbles:!0});n.simulated=!0,this.valueInput.dispatchEvent(n)}}},{key:"getInvalidURLMessage",value:function(){var e=this.state,t=e.currentDataset,n=e.spec,r=e.forceInvalid,o={type:"error"};return r||n&&!t?(o.value=v.default._t("CKANResourceLocatorField.INVALID_DATASET_URL","The provided data source URL does not appear to be a valid CKAN data set."),o):null}},{key:"handleChange",value:function(e){var t=e.target.value;clearTimeout(this.state.forceInvalidTimeout),this.setState({uri:t,forceInvalid:!1,forceInvalidTimeout:null}),this.delayedValidateInput(),this.handleNotificationOfChanges()}},{key:"handleResourceSelect",value:function(e,t){var n=t.value;this.setState({spec:s({},this.state.spec,{resource:n})}),this.handleNotificationOfChanges()}},{key:"handleNotificationOfChanges",value:function(){var e=this.props.value;!this.state.changesNotified&&e&&0!==e.length&&(window.alert(v.default._t("CKANResourceLocatorField.CHANGES_WARNING","Please note: Changing the data source URL or resource will clear all existing columns and filters when saving the page.")),this.setState({changesNotified:!0}))}},{key:"validateInput",value:function(){var e=this,t=this.state.uri,n=this.props.defaultEndpoint,r=h.default.parseURI(t);if(r&&!r.endpoint&&n&&(r.endpoint=n,r.dataset&&this.setState({uri:h.default.generateURI(r)})),!r||!r.endpoint)return void this.setState({spec:null,forceInvalidTimeout:setTimeout(function(){return e.setState({forceInvalid:!0})},2e3)});this.setState({validationPending:!0});var o=function(){return e.setState({validationPending:!1,spec:null,currentDataset:null})};if(r.resource&&!r.dataset)return void h.default.loadResource(r.endpoint,r.resource).then(function(t){var n=s({},r,{dataset:t.package_id});e.setState({spec:n,uri:h.default.generateURI(n)||""}),e.validateInput()},o);h.default.loadDataset(r.endpoint,r.dataset).then(function(n){var o=t;if(n.name&&(r.dataset=n.name,o=h.default.generateURI(r)),r.resource&&n&&(o=o.substring(0,o.lastIndexOf("/",o.lastIndexOf("/")-1))),!r.resource&&n){var a=n.resources.find(function(e){return e.datastore_active});r.resource=a&&a.id}e.setState({uri:o,validationPending:!1,spec:r,currentDataset:n||null})},o)}},{key:"renderResourceSelect",value:function(){var e=this.state,t=e.uri,n=e.currentDataset,r=e.spec,o=this.props,a=o.SelectComponent,i=o.name,l={title:v.default._t("CKANResourceLocatorField.RESOURCE_NAME","Resource name"),extraClass:"form-field--no-divider stacked"};if(!n||!t||!t.length){var u=(0,O.default)(g.Input);return c.default.createElement(u,s({},l,{type:"text",disabled:!0}))}var d=v.default._t("CKANResourceLocatorField.INVALID_RESOURCE_SELECTION","Datastore is not available for the selected resource."),f=n.resources.map(function(e){return{value:e.id,title:e.name||e.description||null,disabled:!e.datastore_active,description:e.datastore_active?null:d}}),p=f.find(function(e){return e.value===r.resource}),h=null;return p&&p.disabled&&(h={type:"error",value:d}),c.default.createElement(a,s({},l,{message:h,className:{"is-invalid":h,"no-change-track":!0},name:i+"-resource-name",source:f,value:r.resource,onChange:this.handleResourceSelect}))}},{key:"renderHiddenInput",value:function(){var e=this,t=this.state,n=t.spec,r=t.validationMessage,o=!n||r?null:JSON.stringify(n);return c.default.createElement(g.Input,{name:this.props.name,type:"hidden",value:o,innerRef:function(t){e.valueInput=t}})}},{key:"render",value:function(){var e=this.state,t=e.uri,n=e.validationPending,r=this.getInvalidURLMessage(),o=!!r,a={title:v.default._t("CKANResourceLocatorField.DATA_SOURCE_URL","Data source URL"),extraClass:"form-field--no-divider stacked",message:r,value:t,invalid:o,onChange:this.handleChange},i=(0,S.default)("ckan-resource-locator__uri-input",{"ckan-resource-locator__uri-input--loading":n});return c.default.createElement("div",{className:"ckan-resource-locator"},c.default.createElement("div",{className:i},c.default.createElement(N.default,a)),c.default.createElement("div",{className:"ckan-resource-locator__big-slash"},"/"),c.default.createElement("div",{className:"ckan-resource-locator__resource-select"},this.renderResourceSelect()),this.renderHiddenInput())}}]),t}(u.Component);E.propTypes={name:f.default.string.isRequired,value:f.default.object,defaultEndpoint:f.default.string,SelectComponent:f.default.oneOfType([c.default.PropTypes.string,c.default.PropTypes.func])},t.Component=E,t.default=(0,O.default)((0,_.inject)(["SingleSelectField"],function(e){return{SelectComponent:e}},function(){return"CKAN.ResourceLocatorField"})(E))},"./client/src/components/CKANResourceLocatorField/URLInput.js":function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(1),u=r(l),c=n(4),d=r(c),f=n(3),p=r(f),h=n(5),m=n(7),v=r(m),g=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.handleChange=n.handleChange.bind(n),n}return i(t,e),s(t,[{key:"handleChange",value:function(e){var t=this.props.onChange;"function"==typeof t&&t(e)}},{key:"render",value:function(){var e=this.props,t=e.className,n=e.invalid,r=e.value,o={className:(0,v.default)(t,"no-change-track",{"is-invalid":n}),value:r,type:"text",onChange:this.handleChange};return u.default.createElement(h.Input,o)}}]),t}(l.Component);g.propTypes={value:d.default.string,invalid:d.default.bool,className:d.default.oneOf([d.default.string,d.default.array,d.default.object]),onChange:d.default.func},g.defaultProps={value:"",invalid:!1},t.default=(0,p.default)(g)},"./client/src/components/CKANResultConditionsField.js":function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.Component=void 0;var l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(1),d=r(c),f=n(4),p=r(f),h=n(0),m=n(5),v=n(3),g=r(v),y=function(e){function t(e){var n;a(this,t);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e)),s=e.value&&e.value[0]?e.value[0]:{"match-select":e.matchTypeDefault,"match-test":""};return r.state={0:(n={},o(n,r.getFieldName("match-select",e),s["match-select"]),o(n,r.getFieldName("match-text",e),s["match-text"]),n)},r.handleChange=r.handleChange.bind(r),r}return s(t,e),u(t,[{key:"getFieldName",value:function(e){return((arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).name||this.props.name)+"-"+e}},{key:"getSelectValue",value:function(){return this.state[0][this.getFieldName("match-select")]}},{key:"getInputValue",value:function(){return this.state[0][this.getFieldName("match-text")]}},{key:"getValue",value:function(){return{0:{"match-select":this.getSelectValue(),"match-text":this.getInputValue()}}}},{key:"handleChange",value:function(e){var t=this.state;this.setState({0:l({},t[0],o({},e.target.name,e.target.value))})}},{key:"renderSelect",value:function(){var e=this.props,t=e.SelectComponent,n=e.data.source;return d.default.createElement(t,{className:["no-change-track","ckan-result-conditions__match-select"],name:this.getFieldName("match-select"),source:n,value:this.getSelectValue(),onChange:this.handleChange})}},{key:"renderTextInput",value:function(){var e=this.props.TextFieldComponent;return d.default.createElement(e,{name:this.getFieldName("match-text"),className:["no-change-track","ckan-result-conditions__match-text"],onChange:this.handleChange,value:this.getInputValue()})}},{key:"renderHiddenInput",value:function(){var e=this.props.name;return d.default.createElement("input",{type:"hidden",name:e,value:JSON.stringify(this.getValue())})}},{key:"render",value:function(){return d.default.createElement("div",{className:"ckan-result-conditions"},d.default.createElement(m.Row,{form:!0},d.default.createElement(m.Col,{md:4,className:"ckan-result-conditions__column-left"},this.renderSelect()),d.default.createElement(m.Col,{md:8,className:"ckan-result-conditions__column-right"},this.renderTextInput())),this.renderHiddenInput())}}]),t}(c.Component);y.propTypes={name:p.default.string,value:p.default.object,data:p.default.shape({source:p.default.arrayOf(p.default.shape({value:p.default.string,title:p.default.string})),matchTypeDefault:p.default.string}),TextFieldComponent:p.default.oneOfType([d.default.PropTypes.string,d.default.PropTypes.func]).isRequired,SelectComponent:p.default.oneOfType([d.default.PropTypes.string,d.default.PropTypes.func]).isRequired},y.defaultProps={value:{},data:{}},t.Component=y,t.default=(0,g.default)((0,h.inject)(["SingleSelectField","TextField"],function(e,t){return{SelectComponent:e,TextFieldComponent:t}},function(){return"CKAN.Column.ResultConditionsField"})(y))},"./client/src/legacy/CKANPresentedOptionsField-entwine.js":function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},i=n(2),s=r(i),l=n(1),u=r(l),c=n(6),d=r(c),f=n(0);s.default.entwine("ss",function(e){e(".ckan-presented-options__container").entwine({FieldIDs:[],Mounted:!1,renderComponent:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t={},n=(0,f.loadComponent)("CKANPresentedOptionsField",t),r=this.data("schema"),i=r.data.fieldMap,s=this.getFieldIDs().map(function(e){return i[e]||null}),l=(r.extraClass,o(r,["extraClass"])),c=a({name:this.attr("name"),value:e?JSON.parse(e):void 0,selectedFields:s},l);d.default.render(u.default.createElement(n,c),this[0]),this.setMounted(!0)},setFields:function(e){Array.isArray(e)&&(this.setFieldIDs(e),this.getMounted()&&this.renderComponent())}}),e(".js-injector-boot .ckan-presented-options__container").entwine({onmatch:function(){var e=this.children("input:first");e.length&&this.renderComponent(e.val())},onunmatch:function(){d.default.unmountComponentAtNode(this[0]),this.setMounted(!1)}})})},"./client/src/legacy/CKANResourceFilterForm-entwine.js":function(e,t,n){"use strict";var r=n(2);(function(e){return e&&e.__esModule?e:{default:e}})(r).default.entwine("ss",function(e){e("select.ckan-columns__filter-fields").entwine({onmatch:function(){this.val().length&&this.closest("form").find(".ckan-presented-options__container").setFields(this.val())},onchange:function(){this.closest("form").find(".ckan-presented-options__container").setFields(this.val()||[])}})})},"./client/src/legacy/CKANResourceLocatorField-entwine.js":function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},a=n(2),i=r(a),s=n(1),l=r(s),u=n(6),c=r(u),d=n(0);i.default.entwine("ss",function(e){e(".js-injector-boot .ckan-resource-locator__container").entwine({onmatch:function(){var e={},t=(0,d.loadComponent)("CKANResourceLocatorField",e),n=this.data("schema"),r=this.children("input:first").val(),a=o({name:this.attr("name")},n,{defaultEndpoint:n.defaultEndpoint||null,description:n.description.html||"",value:r?JSON.parse(r):void 0});c.default.render(l.default.createElement(t,a),this[0])},onunmatch:function(){c.default.unmountComponentAtNode(this[0])}})})},"./client/src/legacy/CKANResultConditionsField-entwine.js":function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},a=n(2),i=r(a),s=n(1),l=r(s),u=n(6),c=r(u),d=n(0);i.default.entwine("ss",function(e){e(".js-injector-boot .ckan-result-conditions__container").entwine({onmatch:function(){var e={},t=(0,d.loadComponent)("CKANResultConditionsField",e),n=this.children("input:first");if(n.length){var r=n.val(),a=o({name:this.attr("name"),value:r?JSON.parse(r):void 0},this.data("schema"));c.default.render(l.default.createElement(t,a),this[0])}},onunmatch:function(){c.default.unmountComponentAtNode(this[0])}})})},"./client/src/legacy/GridFieldResourceTitle.js":function(e,t,n){"use strict";var r=n(2);(function(e){return e&&e.__esModule?e:{default:e}})(r).default.entwine("ss",function(e){e(".ckan-columns__edit-resource").entwine({onclick:function(t){t.preventDefault(),e(".ckan-resource-locator__container").toggleClass("hide")}})})},"./client/src/legacy/ResourceFilter.js":function(e,t,n){"use strict";var r=n(2);(function(e){return e&&e.__esModule?e:{default:e}})(r).default.entwine("ss",function(e){e(".field.ckan-columns__filter-fields").entwine({onmatch:function(){var e=this.prev(".ckan-columns__all-columns");e.length&&e.toggleSourcesField()}}),e(".form-check-input.ckan-columns__all-columns").entwine({onmatch:function(){this.toggleSourcesField()},onchange:function(){this.toggleSourcesField()},toggleSourcesField:function(){var e=this.closest(".field").next(".ckan-columns__filter-fields");e.length&&(this.is(":checked")?e.hide():e.show())}})})},"./client/src/lib/CKANApi.js":function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){var n=[],r=!0,o=!1,a=void 0;try{for(var i,s=e[Symbol.iterator]();!(r=(i=s.next()).done)&&(n.push(i.value),!t||n.length!==t);r=!0);}catch(e){o=!0,a=e}finally{try{!r&&s.return&&s.return()}finally{if(o)throw a}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(9),u=r(l),c=n("./client/src/lib/CKANApi/DataStore.js"),d=r(c),f=function(){function e(){o(this,e)}return s(e,null,[{key:"parseURI",value:function(e){if("string"!=typeof e||!e.length)return!1;var t=e,n="https://",r=t.match(/^https?:\/\//);r&&(n=r[0],t=t.substr(n.length)),t.endsWith("/")&&(t=t.substring(0,t.length-1));var o=t.split("/");return o.length>=5?(o.splice(0,o.length-4,o.slice(0,o.length-4).join("/")),{endpoint:""+n+o[0]+"/",dataset:o[2],resource:o[4]}):(4===o.length&&o.splice(0,2,o.slice(0,2).join("/")),3===o.length?{endpoint:""+n+o[0]+"/",dataset:o[2],resource:null}:t.match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)?{endpoint:null,dataset:null,resource:t}:!r&&!!t.match(/^[\d\w-]+$/i)&&{endpoint:null,dataset:t,resource:null})}},{key:"generateURI",value:function(e){if("object"!==(void 0===e?"undefined":i(e))||!e.endpoint||!e.dataset)return!1;var t=e.endpoint;try{new URL(t)}catch(e){return!1}"/"!==t.slice(-1)&&(t+="/");var n=t+"dataset/"+e.dataset;return e.resource?n+"/resource/"+e.resource:n}},{key:"loadDataset",value:function(e,t){return this.makeRequest(e,"package_show",{id:t}).then(function(e){return e.json().then(function(e){if(!e.success||!e.result)return!1;var n=e.result;return(n.name===t||n.id===t)&&n})},function(){return Promise.resolve(!1)})}},{key:"loadResource",value:function(e,t){return this.makeRequest(e,"resource_show",{id:t}).then(function(e){return e.json().then(function(e){return!!e.success&&e.result})},function(){return Promise.resolve(!1)})}},{key:"validateEndpoint",value:function(e){return this.makeRequest(e,"site_read").then(function(e){return e.ok?e.json().then(function(e){return e&&e.success}):Promise.resolve(!1)},function(){return Promise.resolve(!1)})}},{key:"loadDatastore",value:function(e,t){return new d.default(e,t)}},{key:"makeRequest",value:function(e,t,n){var r=e+"api/3/action/"+t;return n&&Object.values(n).length&&(r+="?"+Object.entries(n).map(function(e){var t=a(e,2),n=t[0],r=t[1];return n+"="+encodeURIComponent(r)}).join("&")),(0,u.default)(r)}}]),e}();t.default=f},"./client/src/lib/CKANApi/DataStore.js":function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n("./client/src/lib/CKANApi.js"),s=function(e){return e&&e.__esModule?e:{default:e}}(i),l=function(){function e(t,n){r(this,e),this.endpoint=t,this.resource=n}return a(e,[{key:"search",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:100,a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0;if(!Array.isArray(e)||!e.length)return Promise.reject(!1);var i={id:this.resource,fields:e.join(","),include_total:!0},l=null===t?null:void 0===t?"undefined":o(t);if(null!==t&&"string"!==l&&"object"!==l)return Promise.resolve(!1);if("string"===l&&t.length)i.q=t;else if("object"===l){var u=Object.entries(t);u.length&&(i.filters=JSON.stringify(t))}return n&&(i.distinct=!0),i.limit=r,i.offset=a,s.default.makeRequest(this.endpoint,"datastore_search",i).then(this.handleResponse)}},{key:"searchSql",value:function(e){return s.default.makeRequest(this.endpoint,"datastore_search_sql",{sql:e.parse(this.resource)}).then(this.handleResponse)}},{key:"handleResponse",value:function(e){return e.json().then(function(e){return!!e.success&&{records:e.result.records,total:e.result.total}})}}]),e}();t.default=l},"./node_modules/lodash/_Symbol.js":function(e,t,n){var r=n("./node_modules/lodash/_root.js"),o=r.Symbol;e.exports=o},"./node_modules/lodash/_baseGetTag.js":function(e,t,n){function r(e){return null==e?void 0===e?l:s:u&&u in Object(e)?a(e):i(e)}var o=n("./node_modules/lodash/_Symbol.js"),a=n("./node_modules/lodash/_getRawTag.js"),i=n("./node_modules/lodash/_objectToString.js"),s="[object Null]",l="[object Undefined]",u=o?o.toStringTag:void 0;e.exports=r},"./node_modules/lodash/_freeGlobal.js":function(e,t,n){(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t;e.exports=n}).call(t,n("./node_modules/webpack/buildin/global.js"))},"./node_modules/lodash/_getRawTag.js":function(e,t,n){function r(e){var t=i.call(e,l),n=e[l];try{e[l]=void 0;var r=!0}catch(e){}var o=s.call(e);return r&&(t?e[l]=n:delete e[l]),o}var o=n("./node_modules/lodash/_Symbol.js"),a=Object.prototype,i=a.hasOwnProperty,s=a.toString,l=o?o.toStringTag:void 0;e.exports=r},"./node_modules/lodash/_objectToString.js":function(e,t){function n(e){return o.call(e)}var r=Object.prototype,o=r.toString;e.exports=n},"./node_modules/lodash/_root.js":function(e,t,n){var r=n("./node_modules/lodash/_freeGlobal.js"),o="object"==typeof self&&self&&self.Object===Object&&self,a=r||o||Function("return this")();e.exports=a},"./node_modules/lodash/debounce.js":function(e,t,n){function r(e,t,n){function r(t){var n=y,r=b;return y=b=void 0,S=t,C=e.apply(r,n)}function c(e){return S=e,O=setTimeout(p,t),k?r(e):C}function d(e){var n=e-j,r=e-S,o=t-n;return N?u(o,_-r):o}function f(e){var n=e-j,r=e-S;return void 0===j||n>=t||n<0||N&&r>=_}function p(){var e=a();if(f(e))return h(e);O=setTimeout(p,d(e))}function h(e){return O=void 0,E&&y?r(e):(y=b=void 0,C)}function m(){void 0!==O&&clearTimeout(O),S=0,y=j=b=O=void 0}function v(){return void 0===O?C:h(a())}function g(){var e=a(),n=f(e);if(y=arguments,b=this,j=e,n){if(void 0===O)return c(j);if(N)return O=setTimeout(p,t),r(j)}return void 0===O&&(O=setTimeout(p,t)),C}var y,b,_,C,O,j,S=0,k=!1,N=!1,E=!0;if("function"!=typeof e)throw new TypeError(s);return t=i(t)||0,o(n)&&(k=!!n.leading,N="maxWait"in n,_=N?l(i(n.maxWait)||0,t):_,E="trailing"in n?!!n.trailing:E),g.cancel=m,g.flush=v,g}var o=n("./node_modules/lodash/isObject.js"),a=n("./node_modules/lodash/now.js"),i=n("./node_modules/lodash/toNumber.js"),s="Expected a function",l=Math.max,u=Math.min;e.exports=r},"./node_modules/lodash/isObject.js":function(e,t){function n(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}e.exports=n},"./node_modules/lodash/isObjectLike.js":function(e,t){function n(e){return null!=e&&"object"==typeof e}e.exports=n},"./node_modules/lodash/isSymbol.js":function(e,t,n){function r(e){return"symbol"==typeof e||a(e)&&o(e)==i}var o=n("./node_modules/lodash/_baseGetTag.js"),a=n("./node_modules/lodash/isObjectLike.js"),i="[object Symbol]";e.exports=r},"./node_modules/lodash/now.js":function(e,t,n){var r=n("./node_modules/lodash/_root.js"),o=function(){return r.Date.now()};e.exports=o},"./node_modules/lodash/toNumber.js":function(e,t,n){function r(e){if("number"==typeof e)return e;if(a(e))return i;if(o(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=o(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(s,"");var n=u.test(e);return n||c.test(e)?d(e.slice(2),n?2:8):l.test(e)?i:+e}var o=n("./node_modules/lodash/isObject.js"),a=n("./node_modules/lodash/isSymbol.js"),i=NaN,s=/^\s+|\s+$/g,l=/^[-+]0x[0-9a-f]+$/i,u=/^0b[01]+$/i,c=/^0o[0-7]+$/i,d=parseInt;e.exports=r},"./node_modules/webpack/buildin/global.js":function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},0:function(e,t){e.exports=Injector},1:function(e,t){e.exports=React},2:function(e,t){e.exports=jQuery},3:function(e,t){e.exports=FieldHolder},4:function(e,t){e.exports=PropTypes},5:function(e,t){e.exports=Reactstrap},6:function(e,t){e.exports=ReactDom},7:function(e,t){e.exports=classnames},8:function(e,t){e.exports=i18n},9:function(e,t){e.exports=IsomorphicFetch}});