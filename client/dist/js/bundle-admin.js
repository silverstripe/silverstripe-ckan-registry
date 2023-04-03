!function(){var e={274:function(e,t,n){"use strict";var s,a=(s=n(521))&&s.__esModule?s:{default:s};window.document.addEventListener("DOMContentLoaded",(()=>{(0,a.default)()}))},521:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(648)),a=o(n(870)),r=o(n(708)),i=o(n(230));function o(e){return e&&e.__esModule?e:{default:e}}t.default=()=>{s.default.component.registerMany({CKANResourceLocatorField:a.default,CKANPresentedOptionsField:r.default,CKANResultConditionsField:i.default})}},708:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.SELECT_TYPE_CUSTOM=t.SELECT_TYPE_ALL=t.Component=void 0;var s=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var n=h(t);if(n&&n.has(e))return n.get(e);var s={},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var r in e)if("default"!==r&&Object.prototype.hasOwnProperty.call(e,r)){var i=a?Object.getOwnPropertyDescriptor(e,r):null;i&&(i.get||i.set)?Object.defineProperty(s,r,i):s[r]=e[r]}s.default=e,n&&n.set(e,s);return s}(n(363)),a=d(n(86)),r=n(648),i=n(127),o=d(n(42)),l=d(n(496)),u=d(n(754)),c=d(n(820));function d(e){return e&&e.__esModule?e:{default:e}}function h(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,n=new WeakMap;return(h=function(e){return e?n:t})(e)}t.SELECT_TYPE_ALL="0";const p="1";t.SELECT_TYPE_CUSTOM=p;class f extends s.Component{constructor(e){super(e);const t=e.value||{};this.state={customOptions:[],selectType:e.selectTypeDefault,selections:[],suggestedOptions:[],suggestedOptionCache:{},loading:!1,fetchFailure:!1,separatorDelimiter:"",...t},this.handleCheckboxChange=this.handleCheckboxChange.bind(this),this.handleInputChange=this.handleInputChange.bind(this),this.handleSelectTypeChange=this.handleSelectTypeChange.bind(this),this.handleDelimiterChange=this.handleDelimiterChange.bind(this),this.handleExecuteSeparator=this.handleExecuteSeparator.bind(this),this.handleTryAgain=this.handleTryAgain.bind(this)}componentDidMount(){this.loadSuggestedOptions()}getFieldName(e){return`${this.props.name}-${e}`}getInputValue(){return this.state.customOptions.join("\n")}getSelectType(){return void 0!==this.state.selectType?String(this.state.selectType):String(this.props.data.selectTypeDefault)}loadSuggestedOptions(){let e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];const{selectedFields:t}=this.props;if(this.setState({suggestedOptions:[],loading:!1}),e&&this.setState({fetchFailure:!1}),!t.length)return[];let n=[];const{suggestedOptionCache:s,separatorDelimiter:a,fetchFailure:r,selections:i}=this.state,o=[];if(t.forEach((t=>{s[t]?n=n.concat(s[t]):r&&!e||o.push(this.fetchOptionsForField(t))})),!o.length){n=this.splitOptionsBySeparator(n,a);const e=this.prepOptions(n);return this.setState({suggestedOptions:e,selections:i.length?i:[...e],loading:!1}),n}return this.setState({loading:!0}),Promise.all(o).then((()=>this.loadSuggestedOptions())),null}prepOptions(e){const t=e.map((e=>null===e?null:String(e).trim().replace(/\s+/g," ")));return t.filter(((e,n)=>!(!e||"string"!=typeof e||0===e.length)&&t.indexOf(e)===n)).sort()}fetchOptionsForField(e){const{data:{endpoint:t,resource:n}}=this.props;return l.default.loadDatastore(t,n).search([e],null,!0,1e3).then((t=>{let n=[];n=t.records.map((t=>t[e])),this.setState((t=>({suggestedOptionCache:{...t.suggestedOptionCache,[e]:n,fetchFailure:!1}})))})).catch((()=>{this.setState((()=>({loading:!1,fetchFailure:!0})))}))}splitOptionsBySeparator(e,t){return t&&t.length?e.reduce(((e,n)=>e.concat(n.split(t))),[]):e}handleCheckboxChange(e){const{selections:t}=this.state,n=t.indexOf(e.target.value),s=t;n<0?s.push(e.target.value):s.splice(n,1),this.setState({selections:s})}handleInputChange(e){this.setState({customOptions:e.target.value.split("\n").map((e=>e.trim()))})}handleSelectTypeChange(e){this.setState({selectType:e.target.value})}handleDelimiterChange(e){this.setState({separatorDelimiter:e.target.value})}handleExecuteSeparator(){const{separatorDelimiter:e}=this.state,t=this.loadSuggestedOptions();if(!e.length)return;if(!t)return;const n=this.prepOptions(this.splitOptionsBySeparator(t,e));let s=this.state.selections;this.props.value&&this.props.value.selections&&this.props.value.selections.length||(s=[...n]),this.setState({suggestedOptions:n,selections:s})}handleTryAgain(){this.loadSuggestedOptions(!0)}isCheckboxChecked(e){return this.state.selections.includes(e)}renderFreetextInput(){const{readOnly:e}=this.props;if(!e&&this.getSelectType()!==p)return null;const t=u.default._t("CKANPresentedOptionsField.MANUAL_OPTION_DESCRIPTION","Options provided must match the data within the selected column. Each option should be placed on a new line.");let n=this.getInputValue();return e&&this.getSelectType()!==p&&(n=this.state.selections.join("\n")),s.default.createElement(i.Row,null,s.default.createElement(i.Col,{lg:9,sm:12},s.default.createElement(i.Input,{type:"textarea",className:"ckan-presented-options__manual-options",name:this.getFieldName("options-custom"),onChange:this.handleInputChange,value:n,readOnly:e})),s.default.createElement(i.Col,{lg:3,sm:12},!e&&t))}renderHiddenInput(){const{name:e,readOnly:t}=this.props;if(t)return null;const{selections:n,customOptions:a,separatorDelimiter:r}=this.state,i={customOptions:a,selectType:this.getSelectType(),selections:n,separatorDelimiter:r};return s.default.createElement("input",{type:"hidden",name:e,value:JSON.stringify(i)})}renderCheckboxList(){const e=this.getFieldName("options"),{LoadingComponent:t,readOnly:n}=this.props,{loading:a,suggestedOptions:r}=this.state,o=r.length?r.map(((t,a)=>s.default.createElement(i.FormGroup,{key:t,className:"ckan-presented-options__option-group",check:!0},s.default.createElement(i.Input,{id:`${e}-${a}`,type:"checkbox",name:`${e}[]`,onChange:this.handleCheckboxChange,checked:this.isCheckboxChecked(t),value:t,readOnly:n}),s.default.createElement(i.Label,{for:`${e}-${a}`},t)))):s.default.createElement("div",null,this.renderBadFetchMessage(),s.default.createElement("span",{className:"ckan-presented-options__options-list-empty"},u.default._t("CKANPresentedOptionsField.PLEASE_SELECT_COLUMNS","Please select columns to be able to select from all options")));return s.default.createElement("fieldset",{className:"ckan-presented-options__options-list"},a?s.default.createElement(t,null):o)}renderSeparator(){const{readOnly:e}=this.props;return e?null:s.default.createElement(i.FormGroup,{className:"ckan-presented-options__option-separator"},s.default.createElement(i.Label,{for:"optionSeparator"},u.default._t("CKANPresentedOptionsField.DELIMITER","Delimiter")),s.default.createElement(i.InputGroup,null,s.default.createElement(i.Input,{value:this.state.separatorDelimiter,onChange:this.handleDelimiterChange}),s.default.createElement(i.InputGroupAddon,{addonType:"append"},s.default.createElement(i.Button,{onClick:this.handleExecuteSeparator,color:"primary"},u.default._t("CKANPresentedOptionsField.UPDATE","Update")))),s.default.createElement("div",{className:"form__field-description"},u.default._t("CKANPresentedOptionsField.SPLIT_OPTIONS_DESCRIPTION","Split options by characters. eg. comma")))}renderBadFetchMessage(){const{data:{selectTypes:e}}=this.props,t=e.find((e=>e.value.toString()===p)).title,{fetchFailure:n}=this.state,a=u.default._t("CKANPresentedOptionsField.FETCH_FAILURE","There was an issue fetching the available options. "),r=u.default._t("CKANPresentedOptionsField.RETRY_FETCH","Try again?"),i=u.default.inject(u.default._t("CKANPresentedOptionsField.OR_MANUAL",' Or choose to "{manualAdd}"'),{manualAdd:t});return n&&s.default.createElement("div",{className:"ckan-presented-options__fetch-failure alert alert-danger"},a,s.default.createElement("a",{className:"ckan-presented-options__try-again alert-link",onClick:this.handleTryAgain,role:"button",tabIndex:"0"},r),i&&null)}renderCheckboxListAndSeparator(){const{readOnly:e}=this.props;return e||"0"!==this.getSelectType()?null:s.default.createElement(i.Row,null,s.default.createElement(i.Col,{lg:9,sm:12},this.renderCheckboxList()),s.default.createElement(i.Col,{lg:3,sm:12},this.renderSeparator()))}renderRadioOptions(){const{readOnly:e,data:{selectTypes:t}}=this.props;if(e)return null;const n=this.getSelectType();return t.map((e=>s.default.createElement(i.FormGroup,{key:e.value,className:"ckan-presented-options__option-group"},s.default.createElement(i.Label,{for:`option-${e.value}`,check:!0},s.default.createElement(i.Input,{id:`option-${e.value}`,type:"radio",name:this.getFieldName("select-type"),value:e.value,onChange:this.handleSelectTypeChange,checked:n===String(e.value)}),e.title))))}render(){const{extraClass:e}=this.props;return s.default.createElement("div",{className:(0,c.default)("ckan-presented-options",e)},this.renderRadioOptions(),this.renderCheckboxListAndSeparator(),this.renderFreetextInput(),this.renderHiddenInput())}}t.Component=f,f.propTypes={selectedFields:a.default.arrayOf(a.default.string),data:a.default.shape({endpoint:a.default.string.isRequired,resource:a.default.string.isRequired,selectTypeDefault:a.default.string,selectTypes:a.default.arrayOf(a.default.shape({value:a.default.string,title:a.default.string}))}),extraClass:a.default.string,name:a.default.string,value:a.default.object,readOnly:a.default.bool,LoadingComponent:a.default.oneOfType([a.default.string,a.default.func]).isRequired},f.defaultProps={data:{},extraClass:"",selectedFields:[],value:{},readOnly:!1};var g=(0,o.default)((0,r.inject)(["Loading"],(e=>({LoadingComponent:e})),(()=>"CKAN.Filter.PresentedOptions"))(f));t.default=g},870:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.Component=void 0;var s=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var n=p(t);if(n&&n.has(e))return n.get(e);var s={},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var r in e)if("default"!==r&&Object.prototype.hasOwnProperty.call(e,r)){var i=a?Object.getOwnPropertyDescriptor(e,r):null;i&&(i.get||i.set)?Object.defineProperty(s,r,i):s[r]=e[r]}s.default=e,n&&n.set(e,s);return s}(n(363)),a=h(n(86)),r=h(n(496)),i=h(n(754)),o=n(127),l=h(n(279)),u=n(648),c=h(n(42)),d=h(n(820));function h(e){return e&&e.__esModule?e:{default:e}}function p(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,n=new WeakMap;return(p=function(e){return e?n:t})(e)}function f(){return f=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&(e[s]=n[s])}return e},f.apply(this,arguments)}class g extends s.Component{constructor(e){super(e),this.state={uri:r.default.generateURI(e.value||{})||"",spec:e.value||null,validationPending:!1,forceInvalid:!1,currentDataset:null,forceInvalidTimeout:null,changesNotified:!1,isMounting:!0},this.valueInput=null,this.handleChange=this.handleChange.bind(this),this.handleResourceSelect=this.handleResourceSelect.bind(this),this.handleNotificationOfChanges=this.handleNotificationOfChanges.bind(this),this.delayedValidateInput=(0,l.default)(this.validateInput.bind(this),500)}componentDidMount(){const{uri:e}=this.state;e.length&&this.validateInput()}componentDidUpdate(e,t){if(this.valueInput&&JSON.stringify(t.spec)!==JSON.stringify(this.state.spec)){const e=new Event("change",{bubbles:!0});e.simulated=!0,this.valueInput.dispatchEvent(e)}}getInvalidURLMessage(){const{currentDataset:e,spec:t,forceInvalid:n,isMounting:s}=this.state,a={type:"error"};return s||!n&&(!t||e)?null:(a.value=i.default._t("CKANResourceLocatorField.INVALID_DATASET_URL","The provided data source URL does not appear to be a valid CKAN data set."),a)}handleChange(e){const t=e.target.value;clearTimeout(this.state.forceInvalidTimeout),this.setState({uri:t,forceInvalid:!1,forceInvalidTimeout:null}),this.delayedValidateInput(),this.handleNotificationOfChanges()}handleResourceSelect(e,t){let{value:n}=t;this.setState({spec:{...this.state.spec,resource:n}}),this.handleNotificationOfChanges()}handleNotificationOfChanges(){const{value:e}=this.props,{changesNotified:t}=this.state;!t&&e&&0!==e.length&&(window.alert(i.default._t("CKANResourceLocatorField.CHANGES_WARNING","Please note: Changing the data source URL or resource will clear all existing columns and filters when saving the page.")),this.setState({changesNotified:!0}))}validateInput(){const{uri:e}=this.state,{defaultEndpoint:t}=this.props,n=r.default.parseURI(e);if(n&&!n.endpoint&&t&&(n.endpoint=t,n.dataset&&this.setState({uri:r.default.generateURI(n)})),!n||!n.endpoint)return void this.setState({spec:null,forceInvalidTimeout:setTimeout((()=>this.setState({forceInvalid:!0})),2e3),currentDataset:null});this.setState({validationPending:!0});const s=()=>this.setState({validationPending:!1,isMounting:!1,spec:null,currentDataset:null});!n.resource||n.dataset?r.default.loadDataset(n.endpoint,n.dataset).then((t=>{let s=e;if(t.name&&(n.dataset=t.name,s=r.default.generateURI(n)),n.resource&&t&&(s=s.substring(0,s.lastIndexOf("/",s.lastIndexOf("/")-1))),!n.resource&&t){const e=t.resources.find((e=>e.datastore_active));n.resource=e&&e.id}this.setState({uri:s,validationPending:!1,spec:n,currentDataset:t||null,isMounting:!1})}),s):r.default.loadResource(n.endpoint,n.resource).then((e=>{const t={...n,dataset:e.package_id};this.setState({spec:t,uri:r.default.generateURI(t)||"",isMounting:!1}),this.validateInput()}),s)}renderResourceSelect(){const{uri:e,currentDataset:t,spec:n}=this.state,{name:a,readOnly:r,SelectComponent:o,TextFieldComponent:l}=this.props,u={title:i.default._t("CKANResourceLocatorField.RESOURCE_NAME","Resource name"),extraClass:"stacked"};if(r||!t||!e||!e.length){let e="";if(n&&n.resource&&t){const s=t.resources.find((e=>e.id===n.resource));e=s.name||s.description||s.id}return s.default.createElement(l,f({},u,{type:"text",disabled:!0,value:e}))}const c=i.default._t("CKANResourceLocatorField.INVALID_RESOURCE_SELECTION","Datastore is not available for the selected resource."),d=t.resources.map((e=>({value:e.id,title:e.name||e.description||null,disabled:!e.datastore_active,description:e.datastore_active?null:c})));let h=null;const p=d.find((e=>e.value===n.resource));return p&&p.disabled&&(h={type:"error",value:c}),s.default.createElement(o,f({},u,{message:h,className:{"is-invalid":h,"no-change-track":!0},name:`${a}-resource-name`,source:d,value:n.resource,onChange:this.handleResourceSelect}))}renderHiddenInput(){const{spec:e,validationMessage:t}=this.state,n=!e||t?"":JSON.stringify(e),{readOnly:a}=this.props;return a?null:s.default.createElement(o.Input,{name:this.props.name,type:"hidden",value:n,innerRef:e=>{this.valueInput=e}})}renderUrlInput(){const{uri:e}=this.state,{readOnly:t,TextFieldComponent:n,name:a}=this.props,r=this.getInvalidURLMessage(),o=!!r,l={name:`${a}-uri`,title:i.default._t("CKANResourceLocatorField.DATA_SOURCE_URL","Data source URL"),className:(0,d.default)("no-change-track",{"is-invalid":o}),message:r,value:e||"",readOnly:t,invalid:o,onChange:this.handleChange};return s.default.createElement(n,l)}render(){const{validationPending:e}=this.state,t=(0,d.default)("ckan-resource-locator__uri-input",{"ckan-resource-locator__uri-input--loading":e});return s.default.createElement("div",{className:"ckan-resource-locator"},s.default.createElement("div",{className:t},this.renderUrlInput()),s.default.createElement("div",{className:"ckan-resource-locator__big-slash"},"/"),s.default.createElement("div",{className:"ckan-resource-locator__resource-select"},this.renderResourceSelect()),this.renderHiddenInput())}}t.Component=g,g.propTypes={name:a.default.string.isRequired,value:a.default.object,defaultEndpoint:a.default.string,SelectComponent:a.default.oneOfType([a.default.string,a.default.func])};var m=(0,c.default)((0,u.inject)(["SingleSelectField","TextField"],((e,t)=>({SelectComponent:e,TextFieldComponent:t})),(()=>"CKAN.ResourceLocatorField"))(g));t.default=m},230:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.Component=void 0;var s=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var n=u(t);if(n&&n.has(e))return n.get(e);var s={},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var r in e)if("default"!==r&&Object.prototype.hasOwnProperty.call(e,r)){var i=a?Object.getOwnPropertyDescriptor(e,r):null;i&&(i.get||i.set)?Object.defineProperty(s,r,i):s[r]=e[r]}s.default=e,n&&n.set(e,s);return s}(n(363)),a=l(n(86)),r=n(648),i=n(127),o=l(n(42));function l(e){return e&&e.__esModule?e:{default:e}}function u(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,n=new WeakMap;return(u=function(e){return e?n:t})(e)}class c extends s.Component{constructor(e){super(e);const t=e.value&&e.value[0]?e.value[0]:{"match-select":e.data.matchTypeDefault,"match-text":""};this.state={0:{[this.getFieldName("match-select",e)]:t["match-select"],[this.getFieldName("match-text",e)]:t["match-text"]}},this.handleChange=this.handleChange.bind(this)}getFieldName(e){return`${(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).name||this.props.name}-${e}`}getSelectValue(){return`${this.state[0][this.getFieldName("match-select")]}`}getInputValue(){return this.state[0][this.getFieldName("match-text")]}getValue(){return{0:{"match-select":this.getSelectValue(),"match-text":this.getInputValue()}}}handleChange(e){const t=this.state;this.setState({0:{...t[0],[e.target.name]:e.target.value}})}renderSelect(){const{SelectComponent:e,data:{source:t}}=this.props;return s.default.createElement(e,{className:["no-change-track","ckan-result-conditions__match-select"],name:this.getFieldName("match-select"),source:t,value:this.getSelectValue(),onChange:this.handleChange})}renderTextInput(){const{TextFieldComponent:e}=this.props;return s.default.createElement(e,{name:this.getFieldName("match-text"),className:["no-change-track","ckan-result-conditions__match-text"],onChange:this.handleChange,value:this.getInputValue()})}renderHiddenInput(){const{name:e}=this.props,t=this.getValue(),n=t[0]["match-text"].length?JSON.stringify(t):"";return s.default.createElement("input",{type:"hidden",name:e,value:n})}renderReadOnly(){const{data:{source:e}}=this.props,t=this.getInputValue(),n=e.find((e=>`${e.value}`===this.getSelectValue()));return n?s.default.createElement("p",{className:"form-control-static readonly"},n.title,": ",t):null}render(){return this.props.readOnly?this.renderReadOnly():s.default.createElement("div",{className:"ckan-result-conditions"},s.default.createElement(i.Row,{form:!0},s.default.createElement(i.Col,{md:4,className:"ckan-result-conditions__column-left"},this.renderSelect()),s.default.createElement(i.Col,{md:8,className:"ckan-result-conditions__column-right"},this.renderTextInput())),this.renderHiddenInput())}}t.Component=c,c.propTypes={name:a.default.string,value:a.default.object,data:a.default.shape({source:a.default.arrayOf(a.default.shape({value:a.default.string,title:a.default.string})),matchTypeDefault:a.default.string}),readOnly:a.default.bool,TextFieldComponent:a.default.oneOfType([a.default.string,a.default.func]).isRequired,SelectComponent:a.default.oneOfType([a.default.string,a.default.func]).isRequired},c.defaultProps={value:{},data:{},readOnly:!1};var d=(0,o.default)((0,r.inject)(["SingleSelectField","TextField"],((e,t)=>({SelectComponent:e,TextFieldComponent:t})),(()=>"CKAN.Column.ResultConditionsField"))(c));t.default=d},217:function(e,t,n){"use strict";var s=o(n(311)),a=o(n(363)),r=n(691),i=n(648);function o(e){return e&&e.__esModule?e:{default:e}}s.default.entwine("ss",(e=>{e(".ckan-presented-options__container").entwine({FieldIDs:[],Mounted:!1,ReactRoot:null,renderComponent(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;const t=(0,i.loadComponent)("CKANPresentedOptionsField",{}),n=this.data("schema"),{data:{fieldMap:s}}=n,o=this.getFieldIDs().map((e=>s[e]||null)),{extraClass:l,...u}=n,c={name:this.attr("name"),value:e?JSON.parse(e):void 0,selectedFields:o,...u};let d=this.getReactRoot();d||(d=(0,r.createRoot)(this[0]),this.setReactRoot(d)),d.render(a.default.createElement(t,c)),this.setMounted(!0)},setFields(e){Array.isArray(e)&&(this.setFieldIDs(e),this.getMounted()&&this.renderComponent())}}),e(".js-injector-boot .ckan-presented-options__container").entwine({onmatch(){const e=this.children("input:first");e.length&&this.renderComponent(e.val())},onunmatch(){const e=this.getReactRoot();e&&(e.unmount(),this.setReactRoot(null)),this.setMounted(!1)}})}))},163:function(e,t,n){"use strict";var s;((s=n(311))&&s.__esModule?s:{default:s}).default.entwine("ss",(e=>{e("select.ckan-columns__filter-fields").entwine({onmatch(){if(this.val().length){this.closest("form").find(".ckan-presented-options__container").setFields(this.val())}},onchange(){this.closest("form").find(".ckan-presented-options__container").setFields(this.val()||[])}})}))},121:function(e,t,n){"use strict";var s=o(n(311)),a=o(n(363)),r=n(691),i=n(648);function o(e){return e&&e.__esModule?e:{default:e}}s.default.entwine("ss",(e=>{e(".js-injector-boot .ckan-resource-locator__container").entwine({ReactRoot:null,onmatch(){const e=(0,i.loadComponent)("CKANResourceLocatorField",{}),t=this.data("schema"),n=this.children("input:first").val(),s={name:this.attr("name"),...t,defaultEndpoint:t.defaultEndpoint||null,description:t.description&&t.description.html||"",value:n?JSON.parse(n):void 0};let o=this.getReactRoot();o||(o=(0,r.createRoot)(this[0]),this.setReactRoot(o)),o.render(a.default.createElement(e,s))},onunmatch(){const e=this.getReactRoot();e&&(e.unmount(),this.setReactRoot(null))}})}))},293:function(e,t,n){"use strict";var s=o(n(311)),a=o(n(363)),r=n(691),i=n(648);function o(e){return e&&e.__esModule?e:{default:e}}s.default.entwine("ss",(e=>{e(".js-injector-boot .ckan-result-conditions__container").entwine({ReactRoot:null,onmatch(){const e=(0,i.loadComponent)("CKANResultConditionsField",{}),t=this.children("input:first");if(!t.length)return;const n=t.val(),s={name:this.attr("name"),value:n?JSON.parse(n):void 0,...this.data("schema")};let o=this.getReactRoot();o||(o=(0,r.createRoot)(this[0]),this.setReactRoot(o)),o.render(a.default.createElement(e,s))},onunmatch(){const e=this.getReactRoot();e&&(e.unmount(),this.setReactRoot(null))}})}))},812:function(e,t,n){"use strict";var s;((s=n(311))&&s.__esModule?s:{default:s}).default.entwine("ss",(e=>{e(".ckan-columns__edit-resource").entwine({onclick(t){t.preventDefault(),e(".ckan-resource-locator__container").toggleClass("hide")}})}))},838:function(e,t,n){"use strict";var s;((s=n(311))&&s.__esModule?s:{default:s}).default.entwine("ss",(e=>{e(".field.ckan-columns__filter-fields").entwine({onmatch(){const e=this.prev(".ckan-columns__all-columns");e.length&&e.toggleSourcesField()}}),e(".form-check-input.ckan-columns__all-columns").entwine({onmatch(){this.toggleSourcesField()},onchange(){this.toggleSourcesField()},toggleSourcesField(){const e=this.closest(".field").next(".ckan-columns__filter-fields");e.length&&(this.is(":checked")?e.hide():e.show())}})}))},496:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=r(n(875)),a=r(n(283));function r(e){return e&&e.__esModule?e:{default:e}}var i=class{static parseURI(e){if("string"!=typeof e||!e.length)return!1;let t=e,n="https://";const s=t.match(/^https?:\/\//);s&&(n=s[0],t=t.substr(n.length)),t.endsWith("/")&&(t=t.substring(0,t.length-1));const a=t.split("/");return a.length>=5?(a.splice(0,a.length-4,a.slice(0,a.length-4).join("/")),{endpoint:`${n}${a[0]}/`,dataset:a[2],resource:a[4]}):(4===a.length&&a.splice(0,2,a.slice(0,2).join("/")),3===a.length?{endpoint:`${n}${a[0]}/`,dataset:a[2],resource:null}:t.match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)?{endpoint:null,dataset:null,resource:t}:!s&&(!!t.match(/^[\d\w-]+$/i)&&{endpoint:null,dataset:t,resource:null}))}static generateURI(e){if("object"!=typeof e||!e.endpoint||!e.dataset)return!1;let{endpoint:t}=e;try{new URL(t)}catch(e){return!1}"/"!==t.slice(-1)&&(t+="/");const n=`${t}dataset/${e.dataset}`;return e.resource?`${n}/resource/${e.resource}`:n}static loadDataset(e,t){return this.makeRequest(e,"package_show",{id:t}).then((e=>e.json().then((e=>{if(!e.success||!e.result)return!1;const{result:n}=e;return(n.name===t||n.id===t)&&n}))),(()=>Promise.resolve(!1)))}static loadResource(e,t){return this.makeRequest(e,"resource_show",{id:t}).then((e=>e.json().then((e=>!!e.success&&e.result))),(()=>Promise.resolve(!1)))}static validateEndpoint(e){return this.makeRequest(e,"site_read").then((e=>e.ok?e.json().then((e=>e&&e.success)):Promise.resolve(!1)),(()=>Promise.resolve(!1)))}static loadDatastore(e,t){return new a.default(e,t)}static makeRequest(e,t,n){let a=`${e}api/3/action/${t}`;if(n&&Object.values(n).length){a+=`?${Object.entries(n).map((e=>{let[t,n]=e;return`${t}=${encodeURIComponent(n)}`})).join("&")}`}return(0,s.default)(a)}};t.default=i},283:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s,a=(s=n(496))&&s.__esModule?s:{default:s};t.default=class{constructor(e,t){this.endpoint=e,this.resource=t}search(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:100,r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0,i=arguments.length>5&&void 0!==arguments[5]?arguments[5]:null;if(!Array.isArray(e)||!e.length)return Promise.reject(!1);const o={id:this.resource,fields:e.join(","),include_total:!0},l=null===t?null:typeof t;if(null!==t&&"string"!==l&&"object"!==l)return Promise.resolve(!1);if("string"===l&&t.length)o.q=t;else if("object"===l){Object.entries(t).length&&(o.filters=JSON.stringify(t))}if(n&&(o.distinct=!0),o.limit=s,o.offset=r,i){const{sortField:e,sortAscending:t}=i;o.sort=`${e} ${t?"ASC":"DESC"}`}return a.default.makeRequest(this.endpoint,"datastore_search",o).then(this.handleResponse)}searchSql(e){return a.default.makeRequest(this.endpoint,"datastore_search_sql",{sql:e.parse(this.resource)}).then(this.handleResponse)}countSql(e){return a.default.makeRequest(this.endpoint,"datastore_search_sql",{sql:e.parseCount(this.resource)}).then((e=>e.json().then((e=>!!e.success&&e.result.records[0].count))))}handleResponse(e){return e.json().then((e=>!!e.success&&{records:e.result.records,total:e.result.total}))}}},705:function(e,t,n){var s=n(639).Symbol;e.exports=s},239:function(e,t,n){var s=n(705),a=n(607),r=n(333),i=s?s.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":i&&i in Object(e)?a(e):r(e)}},561:function(e,t,n){var s=n(990),a=/^\s+/;e.exports=function(e){return e?e.slice(0,s(e)+1).replace(a,""):e}},957:function(e,t,n){var s="object"==typeof n.g&&n.g&&n.g.Object===Object&&n.g;e.exports=s},607:function(e,t,n){var s=n(705),a=Object.prototype,r=a.hasOwnProperty,i=a.toString,o=s?s.toStringTag:void 0;e.exports=function(e){var t=r.call(e,o),n=e[o];try{e[o]=void 0;var s=!0}catch(e){}var a=i.call(e);return s&&(t?e[o]=n:delete e[o]),a}},333:function(e){var t=Object.prototype.toString;e.exports=function(e){return t.call(e)}},639:function(e,t,n){var s=n(957),a="object"==typeof self&&self&&self.Object===Object&&self,r=s||a||Function("return this")();e.exports=r},990:function(e){var t=/\s/;e.exports=function(e){for(var n=e.length;n--&&t.test(e.charAt(n)););return n}},279:function(e,t,n){var s=n(218),a=n(771),r=n(841),i=Math.max,o=Math.min;e.exports=function(e,t,n){var l,u,c,d,h,p,f=0,g=!1,m=!1,v=!0;if("function"!=typeof e)throw new TypeError("Expected a function");function y(t){var n=l,s=u;return l=u=void 0,f=t,d=e.apply(s,n)}function _(e){return f=e,h=setTimeout(O,t),g?y(e):d}function C(e){var n=e-p;return void 0===p||n>=t||n<0||m&&e-f>=c}function O(){var e=a();if(C(e))return S(e);h=setTimeout(O,function(e){var n=t-(e-p);return m?o(n,c-(e-f)):n}(e))}function S(e){return h=void 0,v&&l?y(e):(l=u=void 0,d)}function b(){var e=a(),n=C(e);if(l=arguments,u=this,p=e,n){if(void 0===h)return _(p);if(m)return clearTimeout(h),h=setTimeout(O,t),y(p)}return void 0===h&&(h=setTimeout(O,t)),d}return t=r(t)||0,s(n)&&(g=!!n.leading,c=(m="maxWait"in n)?i(r(n.maxWait)||0,t):c,v="trailing"in n?!!n.trailing:v),b.cancel=function(){void 0!==h&&clearTimeout(h),f=0,l=p=u=h=void 0},b.flush=function(){return void 0===h?d:S(a())},b}},218:function(e){e.exports=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}},5:function(e){e.exports=function(e){return null!=e&&"object"==typeof e}},448:function(e,t,n){var s=n(239),a=n(5);e.exports=function(e){return"symbol"==typeof e||a(e)&&"[object Symbol]"==s(e)}},771:function(e,t,n){var s=n(639);e.exports=function(){return s.Date.now()}},841:function(e,t,n){var s=n(561),a=n(218),r=n(448),i=/^[-+]0x[0-9a-f]+$/i,o=/^0b[01]+$/i,l=/^0o[0-7]+$/i,u=parseInt;e.exports=function(e){if("number"==typeof e)return e;if(r(e))return NaN;if(a(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=a(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=s(e);var n=o.test(e);return n||l.test(e)?u(e.slice(2),n?2:8):i.test(e)?NaN:+e}},42:function(e){"use strict";e.exports=FieldHolder},648:function(e){"use strict";e.exports=Injector},875:function(e){"use strict";e.exports=IsomorphicFetch},86:function(e){"use strict";e.exports=PropTypes},363:function(e){"use strict";e.exports=React},691:function(e){"use strict";e.exports=ReactDomClient},127:function(e){"use strict";e.exports=Reactstrap},820:function(e){"use strict";e.exports=classnames},754:function(e){"use strict";e.exports=i18n},311:function(e){"use strict";e.exports=jQuery}},t={};function n(s){var a=t[s];if(void 0!==a)return a.exports;var r=t[s]={exports:{}};return e[s](r,r.exports,n),r.exports}n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),function(){"use strict";n(121),n(217),n(293),n(163),n(812),n(838),n(274)}()}();