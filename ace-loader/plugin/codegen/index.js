/******/ (() => { // webpackBootstrap
/******/   "use strict";
/******/   var __webpack_modules__ = ({

/***/ 904:
/***/ ((__unused_webpack_module, exports) => {
/**
 * Copyright (c) Huawei Technologies Co., Ltd. 2020-2020. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setDomain = exports.getDomain = exports.Domain = void 0;
// all supported domain, developer should not modify the following enum Domain unless new domains are added
var Domain;
(function (Domain) {
    Domain[Domain["FA"] = 0] = "FA";
    Domain[Domain["FORM"] = 1] = "FORM";
    Domain[Domain["ETS"] = 2] = "ETS";
})(Domain || (Domain = {}));
exports.Domain = Domain;
/*
 *  conversion between different domains
 *  chosenDomain , default domain FA.
 */
let chosenDomain;
const setDomain = (domain) => {
    chosenDomain = domain;
};
exports.setDomain = setDomain;
const getDomain = () => {
    return chosenDomain !== null && chosenDomain !== void 0 ? chosenDomain : Domain.FA;
};
exports.getDomain = getDomain;


/***/ }),

/***/ 784:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Copyright (c) Huawei Technologies Co., Ltd. 2021-2021. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.errorMap = void 0;
exports.errorMap = new Map([
    ["fileError", "Visual file is damaged"],
    ["versionError", "Version number of visual file does not match"],
    ["modelError", "Visual model in visual file is damaged"],
    ["codegenError", "Codegen hml and css failed"],
]);


/***/ }),

/***/ 117:
/***/ ((__unused_webpack_module, exports) => {

/**
 * Copyright (c) Huawei Technologies Co., Ltd. 2021-2021. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ASTNode = void 0;
class ASTNode {
    accept(v) {
        return v.visit(this);
    }
}
exports.ASTNode = ASTNode;


/***/ }),

/***/ 862:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Copyright (c) Huawei Technologies Co., Ltd. 2020-2021. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Cache = void 0;
// There is no way pass value by reference with JS and TS, but object
// This Cache is used to store output code temporarily
class Cache {
    /**
     * @description: constructor for Cache
     * @param INDENT the IDENT string you want to use, such as 4 spaces
     */
    constructor(INDENT, offset = 0) {
        this.value = "";
        this.indent = offset;
        this.flag = true;
        this.INDENT = INDENT;
    }
    /**
     * @description: when flag is true, there should be some indents
     * @return void
     */
    indentOn() {
        this.flag = true;
    }
    /**
     * @description: when flag is false, there should be no indents
     * @return void
     */
    indentOff() {
        this.flag = false;
    }
    /**
     * @description: increase indent
     * @return void
     */
    incIndent() {
        this.indent++;
    }
    /**
     * @description: decrease indent
     * @return void
     */
    decIndent() {
        this.indent--;
    }
    /**
     * @description: check whether indent is LT 0
     * @return boolean value representing whether indent is LT 0
     */
    checkIndent() {
        return this.indent < 0;
    }
    /**
     * @description: get indent
     * @return indents
     */
    getIndents() {
        if (this.flag) {
            let indents = "";
            for (let i = 0; i < this.indent; i++) {
                indents += this.INDENT;
            }
            return indents;
        }
        else {
            return "";
        }
    }
    /**
     * @description: concat indents and HML/CSS code
     * @param strings means HML/CSS code
     * @return HML/CSS code after indents are set
     */
    concat(...strings) {
        this.value += this.getIndents();
        this.value = this.value.concat(...strings);
        return String(this.value);
    }
    /**
     * @description: concat indents and HML/CSS code
     * @return HML/CSS code
     */
    toString() {
        return this.value;
    }
}
exports.Cache = Cache;


/***/ }),

/***/ 243:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * @Copyright (c) Huawei Technologies Co., Ltd. 2020-2020. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Style = exports.Tag = void 0;
const ASTNode_1 = __webpack_require__(117);
class Tag extends ASTNode_1.ASTNode {
    /**
     * @description: constructor for Tag
     * @param tagName is name of component
     * @param attributes is attributes of component
     * @param content is child elements or innerHtml of component
     */
    constructor(tagName, attributes, content) {
        super();
        this.tagName = tagName;
        this.attributes = attributes;
        this.content = content;
    }
}
exports.Tag = Tag;
class Style extends ASTNode_1.ASTNode {
    /**
     * @description: constructor for Style
     * @param kind distinguishes id and class
     * @param name is name of id or class
     * @param content is style name and value of component
     */
    constructor(kind, name, content, mediaQuery) {
        super();
        this.mediaQuery = undefined;
        this.kind = kind;
        this.name = name;
        this.content = content;
        this.mediaQuery = mediaQuery;
    }
}
exports.Style = Style;


/***/ }),

