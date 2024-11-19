import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import MetadataBadge from './MetadataBadge.js';
import Menu from './menus/Menu.js';
import Text from './misc/Text.js';
class VideoPrimaryInfo extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        if (Reflect.has(data, 'superTitleLink')) {
            this.super_title_link = new Text(data.superTitleLink);
        }
        this.view_count = new Text(data.viewCount?.videoViewCountRenderer?.viewCount);
        this.short_view_count = new Text(data.viewCount?.videoViewCountRenderer?.shortViewCount);
        this.badges = Parser.parseArray(data.badges, MetadataBadge);
        this.published = new Text(data.dateText);
        this.relative_date = new Text(data.relativeDateText);
        this.menu = Parser.parseItem(data.videoActions, Menu);
    }
}
VideoPrimaryInfo.type = 'VideoPrimaryInfo';
export default VideoPrimaryInfo;
