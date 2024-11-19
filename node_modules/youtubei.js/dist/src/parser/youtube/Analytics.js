var _Analytics_page;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { Parser } from '../index.js';
import Element from '../classes/Element.js';
class Analytics {
    constructor(response) {
        _Analytics_page.set(this, void 0);
        __classPrivateFieldSet(this, _Analytics_page, Parser.parseResponse(response.data), "f");
        this.sections = __classPrivateFieldGet(this, _Analytics_page, "f").contents_memo?.getType(Element).map((el) => el.model).flatMap((el) => !el ? [] : el);
    }
    get page() {
        return __classPrivateFieldGet(this, _Analytics_page, "f");
    }
}
_Analytics_page = new WeakMap();
export default Analytics;