/***/ 573:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * @Copyright (c) Huawei Technologies Co., Ltd. 2020-2021. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ASTNodeGenerator = void 0;
const AST_1 = __webpack_require__(243);
const Token_1 = __webpack_require__(334);
class ASTNodeGenerator {
    /**
     * @description: constructor for BridgeVisitor
     * @param reference is cache for Harmony FA code
     */
    constructor(reference) {
        this.cache = reference;
    }
    /**
     * @description: visitor mode dispatcher
     * @param t Node in AST
     */
    visit(t) {
        if (t instanceof AST_1.Tag) {
            this.genTag(t);
        }
        else if (t instanceof AST_1.Style) {
            this.genStyle(t);
        }
    }
    /**
     * @description: code generator
     * @param ref is cache for code
     * @return ast node generator
     */
    static getMethodGen(ref) {
        if (ASTNodeGenerator.instance === undefined) {
            ASTNodeGenerator.instance = new ASTNodeGenerator(ref);
        }
        else {
            ASTNodeGenerator.instance.setCache(ref);
        }
        return ASTNodeGenerator.instance;
    }
    /**
     * @description: cache for code
     * @param ref is cache for code
     * @return void
     */
    setCache(ref) {
        this.cache = ref;
    }
    /**
     * @description: parse Tag in AST and generate code for Tag in cache
     * @param t Tag in AST
     * @return void
     */
    genTag(t) {
        this.cache.concat(Token_1.TokenClass.TAG_START, t.tagName);
        this.cache.indentOff();
        t.attributes.forEach((value, key) => {
            let valueBK = "";
            for (const char of value) {
                valueBK += (char === "\"" ? "&quot;" : (char === "\n" ? "&#10;" : char));
            }
            this.cache.concat(Token_1.TokenClass.SPACE, key, Token_1.TokenClass.ASSIGN, Token_1.TokenClass.LQUOTE, valueBK, Token_1.TokenClass.RQUOTE);
        });
        if (t.content === null) {
            this.cache.concat(Token_1.TokenClass.EMPTY_TAG_END);
        }
        else {
            this.cache.concat(Token_1.TokenClass.TAG_END);
            if (typeof t.content === "string") {
                let contentBK = "";
                for (const char of t.content) {
                    contentBK += (char === "<" ? "&#60;" : char);
                }
                this.cache.concat(contentBK);
            }
            else if (t.content.length !== 0) {
                this.cache.concat(Token_1.TokenClass.NEW_LINE);
                this.cache.indentOn();
                this.cache.incIndent();
                t.content.forEach((tag) => {
                    tag.accept(this);
                    this.cache.indentOff();
                    this.cache.concat(Token_1.TokenClass.NEW_LINE);
                    this.cache.indentOn();
                });
                this.cache.decIndent();
                this.cache.indentOn();
            }
            this.cache.concat(Token_1.TokenClass.END_TAG_START, t.tagName, Token_1.TokenClass.TAG_END);
        }
    }
    /**
     * @description: parse Style in AST and generate code for Style in cache
     * @param s Style in AST
     * @return void
     */
    genStyle(s) {
        if (s.mediaQuery !== undefined) {
            this.cache.concat("@media");
            this.cache.indentOff();
            this.cache.concat(Token_1.TokenClass.SPACE, s.mediaQuery, Token_1.TokenClass.SPACE, Token_1.TokenClass.LBRA, Token_1.TokenClass.NEW_LINE);
            this.cache.indentOn();
            this.cache.incIndent();
        }
        if (s.kind === "IDStyle") {
            this.cache.concat(Token_1.TokenClass.ID_STYLE_START);
            this.cache.indentOff();
        }
        this.cache.concat(s.name, Token_1.TokenClass.SPACE, Token_1.TokenClass.LBRA, Token_1.TokenClass.NEW_LINE);
        this.cache.indentOn();
        this.cache.incIndent();
        s.content.forEach((value, key) => {
            this.cache.concat(key, Token_1.TokenClass.COLON, Token_1.TokenClass.SPACE, value, Token_1.TokenClass.SEMICOLON, Token_1.TokenClass.NEW_LINE);
        });
        this.cache.decIndent();
        this.cache.concat(Token_1.TokenClass.RBRA, Token_1.TokenClass.NEW_LINE);
        if (s.mediaQuery !== undefined) {
            this.cache.decIndent();
            this.cache.concat(Token_1.TokenClass.RBRA, Token_1.TokenClass.NEW_LINE);
        }
        this.cache.concat(Token_1.TokenClass.NEW_LINE);
    }
}
exports.ASTNodeGenerator = ASTNodeGenerator;
ASTNodeGenerator.instance = undefined;


/***/ }),

/***/ 844:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * @Copyright (c) Huawei Technologies Co., Ltd. 2020-2021. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CSSBridge = exports.HMLBridge = void 0;
const AST_1 = __webpack_require__(243);
const PropertySet_1 = __webpack_require__(571);
class HMLBridge {
    constructor() {
        this.errors = 0;
    }
    /**
     * @description: generate error message
     * @param msg is error message to show up in console
     */
    error(msg) {
        console.error("Code generating error: " + msg);
        this.errors += 1;
    }
    /**
     * @description: get error number
     * @return error number
     */
    getErrorCount() {
        return this.errors;
    }
    /**
     * @description: visitor guidance method for contents,
     * sort out incoming type and guide to matching code generator
     * @param visualModel is a object with Model or Container or CharUI primitive types to be generated
     * @return a code tree representing input object
     */
    visit(visualModel) {
        const attributes = new Map([["id", visualModel.id]]);
        let content = "";
        for (let [key, val] of visualModel.property) {
            if ((0, PropertySet_1.isAttribute)(key, visualModel.type)) {
                if (typeof val !== "string") {
                    val = JSON.stringify(val);
                }
                attributes.set(key, val);
            }
            else if ((0, PropertySet_1.isContent)(key)) {
                content = val;
            }
        }
        if (visualModel.children.length > 0) {
            content = [];
            for (const visualChild of visualModel.children) {
                content.push(visualChild.accept(this));
            }
        }
        const newTag = new AST_1.Tag(visualModel.type, attributes, content);
        if (attributes.get("id") === "wrapper") {
            return new AST_1.Tag("div", new Map(), [newTag]);
        }
        else {
            return newTag;
        }
    }
}
exports.HMLBridge = HMLBridge;
class CSSBridge {
    constructor() {
        this.errors = 0;
        this.styles = [];
    }
    /**
     * @description: generate error message
     * @param msg is error message to show up in console
     */
    error(msg) {
        console.error("Code generating error: " + msg);
        this.errors += 1;
    }
    /**
     * @description: get error number
     * @return error number
     */
    getErrorCount() {
        return this.errors;
    }
    /**
     * @description: code generator for ID Style, which is CSS type in AST in IR
     * @param visualModel is a object with CSS type to be generated
     * @return a code tree representing Harmony FA CSS code
     */
    genIDStyle(visualModel) {
        var _a;
        const getStyleMap = (property) => {
            const styles = new Map();
            for (const [key, value] of property) {
                if ((0, PropertySet_1.isStyle)(key, visualModel.type)) {
                    styles.set(key, value);
                }
            }
            return styles;
        };
        const styles = getStyleMap(visualModel.property);
        if (styles.size > 0) {
            this.styles.push(new AST_1.Style("IDStyle", visualModel.id, styles));
        }
        ((_a = visualModel.mediaProperty) !== null && _a !== void 0 ? _a : new Map()).forEach((value, key) => {
            const queryStyles = getStyleMap(value);
            if (queryStyles.size > 0) {
                this.styles.push(new AST_1.Style("IDStyle", visualModel.id, queryStyles, key));
            }
        });
        for (const visualChild of visualModel.children) {
            visualChild.accept(this);
        }
    }
    /**
     * @description: visitor guidance method for contents,
     * sort out incoming type and guide to matching code generator
     * @param obj is a object with Model or Container or CharUI primitive types to be generated
     * @return a code tree representing input object
     */
    visit(obj) {
        this.genIDStyle(obj);
        return this.styles;
    }
}
exports.CSSBridge = CSSBridge;


