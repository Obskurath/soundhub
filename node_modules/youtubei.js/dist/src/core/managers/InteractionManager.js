var _InteractionManager_actions;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import * as ProtoUtils from '../../utils/ProtoUtils.js';
import { throwIfMissing, u8ToBase64 } from '../../utils/Utils.js';
import { LikeEndpoint, DislikeEndpoint, RemoveLikeEndpoint } from '../endpoints/like/index.js';
import { SubscribeEndpoint, UnsubscribeEndpoint } from '../endpoints/subscription/index.js';
import { CreateCommentEndpoint, PerformCommentActionEndpoint } from '../endpoints/comment/index.js';
import { ModifyChannelPreferenceEndpoint } from '../endpoints/notification/index.js';
import { CreateCommentParams, NotificationPreferences } from '../../../protos/generated/misc/params.js';
class InteractionManager {
    constructor(actions) {
        _InteractionManager_actions.set(this, void 0);
        __classPrivateFieldSet(this, _InteractionManager_actions, actions, "f");
    }
    /**
     * Likes a given video.
     * @param video_id - The video ID
     */
    async like(video_id) {
        throwIfMissing({ video_id });
        if (!__classPrivateFieldGet(this, _InteractionManager_actions, "f").session.logged_in)
            throw new Error('You must be signed in to perform this operation.');
        const action = await __classPrivateFieldGet(this, _InteractionManager_actions, "f").execute(LikeEndpoint.PATH, LikeEndpoint.build({
            target: { video_id }
        }));
        return action;
    }
    /**
     * Dislikes a given video.
     * @param video_id - The video ID
     */
    async dislike(video_id) {
        throwIfMissing({ video_id });
        if (!__classPrivateFieldGet(this, _InteractionManager_actions, "f").session.logged_in)
            throw new Error('You must be signed in to perform this operation.');
        const action = await __classPrivateFieldGet(this, _InteractionManager_actions, "f").execute(DislikeEndpoint.PATH, DislikeEndpoint.build({
            target: { video_id }
        }));
        return action;
    }
    /**
     * Removes a like/dislike.
     * @param video_id - The video ID
     */
    async removeRating(video_id) {
        throwIfMissing({ video_id });
        if (!__classPrivateFieldGet(this, _InteractionManager_actions, "f").session.logged_in)
            throw new Error('You must be signed in to perform this operation.');
        const action = await __classPrivateFieldGet(this, _InteractionManager_actions, "f").execute(RemoveLikeEndpoint.PATH, RemoveLikeEndpoint.build({
            target: { video_id }
        }));
        return action;
    }
    /**
     * Subscribes to a given channel.
     * @param channel_id - The channel ID
     */
    async subscribe(channel_id) {
        throwIfMissing({ channel_id });
        if (!__classPrivateFieldGet(this, _InteractionManager_actions, "f").session.logged_in)
            throw new Error('You must be signed in to perform this operation.');
        const action = await __classPrivateFieldGet(this, _InteractionManager_actions, "f").execute(SubscribeEndpoint.PATH, SubscribeEndpoint.build({
            channel_ids: [channel_id],
            params: 'EgIIAhgA'
        }));
        return action;
    }
    /**
     * Unsubscribes from a given channel.
     * @param channel_id - The channel ID
     */
    async unsubscribe(channel_id) {
        throwIfMissing({ channel_id });
        if (!__classPrivateFieldGet(this, _InteractionManager_actions, "f").session.logged_in)
            throw new Error('You must be signed in to perform this operation.');
        const action = await __classPrivateFieldGet(this, _InteractionManager_actions, "f").execute(UnsubscribeEndpoint.PATH, UnsubscribeEndpoint.build({
            channel_ids: [channel_id],
            params: 'CgIIAhgA'
        }));
        return action;
    }
    /**
     * Posts a comment on a given video.
     * @param video_id - The video ID
     * @param text - The comment text
     */
    async comment(video_id, text) {
        throwIfMissing({ video_id, text });
        if (!__classPrivateFieldGet(this, _InteractionManager_actions, "f").session.logged_in)
            throw new Error('You must be signed in to perform this operation.');
        const writer = CreateCommentParams.encode({
            videoId: video_id,
            params: {
                index: 0
            },
            number: 7
        });
        const params = encodeURIComponent(u8ToBase64(writer.finish()));
        const action = await __classPrivateFieldGet(this, _InteractionManager_actions, "f").execute(CreateCommentEndpoint.PATH, CreateCommentEndpoint.build({
            comment_text: text,
            create_comment_params: params
        }));
        return action;
    }
    /**
     * Translates a given text using YouTube's comment translate feature.
     *
     * @param target_language - an ISO language code
     * @param args - optional arguments
     */
    async translate(text, target_language, args = {}) {
        throwIfMissing({ text, target_language });
        const target_action = ProtoUtils.encodeCommentActionParams(22, { text, target_language, ...args });
        const response = await __classPrivateFieldGet(this, _InteractionManager_actions, "f").execute(PerformCommentActionEndpoint.PATH, PerformCommentActionEndpoint.build({
            actions: [target_action]
        }));
        const mutation = response.data.frameworkUpdates.entityBatchUpdate.mutations[0].payload.commentEntityPayload;
        return {
            success: response.success,
            status_code: response.status_code,
            translated_content: mutation.translatedContent.content,
            data: response.data
        };
    }
    /**
     * Changes notification preferences for a given channel.
     * Only works with channels you are subscribed to.
     * @param channel_id - The channel ID.
     * @param type - The notification type.
     */
    async setNotificationPreferences(channel_id, type) {
        throwIfMissing({ channel_id, type });
        if (!__classPrivateFieldGet(this, _InteractionManager_actions, "f").session.logged_in)
            throw new Error('You must be signed in to perform this operation.');
        const pref_types = {
            PERSONALIZED: 1,
            ALL: 2,
            NONE: 3
        };
        if (!Object.keys(pref_types).includes(type.toUpperCase()))
            throw new Error(`Invalid notification preference type: ${type}`);
        const writer = NotificationPreferences.encode({
            channelId: channel_id,
            prefId: {
                index: pref_types[type.toUpperCase()]
            },
            number0: 0, number1: 4
        });
        const params = encodeURIComponent(u8ToBase64(writer.finish()));
        const action = await __classPrivateFieldGet(this, _InteractionManager_actions, "f").execute(ModifyChannelPreferenceEndpoint.PATH, ModifyChannelPreferenceEndpoint.build({
            client: 'WEB',
            params
        }));
        return action;
    }
}
_InteractionManager_actions = new WeakMap();
export default InteractionManager;
