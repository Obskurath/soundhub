var _Comment_actions;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { Parser } from '../../index.js';
import Author from '../misc/Author.js';
import Text from '../misc/Text.js';
import Thumbnail from '../misc/Thumbnail.js';
import Menu from '../menus/Menu.js';
import AuthorCommentBadge from './AuthorCommentBadge.js';
import CommentActionButtons from './CommentActionButtons.js';
import CommentReplyDialog from './CommentReplyDialog.js';
import PdgCommentChip from './PdgCommentChip.js';
import SponsorCommentBadge from './SponsorCommentBadge.js';
import * as ProtoUtils from '../../../utils/ProtoUtils.js';
import { InnertubeError } from '../../../utils/Utils.js';
import { YTNode } from '../../helpers.js';
class Comment extends YTNode {
    constructor(data) {
        super();
        _Comment_actions.set(this, void 0);
        this.content = new Text(data.contentText);
        this.published = new Text(data.publishedTimeText);
        this.author_is_channel_owner = data.authorIsChannelOwner;
        this.current_user_reply_thumbnail = Thumbnail.fromResponse(data.currentUserReplyThumbnail);
        this.sponsor_comment_badge = Parser.parseItem(data.sponsorCommentBadge, SponsorCommentBadge);
        this.paid_comment_chip = Parser.parseItem(data.paidCommentChipRenderer, PdgCommentChip);
        this.author_badge = Parser.parseItem(data.authorCommentBadge, AuthorCommentBadge);
        this.author = new Author({
            ...data.authorText,
            navigationEndpoint: data.authorEndpoint
        }, this.author_badge ? [{
                metadataBadgeRenderer: this.author_badge?.orig_badge
            }] : null, data.authorThumbnail);
        this.action_menu = Parser.parseItem(data.actionMenu, Menu);
        this.action_buttons = Parser.parseItem(data.actionButtons, CommentActionButtons);
        this.comment_id = data.commentId;
        this.vote_status = data.voteStatus;
        this.vote_count = data.voteCount ? new Text(data.voteCount).toString() : '0';
        this.reply_count = data.replyCount || 0;
        this.is_liked = !!this.action_buttons?.like_button?.is_toggled;
        this.is_disliked = !!this.action_buttons?.dislike_button?.is_toggled;
        this.is_hearted = !!this.action_buttons?.creator_heart?.is_hearted;
        this.is_pinned = !!data.pinnedCommentBadge;
        this.is_member = !!data.sponsorCommentBadge;
    }
    /**
     * Likes the comment.
     */
    async like() {
        if (!__classPrivateFieldGet(this, _Comment_actions, "f"))
            throw new InnertubeError('An active caller must be provide to perform this operation.');
        const button = this.action_buttons?.like_button;
        if (!button)
            throw new InnertubeError('Like button was not found.', { comment_id: this.comment_id });
        if (button.is_toggled)
            throw new InnertubeError('This comment is already liked', { comment_id: this.comment_id });
        const response = await button.endpoint.call(__classPrivateFieldGet(this, _Comment_actions, "f"), { parse: false });
        return response;
    }
    /**
     * Dislikes the comment.
     */
    async dislike() {
        if (!__classPrivateFieldGet(this, _Comment_actions, "f"))
            throw new InnertubeError('An active caller must be provide to perform this operation.');
        const button = this.action_buttons?.dislike_button;
        if (!button)
            throw new InnertubeError('Dislike button was not found.', { comment_id: this.comment_id });
        if (button.is_toggled)
            throw new InnertubeError('This comment is already disliked', { comment_id: this.comment_id });
        const response = await button.endpoint.call(__classPrivateFieldGet(this, _Comment_actions, "f"), { parse: false });
        return response;
    }
    /**
     * Creates a reply to the comment.
     */
    async reply(text) {
        if (!__classPrivateFieldGet(this, _Comment_actions, "f"))
            throw new InnertubeError('An active caller must be provide to perform this operation.');
        if (!this.action_buttons?.reply_button)
            throw new InnertubeError('Cannot reply to another reply. Try mentioning the user instead.', { comment_id: this.comment_id });
        const button = this.action_buttons?.reply_button;
        if (!button.endpoint?.dialog)
            throw new InnertubeError('Reply button endpoint did not have a dialog.');
        const dialog = button.endpoint.dialog.as(CommentReplyDialog);
        const dialog_button = dialog.reply_button;
        if (!dialog_button)
            throw new InnertubeError('Reply button was not found in the dialog.', { comment_id: this.comment_id });
        if (!dialog_button.endpoint)
            throw new InnertubeError('Reply button endpoint was not found.', { comment_id: this.comment_id });
        const response = await dialog_button.endpoint.call(__classPrivateFieldGet(this, _Comment_actions, "f"), { commentText: text });
        return response;
    }
    /**
     * Translates the comment to a given language.
     * @param target_language - Ex; en, ja
     */
    async translate(target_language) {
        if (!__classPrivateFieldGet(this, _Comment_actions, "f"))
            throw new InnertubeError('An active caller must be provide to perform this operation.');
        // Emojis must be removed otherwise InnerTube throws a 400 status code at us.
        const text = this.content.toString().replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, '');
        const payload = {
            text,
            target_language,
            comment_id: this.comment_id
        };
        const action = ProtoUtils.encodeCommentActionParams(22, payload);
        const response = await __classPrivateFieldGet(this, _Comment_actions, "f").execute('comment/perform_comment_action', { action });
        // XXX: Should move this to Parser#parseResponse
        const mutations = response.data.frameworkUpdates?.entityBatchUpdate?.mutations;
        const content = mutations?.[0]?.payload?.commentEntityPayload?.translatedContent?.content;
        return { ...response, content };
    }
    setActions(actions) {
        __classPrivateFieldSet(this, _Comment_actions, actions, "f");
    }
}
_Comment_actions = new WeakMap();
Comment.type = 'Comment';
export default Comment;