/***/ }),

/***/ 55:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * @Copyright (c) Huawei Technologies Co., Ltd. 2021-2021. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.genFACSS = exports.genFAHML = void 0;
const ASTNodeVisitor_1 = __webpack_require__(573);
const Cache_1 = __webpack_require__(862);
/**
 * @description: generate HML
 * @param t is Tag in AST
 * @return HML code
 */
function genFAHML(t) {
    const generator = ASTNodeVisitor_1.ASTNodeGenerator.getMethodGen(new Cache_1.Cache("    "));
    t.accept(generator);
    return generator.cache.toString();
}
exports.genFAHML = genFAHML;
/**
 * @description: generate CSS
 * @param t is Style in AST
 * @return CSS code
 */
function genFACSS(t) {
    const generator = ASTNodeVisitor_1.ASTNodeGenerator.getMethodGen(new Cache_1.Cache("    "));
    t.forEach((value) => {
        value.accept(generator);
    });
    return generator.cache.toString();
}
exports.genFACSS = genFACSS;


/***/ }),

/***/ 571:
/***/ ((__unused_webpack_module, exports) => {


/*
 * @Copyright (c) Huawei Technologies Co., Ltd. 2021-2021. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isEvent = exports.isData = exports.isUnknown = exports.isContent = exports.isAttribute = exports.isStyle = exports.styleMap = void 0;
// Unlike the property list in ComponentList, this one is only used to tell a property is a style or an attribute
const SizeStyle = ["width", "height", "min-width", "min-height", "max-width", "max-height"];
const FlexStyle = ["flex", "flex-grow", "flex-shrink", "flex-basis"];
const BackgroundImageStyle = ["background", "background-image", "background-size", "background-position", "background-repeat"];
const BackgroundStyle = ["background-color", ...BackgroundImageStyle];
const PositionStyle = ["position", "display", "top", "right", "bottom", "left"];
const PaddingStyle = ["padding", "padding-start", "padding-end", "padding-top", "padding-right", "padding-bottom", "padding-left"];
const MarginStyle = ["margin", "margin-start", "margin-end", "margin-top", "margin-right", "margin-bottom", "margin-left"];
const BorderStyle = ["border-width", "border-style", "border-color", "border-radius", "border-top-width",
    "border-top-style", "border-top-color", "border-top-left-radius", "border-right-width",
    "border-right-style", "border-right-color", "border-top-right-radius", "border-bottom-width", "border-bottom-style",
    "border-bottom-color", "border-bottom-right-radius", "border-left-width", "border-left-style", "border-left-color",
    "border-bottom-left-radius"];
const gridStyle = ["grid-template-columns", "grid-template-rows", "grid-row-start", "grid-row-end",
    "grid-column-start", "grid-column-end", "grid-gap", "grid-columns-gap", "grid-rows-gap"];
const DisplayStyle = ["display", "opacity", "visibility"];
const AtomicLayoutStyle = ["display-index", "flex-weight", "aspect-ratio"];
const commonStyle = [...SizeStyle, ...PaddingStyle, ...MarginStyle, ...BorderStyle, ...BackgroundStyle, ...DisplayStyle,
    ...FlexStyle, ...PositionStyle, ...AtomicLayoutStyle];
const FlexSizeStyle = ["flex-wrap", "justify-content", "align-items", "align-content"];
const FontStyle = ["font-size", "font-family", "font-style", "font-weight"];
const divStyle = ["flex-direction", "overflow", ...FlexSizeStyle, ...gridStyle];
const textStyle = ["text-align", "line-height", "text-decoration", "letter-spacing", "max-lines", "text-overflow",
    "allow-scale", "min-font-size", "max-font-size", "font-size-step", "prefer-font-sizes", "color", ...FontStyle];
const imageStyle = ["object-fit", "match-text-direction", "fit-original-size"];
const dividerStyle = ["stroke-width", "line-cap", "color"];
const spanStyle = ["allow-scale", "text-decoration", "color", ...FontStyle];
const buttonStyle = ["text-color", "allow-scale", "icon-width", "icon-height", "radius", ...FontStyle];
const switchStyle = ["texton-color", "textoff-color", "text-padding", "allow-scale", ...FontStyle];
const inputStyle = ["font-size", "font-family", "font-weight", "color", "placeholder-color", "allow-scale"];
const refreshStyle = ["progress-color"];
const chartStyle = ["stroke-width", "radius", "start-angle", "total-angle", "center-x", "center-y", "colors", "weights"];
const swiperStyle = ["indicator-color", "indicator-selected-color", "indicator-size", "indicator-top", "indicator-right",
    "indicator-bottom", "indicator-left"];
const pickerStyle = ["column-height", "text-color", "allow-scale", "letter-spacing", "text-decoration", "line-height", "opacity",
    ...FontStyle];
const pickerViewStyle = ["color", "font-size", "selected-color", "selected-font-size", "focus-color", "focus-font-size", "disappear-color", "disappear-font-size", "font-family"];
const sliderStyle = ["color", "selected-color", "block-color"];
const listStyle = ["flex-direction", "columns", "item-extent", "fade-color"];
const listItemStyle = ["column-span"];
const progressStyle = ["color", "stroke-width", "background-color", "secondary-color", "scale-width", "scale-number",
    "start-angle", "total-angle", "center-x", "center-y", "radius"];
const selectStyle = ["font-family"];
const optionStyle = ["color", "font-family", "allow-scale", "font-size", "font-weight", "text-decoration"];
const menuStyle = ["text-color", "allow-scale", "letter-spacing", ...FontStyle];
const videoStyle = ["object-fit"];
const clockStyle = ["font-family"];
exports.styleMap = new Map([
    ["common", new Set([...commonStyle])],
    ["div", new Set([...divStyle])],
    ["text", new Set([...textStyle])],
    ["image", new Set([...imageStyle])],
    ["span", new Set([...spanStyle])],
    ["input", new Set([...inputStyle])],
    ["button", new Set([...buttonStyle])],
    ["switch", new Set([...switchStyle])],
    ["refresh", new Set([...refreshStyle])],
    ["divider", new Set([...dividerStyle])],
    ["chart", new Set([...chartStyle])],
    ["picker", new Set([...pickerStyle])],
    ["picker-view", new Set([...pickerViewStyle])],
    ["slider", new Set([...sliderStyle])],
    ["swiper", new Set([...swiperStyle])],
    ["list", new Set([...listStyle])],
    ["list-item", new Set([...listItemStyle])],
    ["progress", new Set([...progressStyle])],
    ["select", new Set([...selectStyle])],
    ["menu", new Set([...menuStyle])],
    ["option", new Set([...optionStyle])],
    ["video", new Set([...videoStyle])],
    ["clock", new Set([...clockStyle])],
]);
const commonAttribute = ["id", "ref", "disabled", "focusable", "data", "if", "for"];
const imageAttribute = ["src", "alt"];
const buttonAttribute = ["type", "value", "icon", "waiting"];
const switchAttribute = ["checked", "showtext", "texton", "textoff"];
const inputAttribute = ["type", "checked", "name", "value", "placeholder", "maxlength", "enterkeytype", "headericon"];
const refreshAttribute = ["offset", "refreshing", "type", "lasttime", "friction"];
const optionAttribute = ["value", "selected", "icon"];
const chartAttribute = ["type", "percent", "datasets", "options"];
const swiperAttribute = ["index", "autoplay", "interval", "indicator", "digital", "indicatordisabled", "loop", "duration", "vertical"];
const pickerAttribute = ["type", "range", "selected", "start", "end", "lunar", "lunarSwitch", "columns", "hours", "containSecond", "value", "vibrate"];
const pickerViewAttribute = ["type", "range", "selected", "start", "end", "lunar", "lunarSwitch", "columns", "hours",
    "containSecond", "indicatorprefix", "indicatorsuffix", "vibrate"];
const sliderAttribute = ["min", "max", "step", "showtips", "showsteps", "mode", "value"];
const menuAttribute = ["target", "title", "type"];
const clockAttribute = ["clockconfig", "showdigit", "hourswest"];
const dividerAttribute = ["vertical"];
const listAttribute = ["scrollpage", "cachedcount", "scrollbar", "scrolleffect", "shapemode", "indexer", "itemscale",
    "itemcenter", "updateeffect", "scrollvibrate", "initialindex", "initialoffset"];
const listItemAttribute = ["type", "primary", "section", "sticky", "stickyradius", "clickeffect"];
const progressAttribute = ["type", "percent", "secondarypercent", "clockwise"];
const badgeAttribute = ["placement", "count", "visible", "maxcount", "config", "label"];
const videoAttribute = ["muted", "src", "autoplay", "poster", "controls", "loop", "starttime", "direction", "speed"];
const tabsAttribute = ["index", "vertical"];
const tabBarAttribute = ["mode"];
const tabContentAttribute = ["scrollable"];
const commonEvent = ["ontouchstart", "ontouchmove", "ontouchcancel", "ontouchend", "onclick", "onlongpress", "onfocus",
    "onblur", "onkey", "onswipe"];
const imageEvent = ["oncomplete", "onerror"];
const selectEvent = ["onchange"];
const inputEvent = ["onchange", "onenterkeyclick"];
const refreshEvent = ["onrefresh", "onpulldown"];
const listEvent = ["onindexerchange", "onscroll", "onscrollbottom", "onscrolltop", "onscrollend",
    "onscrolltouchup", "onrequestitem"];
const listItemEvent = ["onsticky"];
const swiperEvent = ["onchange", "onrotation"];
const menuEvent = ["onselected", "oncancel"];
const pickerEvent = ["oncolumnchange", "onchange", "oncancel"];
const pickerViewEvent = ["oncolumnchange", "onchange"];
const videoEvent = ["onprepared", "onstart", "onpause", "onfinish", "onerror", "onseeking", "onseeked",
    "ontimeupdate", "onfullscreenchange", "onstop"];
const tabsEvent = ["onchange"];
const switchEvent = ["onchange"];
const dialogEvent = ["oncancel"];
const dataMap = new Map([
    ["common", new Set([...commonAttribute])],
    ["image", new Set([...imageAttribute])],
    ["button", new Set([...buttonAttribute])],
    ["refresh", new Set([...refreshAttribute])],
    ["input", new Set([...inputAttribute])],
    ["switch", new Set([...switchAttribute])],
    ["option", new Set([...optionAttribute])],
    ["chart", new Set([...chartAttribute])],
    ["picker", new Set([...pickerAttribute])],
    ["picker-view", new Set([...pickerViewAttribute])],
    ["slider", new Set([...sliderAttribute])],
    ["divider", new Set([...dividerAttribute])],
    ["list", new Set([...listAttribute])],
    ["list-item", new Set([...listItemAttribute])],
    ["swiper", new Set([...swiperAttribute])],
    ["progress", new Set([...progressAttribute])],
    ["menu", new Set([...menuAttribute])],
    ["clock", new Set([...clockAttribute])],
    ["badge", new Set([...badgeAttribute])],
    ["video", new Set([...videoAttribute])],
    ["tabs", new Set([...tabsAttribute])],
    ["tab-bar", new Set([...tabBarAttribute])],
    ["tab-content", new Set([...tabContentAttribute])],
]);
const eventMap = new Map([
    ["common", new Set([...commonEvent])],
    ["image", new Set([...imageEvent])],
    ["input", new Set([...inputEvent])],
    ["select", new Set([...selectEvent])],
    ["refresh", new Set([...refreshEvent])],
    ["swiper", new Set([...swiperEvent])],
    ["list", new Set([...listEvent])],
    ["list-item", new Set([...listItemEvent])],
    ["menu", new Set([...menuEvent])],
    ["picker", new Set([...pickerEvent])],
    ["picker-view", new Set([...pickerViewEvent])],
    ["video", new Set([...videoEvent])],
    ["tabs", new Set([...tabsEvent])],
    ["switch", new Set([...switchEvent])],
    ["dialog", new Set([...dialogEvent])],
]);
/**
 * The hasKey() method returns a boolean indicating whether an tag exists in a specified map
 * and an element named k with the specified value exists in a Set object or not
 * @param k key of set
 * @param map specified map, such as styleMap, etc.
 * @param tagName visual model type
 * @return true if k exists in specified set object
 */
function hasKey(k, map, tagName) {
    const set = map.get(tagName);
    if (set !== undefined) {
        return set.has(k);
    }
    return false;
}
function isStyle(s, tagName) {
    return hasKey(s, exports.styleMap, "common") || hasKey(s, exports.styleMap, tagName);
}
exports.isStyle = isStyle;
function isAttribute(s, tagName) {
    return isData(s, tagName) || isEvent(s, tagName);
}
exports.isAttribute = isAttribute;
function isContent(s) {
    return s === "content";
}
exports.isContent = isContent;
function isUnknown(s, tagName) {
    return !isStyle(s, tagName) && !isAttribute(s, tagName);
}
exports.isUnknown = isUnknown;
function isData(s, tagName) {
    return hasKey(s, dataMap, "common") || hasKey(s, dataMap, tagName);
}
exports.isData = isData;
function isEvent(s, tagName) {
    return hasKey(s, eventMap, "common") || hasKey(s, eventMap, tagName);
}
exports.isEvent = isEvent;


/***/ }),

