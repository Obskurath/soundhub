var _AccountManager_actions;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import AccountInfo from '../../parser/youtube/AccountInfo.js';
import Analytics from '../../parser/youtube/Analytics.js';
import Settings from '../../parser/youtube/Settings.js';
import TimeWatched from '../../parser/youtube/TimeWatched.js';
import CopyLink from '../../parser/classes/CopyLink.js';
import { InnertubeError, u8ToBase64 } from '../../utils/Utils.js';
import { Account, BrowseEndpoint, Channel } from '../endpoints/index.js';
import { ChannelAnalytics } from '../../../protos/generated/misc/params.js';
class AccountManager {
    constructor(actions) {
        _AccountManager_actions.set(this, void 0);
        __classPrivateFieldSet(this, _AccountManager_actions, actions, "f");
        this.channel = {
            /**
             * Edits channel name.
             * @param new_name - The new channel name.
             * @deprecated This method is deprecated and will be removed in a future release.
             */
            editName: (new_name) => {
                if (!__classPrivateFieldGet(this, _AccountManager_actions, "f").session.logged_in)
                    throw new InnertubeError('You must be signed in to perform this operation.');
                return __classPrivateFieldGet(this, _AccountManager_actions, "f").execute(Channel.EditNameEndpoint.PATH, Channel.EditNameEndpoint.build({
                    given_name: new_name
                }));
            },
            /**
             * Edits channel description.
             * @param new_description - The new description.
             * @deprecated This method is deprecated and will be removed in a future release.
             */
            editDescription: (new_description) => {
                if (!__classPrivateFieldGet(this, _AccountManager_actions, "f").session.logged_in)
                    throw new InnertubeError('You must be signed in to perform this operation.');
                return __classPrivateFieldGet(this, _AccountManager_actions, "f").execute(Channel.EditDescriptionEndpoint.PATH, Channel.EditDescriptionEndpoint.build({
                    given_description: new_description
                }));
            },
            /**
             * Retrieves basic channel analytics.
             * @deprecated This method is deprecated and will be removed in a future release.
             */
            getBasicAnalytics: () => this.getAnalytics()
        };
    }
    /**
     * Retrieves channel info.
     */
    async getInfo() {
        if (!__classPrivateFieldGet(this, _AccountManager_actions, "f").session.logged_in)
            throw new InnertubeError('You must be signed in to perform this operation.');
        const response = await __classPrivateFieldGet(this, _AccountManager_actions, "f").execute(Account.AccountListEndpoint.PATH, Account.AccountListEndpoint.build());
        return new AccountInfo(response);
    }
    /**
     * Retrieves time watched statistics.
     * @deprecated This method is deprecated and will be removed in a future release.
     */
    async getTimeWatched() {
        const response = await __classPrivateFieldGet(this, _AccountManager_actions, "f").execute(BrowseEndpoint.PATH, BrowseEndpoint.build({
            browse_id: 'SPtime_watched',
            client: 'ANDROID'
        }));
        return new TimeWatched(response);
    }
    /**
     * Opens YouTube settings.
     */
    async getSettings() {
        const response = await __classPrivateFieldGet(this, _AccountManager_actions, "f").execute(BrowseEndpoint.PATH, BrowseEndpoint.build({
            browse_id: 'SPaccount_overview'
        }));
        return new Settings(__classPrivateFieldGet(this, _AccountManager_actions, "f"), response);
    }
    /**
     * Retrieves basic channel analytics.
     * @deprecated This method is deprecated and will be removed in a future release.
     */
    async getAnalytics() {
        const advanced_settings = await __classPrivateFieldGet(this, _AccountManager_actions, "f").execute(BrowseEndpoint.PATH, { browseId: 'SPaccount_advanced', parse: true });
        const copy_link_button = advanced_settings.contents_memo?.getType(CopyLink).find((node) => node.short_url.startsWith('UC'));
        if (!copy_link_button || !copy_link_button.short_url)
            throw new InnertubeError('Channel ID not found');
        const params = encodeURIComponent(u8ToBase64(ChannelAnalytics.encode({
            params: {
                channelId: copy_link_button.short_url
            }
        }).finish()));
        const response = await __classPrivateFieldGet(this, _AccountManager_actions, "f").execute(BrowseEndpoint.PATH, BrowseEndpoint.build({
            browse_id: 'FEanalytics_screen',
            params
        }));
        return new Analytics(response);
    }
}
_AccountManager_actions = new WeakMap();
export default AccountManager;
