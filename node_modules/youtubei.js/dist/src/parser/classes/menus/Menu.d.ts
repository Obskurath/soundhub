import type { ObservedArray } from '../../helpers.js';
import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
import Button from '../Button.js';
import ButtonView from '../ButtonView.js';
import SegmentedLikeDislikeButtonView from '../SegmentedLikeDislikeButtonView.js';
export default class Menu extends YTNode {
    static type: string;
    items: ObservedArray<YTNode>;
    top_level_buttons: ObservedArray<Button | ButtonView | SegmentedLikeDislikeButtonView>;
    label?: string;
    constructor(data: RawNode);
    get contents(): ObservedArray<YTNode>;
}