/***/ 334:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Copyright (c) Huawei Technologies Co., Ltd. 2020-2020. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TokenClass = void 0;
var TokenClass;
(function (TokenClass) {
    TokenClass[TokenClass["IDENTIFIER"] = 0] = "IDENTIFIER";
    // literals
    TokenClass[TokenClass["STRING_LITERAL"] = 1] = "STRING_LITERAL";
    TokenClass[TokenClass["NUMBER"] = 2] = "NUMBER";
    TokenClass[TokenClass["CHARACTER"] = 3] = "CHARACTER";
    // special tokens
    TokenClass[TokenClass["EOF"] = 4] = "EOF";
    TokenClass[TokenClass["INVALID"] = 5] = "INVALID";
    TokenClass["EMPTY_DATA"] = "empty";
    TokenClass["ASSIGN"] = "=";
    // Escape character
    TokenClass["NEW_LINE"] = "\n";
    TokenClass["CARRIAGE_RETURN"] = "\r";
    TokenClass["INDENT"] = "    ";
    // delimiters
    TokenClass["SPACE"] = " ";
    TokenClass["LQUOTE"] = "\"";
    TokenClass["RQUOTE"] = "\"";
    TokenClass["TAG_START"] = "<";
    TokenClass["TAG_END"] = ">";
    TokenClass["EMPTY_TAG_END"] = "/>";
    TokenClass["END_TAG_START"] = "</";
    TokenClass["ID_STYLE_START"] = "#";
    TokenClass["CLASS_STYLE_START"] = ".";
    TokenClass["LBRA"] = "{";
    TokenClass["RBRA"] = "}";
    TokenClass["SEMICOLON"] = ";";
    TokenClass["COLON"] = ":";
})(TokenClass = exports.TokenClass || (exports.TokenClass = {}));


