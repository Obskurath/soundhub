var _Kids_session;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { Parser } from '../../parser/index.js';
import { Channel, HomeFeed, Search, VideoInfo } from '../../parser/ytkids/index.js';
import { InnertubeError, generateRandomString } from '../../utils/Utils.js';
import KidsBlocklistPickerItem from '../../parser/classes/ytkids/KidsBlocklistPickerItem.js';
import { BrowseEndpoint, NextEndpoint, PlayerEndpoint, SearchEndpoint } from '../endpoints/index.js';
import { BlocklistPickerEndpoint } from '../endpoints/kids/index.js';
class Kids {
    constructor(session) {
        _Kids_session.set(this, void 0);
        __classPrivateFieldSet(this, _Kids_session, session, "f");
    }
    /**
     * Searches the given query.
     * @param query - The query.
     */
    async search(query) {
        const response = await __classPrivateFieldGet(this, _Kids_session, "f").actions.execute(SearchEndpoint.PATH, SearchEndpoint.build({ client: 'YTKIDS', query }));
        return new Search(__classPrivateFieldGet(this, _Kids_session, "f").actions, response);
    }
    /**
     * Retrieves video info.
     * @param video_id - The video id.
     */
    async getInfo(video_id) {
        const player_payload = PlayerEndpoint.build({
            sts: __classPrivateFieldGet(this, _Kids_session, "f").player?.sts,
            client: 'YTKIDS',
            video_id
        });
        const next_payload = NextEndpoint.build({
            video_id,
            client: 'YTKIDS'
        });
        const player_response = __classPrivateFieldGet(this, _Kids_session, "f").actions.execute(PlayerEndpoint.PATH, player_payload);
        const next_response = __classPrivateFieldGet(this, _Kids_session, "f").actions.execute(NextEndpoint.PATH, next_payload);
        const response = await Promise.all([player_response, next_response]);
        const cpn = generateRandomString(16);
        return new VideoInfo(response, __classPrivateFieldGet(this, _Kids_session, "f").actions, cpn);
    }
    /**
     * Retrieves the contents of the given channel.
    * @param channel_id - The channel id.
     */
    async getChannel(channel_id) {
        const response = await __classPrivateFieldGet(this, _Kids_session, "f").actions.execute(BrowseEndpoint.PATH, BrowseEndpoint.build({
            browse_id: channel_id,
            client: 'YTKIDS'
        }));
        return new Channel(__classPrivateFieldGet(this, _Kids_session, "f").actions, response);
    }
    /**
     * Retrieves the home feed.
     */
    async getHomeFeed() {
        const response = await __classPrivateFieldGet(this, _Kids_session, "f").actions.execute(BrowseEndpoint.PATH, BrowseEndpoint.build({
            browse_id: 'FEkids_home',
            client: 'YTKIDS'
        }));
        return new HomeFeed(__classPrivateFieldGet(this, _Kids_session, "f").actions, response);
    }
    /**
     * Retrieves the list of supervised accounts that the signed-in user has
     * access to, and blocks the given channel for each of them.
     * @param channel_id - The channel id to block.
     * @returns A list of API responses.
     */
    async blockChannel(channel_id) {
        if (!__classPrivateFieldGet(this, _Kids_session, "f").logged_in)
            throw new InnertubeError('You must be signed in to perform this operation.');
        const blocklist_payload = BlocklistPickerEndpoint.build({ channel_id: channel_id });
        const response = await __classPrivateFieldGet(this, _Kids_session, "f").actions.execute(BlocklistPickerEndpoint.PATH, blocklist_payload);
        const popup = response.data.command.confirmDialogEndpoint;
        const popup_fragment = { contents: popup.content, engagementPanels: [] };
        const kid_picker = Parser.parseResponse(popup_fragment);
        const kids = kid_picker.contents_memo?.getType(KidsBlocklistPickerItem);
        if (!kids)
            throw new InnertubeError('Could not find any kids profiles or supervised accounts.');
        // Iterate through the kids and block the channel if not already blocked.
        const responses = [];
        for (const kid of kids) {
            if (!kid.block_button?.is_toggled) {
                kid.setActions(__classPrivateFieldGet(this, _Kids_session, "f").actions);
                // Block channel and add to the response list.
                responses.push(await kid.blockChannel());
            }
        }
        return responses;
    }
}
_Kids_session = new WeakMap();
export default Kids;
