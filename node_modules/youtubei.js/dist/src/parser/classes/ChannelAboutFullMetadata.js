import { Log } from '../../utils/index.js';
import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Button from './Button.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
class ChannelAboutFullMetadata extends YTNode {
    constructor(data) {
        super();
        this.id = data.channelId;
        this.name = new Text(data.title);
        this.avatar = Thumbnail.fromResponse(data.avatar);
        this.canonical_channel_url = data.canonicalChannelUrl;
        this.primary_links = data.primaryLinks?.map((link) => ({
            endpoint: new NavigationEndpoint(link.navigationEndpoint),
            icon: Thumbnail.fromResponse(link.icon),
            title: new Text(link.title)
        })) ?? [];
        this.view_count = new Text(data.viewCountText);
        this.joined_date = new Text(data.joinedDateText);
        this.description = new Text(data.description);
        this.email_reveal = new NavigationEndpoint(data.onBusinessEmailRevealClickCommand);
        this.can_reveal_email = !data.signInForBusinessEmail;
        this.country = new Text(data.country);
        this.buttons = Parser.parseArray(data.actionButtons, Button);
    }
    /**
     * @deprecated
     * This will be removed in a future release.
     * Please use {@link ChannelAboutFullMetadata.view_count} instead.
     */
    get views() {
        Log.warnOnce(ChannelAboutFullMetadata.type, 'ChannelAboutFullMetadata#views is deprecated. Please use ChannelAboutFullMetadata#view_count instead.');
        return this.view_count;
    }
    /**
     * @deprecated
     * This will be removed in a future release.
     * Please use {@link ChannelAboutFullMetadata.joined_date} instead.
     */
    get joined() {
        Log.warnOnce(ChannelAboutFullMetadata.type, 'ChannelAboutFullMetadata#joined is deprecated. Please use ChannelAboutFullMetadata#joined_date instead.');
        return this.joined_date;
    }
}
ChannelAboutFullMetadata.type = 'ChannelAboutFullMetadata';
export default ChannelAboutFullMetadata;