/***/ }),

/***/ 282:
/***/ ((__unused_webpack_module, exports) => {


/*
 * @Copyright (c) Huawei Technologies Co., Ltd. 2020-2021. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TagTypeMap = void 0;
/**
 * <h1>Semantic Model</h1>
 * This is the Domain Specific Model for FA
 *
 * @author  LowCode Group
 * @version 1.0
 * @since   2020-08-27
 */
const BaseSchema = {
    id: "id",
    tagName: "text",
    attributes: "kv",
    idStyle: "kv",
    type: "kind",
    accept: "accept",
};
const BaseStyle = {
    kind: "kind",
    content: "kv",
    accept: "accept",
};
exports.TagTypeMap = new Map([
    ["button", "TextContent"],
    ["span", "TextContent"],
    ["divider", "TextContent"],
    ["picker", "TextContent"],
    ["option", "TextContent"],
    ["clock", "TextContent"],
    ["image", "Base"],
    ["input", "Base"],
    ["chart", "Base"],
    ["slider", "Base"],
    ["progress", "Base"],
    ["text", "Text"],
    ["div", "Container"],
    ["list", "Container"],
    ["list-item", "Container"],
    ["list-item-group", "Container"],
    ["refresh", "Container"],
    ["dialog", "Container"],
    ["stack", "Container"],
    ["menu", "Container"],
    ["select", "Container"],
    ["tabs", "Container"],
    ["tab-bar", "Container"],
    ["tab-content", "Container"],
]);


/***/ }),

/***/ 207:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.formManager = void 0;
/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2021-2021. All rights reserved.
 */
const Instance_1 = __webpack_require__(891);
const FormModel_1 = __webpack_require__(945);
exports.formManager = {
    /**
     *
     * remove a key-value in data node
     * @param key the entry to remove
     */
    removeData(key) {
        this.getFormModel().data.delete(key);
    },
    /**
     *
     * add a key-value
     * @param data
     */
    addData(data) {
        if (data instanceof Map) {
            data.forEach((value, key) => {
                this.getFormModel().data.set(key, value);
            });
        }
        else {
            Object.keys(data).forEach(key => {
                this.getFormModel().data.set(key, data[key]);
            });
        }
    },
    /**
     * update all the data
     * @param data
     */
    updateAllData(data) {
        this.getFormModel().data.clear();
        this.addData(data);
    },
    /**
     *
     * add an action in action node
     * @param actionName
     * @param actionType
     * @param params
     * @param want want params
     */
    addAction(actionName, actionType, params, want) {
        const paramMap = new Map();
        if (params !== undefined) {
            Object.keys(params).forEach(key => {
                paramMap.set(key, params[key]);
            });
        }
        const wantMap = new Map();
        if (want !== undefined) {
            Object.keys(want).forEach(key => {
                wantMap.set(key, want[key]);
            });
        }
        this.getFormModel().actions.set(actionName, new FormModel_1.FormAction(actionType, paramMap, wantMap));
    },
    /**
     * update all the actions
     * @param map： the new actions to be updated
     */
    updateAllActions(map) {
        this.getFormModel().actions.clear();
        map.forEach((value, key) => {
            const params = value.params === undefined ? value.params : this.objectToMap(value.params);
            const want = value.want === undefined ? value.want : this.objectToMap(value.want);
            const action = new FormModel_1.FormAction(value.actionType, params, want);
            this.getFormModel().actions.set(key, action);
        });
    },
    /**
     *
     * remove an action
     * @param actionName
     */
    removeAction(actionName) {
        this.getFormModel().actions.delete(actionName);
    },
    /**
     *
     * add params in an action
     * @param actionName
     * @param params
     */
    addActionParams(actionName, params) {
        var _a, _b;
        const action = (_a = this.getFormModel().actions.get(actionName)) !== null && _a !== void 0 ? _a : new FormModel_1.FormAction(actionName);
        const actionParams = (_b = action.params) !== null && _b !== void 0 ? _b : new Map();
        Object.keys(params).forEach(key => {
            actionParams.set(key, params[key]);
        });
        action.params = actionParams;
    },
    /**
     *
     * remove params in an action
     * @param actionName
     * @param paramKey entry to remove
     */
    removeActionParam(actionName, paramKey) {
        var _a;
        const action = this.getFormModel().actions.get(actionName);
        (_a = action === null || action === void 0 ? void 0 : action.params) === null || _a === void 0 ? void 0 : _a.delete(paramKey);
    },
    /**
     * get the whole node
     */
    getFormModel() {
        return (0, Instance_1.getInstance)().formData;
    },
    /**
     * codegen formModel to json
     */
    codegenToJson: function () {
        const model = (0, Instance_1.getInstance)().formData;
        const data = this.mapToObject(model.data);
        const retObj = { actions: {}, data: {} };
        retObj.data = data;
        model.actions.forEach((value, key) => {
            retObj.actions[key] = {};
            retObj.actions[key].action = value.action;
            if (value.params instanceof Map && value.params.size > 0) {
                retObj.actions[key].params = this.mapToObject(value.params);
            }
            if (value.want instanceof Map && value.want.size > 0) {
                retObj.actions[key].want = this.mapToObject(value.want);
            }
        });
        return JSON.stringify(retObj, null, 4);
    },
    /**
     * clear all datas and actions in model
     */
    clear() {
        (0, Instance_1.getInstance)().formData.data.clear();
        (0, Instance_1.getInstance)().formData.actions.clear();
    },
    /**
     *
     * convert a map to an object
     * @param sourceMap
     */
    mapToObject(sourceMap) {
        if (sourceMap === undefined) {
            return {};
        }
        return Array.from(sourceMap.entries()).reduce((main, [key, value]) => (Object.assign(Object.assign({}, main), { [key]: value })), {});
    },
    /**
     * convert an object to map
     */
    objectToMap(sourceObj) {
        const map = new Map();
        Object.keys(sourceObj).forEach((value, index) => {
            map.set(value, sourceObj[value]);
        });
        return map;
    },
};


/***/ }),

/***/ 945:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2021-2021. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FormAction = exports.FormModel = void 0;
class FormModel {
    constructor() {
        this.data = new Map();
        this.actions = new Map();
    }
}
exports.FormModel = FormModel;
class FormAction {
    constructor(action, params, want) {
        this.action = action;
        this.params = params;
        this.want = want;
    }
}
exports.FormAction = FormAction;


/***/ }),

/***/ 509:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deserializeForVersion1 = exports.rootToVisualContent = exports.visualToRootContent = exports.serializeForVersion1 = void 0;
/**
 * Copyright (c) Huawei Technologies Co., Ltd. 2021-2021. All rights reserved.
 */
const Instance_1 = __webpack_require__(891);
const VisualModel_1 = __webpack_require__(933);
const PropertySet_1 = __webpack_require__(571);
const AST_1 = __webpack_require__(282);
const FormModel_1 = __webpack_require__(945);
const Serialization_1 = __webpack_require__(977);
// map for extra data. key: name of extra data; value: extra data
const extraData = new Map();
/**
 * save old voisual model(version 1)
 * @return {string}
 */
function serializeForVersion1(model) {
    extraData.set("textMap", new Map());
    const content = convertToVersion1AST(model !== null && model !== void 0 ? model : (0, Instance_1.getInstance)().visualModel);
    return JSON.stringify({
        VisualVersion: "1",
        content: JSON.stringify(content),
        extraData: JSON.stringify(convert(extraData)),
    });
}
exports.serializeForVersion1 = serializeForVersion1;
/**
 * convert visual files to root files
 *
 * @param visualInput source input content
 */
function visualToRootContent(visualInput) {
    try {
        const instance = JSON.parse(visualInput, Serialization_1.reviver);
        return serializeForVersion1(instance.visualModel);
    }
    catch (e) {
        console.error("convert visual model to root model failed");
    }
    return visualInput;
}
exports.visualToRootContent = visualToRootContent;
/**
 * convert root files to visual files
 * @param rootInput input source content
 */
function rootToVisualContent(rootInput) {
    const visualFile = JSON.parse(rootInput);
    const rootModel = JSON.parse(visualFile.content);
    let extraData = "[\"$$map\",[\"textMap\",[\"$$map\"]]]";
    if (typeof visualFile.extraData === "string") {
        extraData = JSON.parse(visualFile.extraData);
    }
    const visualModel = convertFromVersion1AST(rootModel, recover(extraData));
    if (!visualModel.property.has("flex-direction")) {
        visualModel.property.set("flex-direction", "column");
    }
    return JSON.stringify({
        document: { VisualVersion: "12", type: "FA" },
        visualModel: visualModel,
        formData: new FormModel_1.FormModel(),
    }, Serialization_1.replacer);
}
exports.rootToVisualContent = rootToVisualContent;
/**
 * convert visualModel version12 to version1
 * @param visualModel
 * @return {HmlNode}
 */
function convertToVersion1AST(visualModel) {
    const attributes = Array.from(visualModel.property).filter(value => (0, PropertySet_1.isAttribute)(value[0], visualModel.type));
    attributes.push(["id", visualModel.id]);
    const idStyle = Array.from(visualModel.property).filter(value => (0, PropertySet_1.isStyle)(value[0], visualModel.type));
    let type = AST_1.TagTypeMap.get(visualModel.type);
    if (type === undefined) {
        type = "Base";
    }
    let content = visualModel.property.has("content")
        ? visualModel.property.get("content") : [];
    if (visualModel.children.length > 0) {
        if (typeof content === "string") {
            const textMap = extraData.get("textMap");
            if (textMap instanceof Map) {
                textMap.set(visualModel.id, content);
            }
        }
        content = visualModel.children.map(value => convertToVersion1AST(value));
    }
    return {
        id: visualModel.id,
        tagName: visualModel.type,
        attributes: attributes,
        idStyle: idStyle,
        type: type,
        content: content,
    };
}
/**
 * read old voisual model(version 1)
 * @param input
 */
function deserializeForVersion1(input) {
    try {
        const visualFile = JSON.parse(input);
        const rootModel = JSON.parse(visualFile.content);
        let extraData = "[\"$$map\",[\"textMap\",[\"$$map\"]]]";
        if (typeof visualFile.extraData === "string") {
            extraData = JSON.parse(visualFile.extraData);
        }
        (0, Instance_1.getInstance)().visualModel = convertFromVersion1AST(rootModel, recover(extraData));
        if (!(0, Instance_1.getInstance)().visualModel.property.has("flex-direction")) {
            (0, Instance_1.getInstance)().visualModel.property.set("flex-direction", "column");
        }
    }
    catch (e) {
        console.error("convert error");
    }
}
exports.deserializeForVersion1 = deserializeForVersion1;
/**
 * convert visualModel version1 to version12
 * @param node
 * @return {VisualModel}
 */
function convertFromVersion1AST(node, extraData) {
    let textContent;
    if (extraData instanceof Map) {
        const textMap = extraData.get("textMap");
        if (textMap instanceof Map) {
            textContent = textMap.get(node.id);
        }
    }
    const res = new VisualModel_1.VisualModel({
        id: node.id,
        type: node.tagName,
        property: new Map([...node.attributes, ...node.idStyle]),
    });
    if (typeof textContent === "string") {
        res.property.set("content", textContent);
    }
    res.property.delete("id");
    if (typeof node.content === "string") {
        res.property.set("content", node.content);
    }
    if (Array.isArray(node.content)) {
        res.children = node.content.map(child => convertFromVersion1AST(child, extraData));
    }
    return res;
}
/**
 * @description: recover extraData array
 * @param {string} input extraData array
 * @return {DataType} extraData
 */
function recover(input) {
    if (input instanceof Array && input.length > 0) {
        if (input[0] === "$$map") {
            input.shift();
            const res = new Map();
            for (const [key, value] of input) {
                res.set(key, recover(value));
            }
            return res;
        }
    }
    return input;
}
/**
 * @description: convert input extraData to array
 * @param {string} input extraData
 * @return {any} extraData array
 */
function convert(input) {
    if (input instanceof Map) {
        const res = ["$$map"];
        for (const [key, value] of input) {
            res.push([key, convert(value)]);
        }
        return res;
    }
    return input;
}


/***/ }),

/***/ 891:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setInstance = exports.getInstance = void 0;
/**
 * Copyright (c) Huawei Technologies Co., Ltd. 2021-2021. All rights reserved.
 */
const VisualModel_1 = __webpack_require__(933);
const FormModel_1 = __webpack_require__(945);
const Domain_1 = __webpack_require__(904);
const instance = {
    document: { VisualVersion: "12", type: "FA" },
    visualModel: new VisualModel_1.VisualModel({ type: "div", id: "wrapper" }),
    formData: new FormModel_1.FormModel(),
};
/**
 * instance is unique during the entire web page lifecycle
 */
function getInstance() {
    return instance;
}
exports.getInstance = getInstance;
/**
 * replace instance
 * @param ins
 */
function setInstance(ins) {
    for (const key in instance) {
        if (Object.prototype.hasOwnProperty.call(ins, key)) {
            instance[key] = ins[key];
        }
    }
    const visualType = instance.document.type;
    (0, Domain_1.setDomain)(visualType === "ETS"
        ? Domain_1.Domain.ETS : (visualType === "FORM" ? Domain_1.Domain.FORM : Domain_1.Domain.FA));
}
exports.setInstance = setInstance;


/***/ }),

/***/ 977:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.reviver = exports.replacer = exports.deserialize = exports.serialize = void 0;
/**
 * Copyright (c) Huawei Technologies Co., Ltd. 2021-2021. All rights reserved.
 */
const VisualModel_1 = __webpack_require__(933);
const Instance_1 = __webpack_require__(891);
const Compatibility_1 = __webpack_require__(509);
/**
 * @description: convert JsonModel to Json
 * @return model in json format
 */
function serialize(version, input) {
    if (version === 1) {
        return (0, Compatibility_1.serializeForVersion1)(input);
    }
    return JSON.stringify(input !== null && input !== void 0 ? input : (0, Instance_1.getInstance)(), replacer, 4);
}
exports.serialize = serialize;
/**
 * @description: convert Json to JsonModel
 * @return model in json format
 */
function deserialize(json) {
    if (JSON.parse(json).VisualVersion === "1") {
        return (0, Compatibility_1.deserializeForVersion1)(json);
    }
    const ins = JSON.parse(json, reviver);
    (0, Instance_1.setInstance)(ins);
}
exports.deserialize = deserialize;
/**
 * json replacer, turn any class into string
 * @param key
 * @param value
 */
function replacer(key, value) {
    if (value instanceof Map) {
        return {
            dataType: "Map",
            value: Object.fromEntries(value.entries()),
        };
    }
    else if (value instanceof Set) {
        return {
            dataType: "Set",
            value: Array.from(value.entries()),
        };
    }
    else if (value instanceof VisualModel_1.VisualModel) {
        const visualObj = new VisualModel_1.VisualModel({ type: "none" });
        const res = {};
        for (const visualKey in visualObj) {
            if (Object.prototype.hasOwnProperty.call(value, visualKey)) {
                res[visualKey] = value[visualKey];
            }
        }
        return {
            dataType: "VisualModel",
            value: res,
        };
    }
    else {
        return value;
    }
}
exports.replacer = replacer;
/**
 * json reviver, true magic, replace plain json to classes
 * @param key
 * @param value
 */
function reviver(key, value) {
    if (typeof value === "object" && value !== null && value !== undefined) {
        if (value.dataType === "Map") {
            return new Map(Object.entries(value.value));
        }
        else if (value.dataType === "Set") {
            return new Set(value.value);
        }
        else if (value.dataType === "VisualModel") {
            const res = new VisualModel_1.VisualModel({ type: "" });
            Object.assign(res, value.value);
            value = res;
        }
    }
    return value;
}
exports.reviver = reviver;


/***/ }),

/***/ 933:
/***/ ((__unused_webpack_module, exports) => {


/*
 * @Copyright (c) Huawei Technologies Co., Ltd. 2021-2021. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VisualModel = void 0;
// sometimes the type of VisualModel would be add a suffix to distinguish origin component of GrapesJs
// e.g. button-visual
const typeSuffix = "-visual";
class VisualModel {
    constructor(obj) {
        this.mediaProperty = undefined;
        this.property = (obj.property !== undefined) ? obj.property : new Map();
        this.children = (obj.children !== undefined) ? obj.children : [];
        if (obj.type === "wrapper") {
            this.id = "wrapper";
            this.type = "div";
            return;
        }
        if (obj.type.endsWith(typeSuffix)) {
            obj.type = obj.type.substring(0, obj.type.length - typeSuffix.length);
        }
        this.id = (obj.id !== undefined) ? obj.id : "";
        this.type = obj.type;
    }
    accept(v) {
        return v.visit(this);
    }
}
exports.VisualModel = VisualModel;


/***/ })

/******/   });
/************************************************************************/
/******/   // The module cache
/******/   var __webpack_module_cache__ = {};
/******/
/******/   // The require function
/******/   function __webpack_require__(moduleId) {
/******/     // Check if module is in cache
/******/     var cachedModule = __webpack_module_cache__[moduleId];
/******/     if (cachedModule !== undefined) {
/******/       return cachedModule.exports;
/******/     }
/******/     // Create a new module (and put it into the cache)
/******/     var module = __webpack_module_cache__[moduleId] = {
/******/       // no module.id needed
/******/       // no module.loaded needed
/******/       exports: {}
/******/     };
/******/ 
/******/     // Execute the module function
/******/     __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/     // Return the exports of the module
/******/     return module.exports;
/******/   }
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * Copyright (c) Huawei Technologies Co., Ltd. 2021-2021. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const errorMap_1 = __webpack_require__(784);
const Instance_1 = __webpack_require__(891);
const Serialization_1 = __webpack_require__(977);
const BridgeVisitor_1 = __webpack_require__(844);
const HmlCssCodeGenerator_1 = __webpack_require__(55);
const FormManager_1 = __webpack_require__(207);
const visualVersion = 12;
/**
 * @description: codegen hml and css according to code in visual file
 * @param source is code in visual file
 * @return object of hmlCSS, errorType and errorMessage
 */
function genHmlAndCss(source) {
    const retObj = {
        hmlCss: {
            hml: "",
            css: "",
            json: "",
        },
        errorType: "",
        errorMessage: "",
    };
    try {
        // parse source code in visual file
        (0, Serialization_1.deserialize)(source);
        const destVisualVersion = (0, Instance_1.getInstance)().document.VisualVersion;
        const regex = /^([1-9]+[0-9]*)$/;
        if (destVisualVersion === undefined) {
            retObj.errorType = "versionError";
        }
        else {
            const expression = destVisualVersion.match(regex);
            if (expression === null || parseInt(expression[1]) > visualVersion) {
                retObj.errorType = "versionError";
            }
        }
        try {
            const model = (0, Instance_1.getInstance)().visualModel;
            const hmlCss = emitFA(model);
            if (hmlCss.hml === "error" || hmlCss.css === "error") {
                retObj.errorType = "codegenError";
            }
            retObj.hmlCss = hmlCss;
            if ((0, Instance_1.getInstance)().document.type === "FORM") {
                retObj.hmlCss.json = FormManager_1.formManager.codegenToJson();
            }
        }
        catch (e) {
            retObj.errorType = "modelError";
        }
    }
    catch (e) {
        retObj.errorType = "fileError";
    }
    if (retObj.errorType !== "") {
        retObj.errorMessage = errorMap_1.errorMap.get(retObj.errorType);
        retObj.hmlCss.hml = "";
        retObj.hmlCss.css = "";
    }
    return retObj;
}
/**
 * @description: output hml and css source code of the model
 */
function emitFA(rootModel) {
    const hmlCss = {
        hml: "",
        css: "",
        json: "",
    };
    // generate hml
    const hmlVisitor = new BridgeVisitor_1.HMLBridge();
    const ast = rootModel.accept(hmlVisitor);
    const hmlRes = (0, HmlCssCodeGenerator_1.genFAHML)(ast);
    if (hmlVisitor.getErrorCount() > 0) {
        hmlCss.hml = "error";
    }
    else {
        hmlCss.hml = hmlRes;
    }
    // generate css
    const cssVisitor = new BridgeVisitor_1.CSSBridge();
    const styles = rootModel.accept(cssVisitor);
    const cssRes = (0, HmlCssCodeGenerator_1.genFACSS)(styles);
    if (cssVisitor.getErrorCount() > 0) {
        hmlCss.css = "error";
    }
    else {
        hmlCss.css = cssRes;
    }
    return hmlCss;
}
exports.genHmlAndCss = genHmlAndCss;

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
