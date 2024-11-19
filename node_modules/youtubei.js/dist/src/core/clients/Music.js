var _Music_instances, _Music_session, _Music_actions, _Music_fetchInfoFromVideoId, _Music_fetchInfoFromEndpoint;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { InnertubeError, generateRandomString, throwIfMissing, u8ToBase64 } from '../../utils/Utils.js';
import { Album, Artist, Explore, HomeFeed, Library, Playlist, Recap, Search, TrackInfo } from '../../parser/ytmusic/index.js';
import AutomixPreviewVideo from '../../parser/classes/AutomixPreviewVideo.js';
import Message from '../../parser/classes/Message.js';
import MusicDescriptionShelf from '../../parser/classes/MusicDescriptionShelf.js';
import MusicQueue from '../../parser/classes/MusicQueue.js';
import MusicTwoRowItem from '../../parser/classes/MusicTwoRowItem.js';
import MusicResponsiveListItem from '../../parser/classes/MusicResponsiveListItem.js';
import NavigationEndpoint from '../../parser/classes/NavigationEndpoint.js';
import PlaylistPanel from '../../parser/classes/PlaylistPanel.js';
import SearchSuggestionsSection from '../../parser/classes/SearchSuggestionsSection.js';
import SectionList from '../../parser/classes/SectionList.js';
import Tab from '../../parser/classes/Tab.js';
import { BrowseEndpoint, NextEndpoint, PlayerEndpoint, SearchEndpoint } from '../endpoints/index.js';
import { GetSearchSuggestionsEndpoint } from '../endpoints/music/index.js';
import { SearchFilter } from '../../../protos/generated/misc/params.js';
class Music {
    constructor(session) {
        _Music_instances.add(this);
        _Music_session.set(this, void 0);
        _Music_actions.set(this, void 0);
        __classPrivateFieldSet(this, _Music_session, session, "f");
        __classPrivateFieldSet(this, _Music_actions, session.actions, "f");
    }
    /**
     * Retrieves track info. Passing a list item of type MusicTwoRowItem automatically starts a radio.
     * @param target - Video id or a list item.
     */
    getInfo(target) {
        if (target instanceof MusicTwoRowItem) {
            return __classPrivateFieldGet(this, _Music_instances, "m", _Music_fetchInfoFromEndpoint).call(this, target.endpoint);
        }
        else if (target instanceof MusicResponsiveListItem) {
            return __classPrivateFieldGet(this, _Music_instances, "m", _Music_fetchInfoFromEndpoint).call(this, target.overlay?.content?.endpoint ?? target.endpoint);
        }
        else if (target instanceof NavigationEndpoint) {
            return __classPrivateFieldGet(this, _Music_instances, "m", _Music_fetchInfoFromEndpoint).call(this, target);
        }
        else if (typeof target === 'string') {
            return __classPrivateFieldGet(this, _Music_instances, "m", _Music_fetchInfoFromVideoId).call(this, target);
        }
        throw new InnertubeError('Invalid target, expected either a video id or a valid MusicTwoRowItem', target);
    }
    /**
     * Searches on YouTube Music.
     * @param query - Search query.
     * @param filters - Search filters.
     */
    async search(query, filters = {}) {
        throwIfMissing({ query });
        let params;
        if (filters.type && filters.type !== 'all') {
            const writer = SearchFilter.encode({
                filters: {
                    musicSearchType: {
                        [filters.type]: true
                    }
                }
            });
            params = encodeURIComponent(u8ToBase64(writer.finish()));
        }
        const response = await __classPrivateFieldGet(this, _Music_actions, "f").execute(SearchEndpoint.PATH, SearchEndpoint.build({
            query, client: 'YTMUSIC',
            params
        }));
        return new Search(response, __classPrivateFieldGet(this, _Music_actions, "f"), Reflect.has(filters, 'type') && filters.type !== 'all');
    }
    /**
     * Retrieves the home feed.
     */
    async getHomeFeed() {
        const response = await __classPrivateFieldGet(this, _Music_actions, "f").execute(BrowseEndpoint.PATH, BrowseEndpoint.build({
            browse_id: 'FEmusic_home',
            client: 'YTMUSIC'
        }));
        return new HomeFeed(response, __classPrivateFieldGet(this, _Music_actions, "f"));
    }
    /**
     * Retrieves the Explore feed.
     */
    async getExplore() {
        const response = await __classPrivateFieldGet(this, _Music_actions, "f").execute(BrowseEndpoint.PATH, BrowseEndpoint.build({
            client: 'YTMUSIC',
            browse_id: 'FEmusic_explore'
        }));
        return new Explore(response);
        // TODO: return new Explore(response, this.#actions);
    }
    /**
     * Retrieves the library.
     */
    async getLibrary() {
        const response = await __classPrivateFieldGet(this, _Music_actions, "f").execute(BrowseEndpoint.PATH, BrowseEndpoint.build({
            client: 'YTMUSIC',
            browse_id: 'FEmusic_library_landing'
        }));
        return new Library(response, __classPrivateFieldGet(this, _Music_actions, "f"));
    }
    /**
     * Retrieves artist's info & content.
     * @param artist_id - The artist id.
     */
    async getArtist(artist_id) {
        throwIfMissing({ artist_id });
        if (!artist_id.startsWith('UC') && !artist_id.startsWith('FEmusic_library_privately_owned_artist'))
            throw new InnertubeError('Invalid artist id', artist_id);
        const response = await __classPrivateFieldGet(this, _Music_actions, "f").execute(BrowseEndpoint.PATH, BrowseEndpoint.build({
            client: 'YTMUSIC',
            browse_id: artist_id
        }));
        return new Artist(response, __classPrivateFieldGet(this, _Music_actions, "f"));
    }
    /**
     * Retrieves album.
     * @param album_id - The album id.
     */
    async getAlbum(album_id) {
        throwIfMissing({ album_id });
        if (!album_id.startsWith('MPR') && !album_id.startsWith('FEmusic_library_privately_owned_release'))
            throw new InnertubeError('Invalid album id', album_id);
        const response = await __classPrivateFieldGet(this, _Music_actions, "f").execute(BrowseEndpoint.PATH, BrowseEndpoint.build({
            client: 'YTMUSIC',
            browse_id: album_id
        }));
        return new Album(response);
    }
    /**
     * Retrieves playlist.
     * @param playlist_id - The playlist id.
     */
    async getPlaylist(playlist_id) {
        throwIfMissing({ playlist_id });
        if (!playlist_id.startsWith('VL')) {
            playlist_id = `VL${playlist_id}`;
        }
        const response = await __classPrivateFieldGet(this, _Music_actions, "f").execute(BrowseEndpoint.PATH, BrowseEndpoint.build({
            client: 'YTMUSIC',
            browse_id: playlist_id
        }));
        return new Playlist(response, __classPrivateFieldGet(this, _Music_actions, "f"));
    }
    /**
     * Retrieves up next.
     * @param video_id - The video id.
     * @param automix - Whether to enable automix.
     */
    async getUpNext(video_id, automix = true) {
        throwIfMissing({ video_id });
        const response = await __classPrivateFieldGet(this, _Music_actions, "f").execute(NextEndpoint.PATH, { ...NextEndpoint.build({ video_id, client: 'YTMUSIC' }), parse: true });
        const tabs = response.contents_memo?.getType(Tab);
        const tab = tabs?.first();
        if (!tab)
            throw new InnertubeError('Could not find target tab.');
        const music_queue = tab.content?.as(MusicQueue);
        if (!music_queue || !music_queue.content)
            throw new InnertubeError('Music queue was empty, the given id is probably invalid.', music_queue);
        const playlist_panel = music_queue.content.as(PlaylistPanel);
        if (!playlist_panel.playlist_id && automix) {
            const automix_preview_video = playlist_panel.contents.firstOfType(AutomixPreviewVideo);
            if (!automix_preview_video)
                throw new InnertubeError('Automix item not found');
            const page = await automix_preview_video.playlist_video?.endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), {
                videoId: video_id,
                client: 'YTMUSIC',
                parse: true
            });
            if (!page || !page.contents_memo)
                throw new InnertubeError('Could not fetch automix');
            return page.contents_memo.getType(PlaylistPanel).first();
        }
        return playlist_panel;
    }
    /**
     * Retrieves related content.
     * @param video_id - The video id.
     */
    async getRelated(video_id) {
        throwIfMissing({ video_id });
        const response = await __classPrivateFieldGet(this, _Music_actions, "f").execute(NextEndpoint.PATH, { ...NextEndpoint.build({ video_id, client: 'YTMUSIC' }), parse: true });
        const tabs = response.contents_memo?.getType(Tab);
        const tab = tabs?.matchCondition((tab) => tab.endpoint.payload.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType === 'MUSIC_PAGE_TYPE_TRACK_RELATED');
        if (!tab)
            throw new InnertubeError('Could not find target tab.');
        const page = await tab.endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), { client: 'YTMUSIC', parse: true });
        if (!page.contents)
            throw new InnertubeError('Unexpected response', page);
        const contents = page.contents.item().as(SectionList, Message);
        return contents;
    }
    /**
     * Retrieves song lyrics.
     * @param video_id - The video id.
     */
    async getLyrics(video_id) {
        throwIfMissing({ video_id });
        const response = await __classPrivateFieldGet(this, _Music_actions, "f").execute(NextEndpoint.PATH, { ...NextEndpoint.build({ video_id, client: 'YTMUSIC' }), parse: true });
        const tabs = response.contents_memo?.getType(Tab);
        const tab = tabs?.matchCondition((tab) => tab.endpoint.payload.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType === 'MUSIC_PAGE_TYPE_TRACK_LYRICS');
        if (!tab)
            throw new InnertubeError('Could not find target tab.');
        const page = await tab.endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), { client: 'YTMUSIC', parse: true });
        if (!page.contents)
            throw new InnertubeError('Unexpected response', page);
        if (page.contents.item().type === 'Message')
            throw new InnertubeError(page.contents.item().as(Message).text.toString(), video_id);
        const section_list = page.contents.item().as(SectionList).contents;
        return section_list.firstOfType(MusicDescriptionShelf);
    }
    /**
     * Retrieves recap.
     */
    async getRecap() {
        const response = await __classPrivateFieldGet(this, _Music_actions, "f").execute(BrowseEndpoint.PATH, BrowseEndpoint.build({
            client: 'YTMUSIC_ANDROID',
            browse_id: 'FEmusic_listening_review'
        }));
        return new Recap(response, __classPrivateFieldGet(this, _Music_actions, "f"));
    }
    /**
     * Retrieves search suggestions for the given query.
     * @param query - The query.
     */
    async getSearchSuggestions(query) {
        const response = await __classPrivateFieldGet(this, _Music_actions, "f").execute(GetSearchSuggestionsEndpoint.PATH, { ...GetSearchSuggestionsEndpoint.build({ input: query }), parse: true });
        if (!response.contents_memo)
            return [];
        const search_suggestions_sections = response.contents_memo.getType(SearchSuggestionsSection);
        return search_suggestions_sections;
    }
}
_Music_session = new WeakMap(), _Music_actions = new WeakMap(), _Music_instances = new WeakSet(), _Music_fetchInfoFromVideoId = async function _Music_fetchInfoFromVideoId(video_id) {
    const player_payload = PlayerEndpoint.build({
        video_id,
        sts: __classPrivateFieldGet(this, _Music_session, "f").player?.sts,
        client: 'YTMUSIC'
    });
    const next_payload = NextEndpoint.build({
        video_id,
        client: 'YTMUSIC'
    });
    const player_response = __classPrivateFieldGet(this, _Music_actions, "f").execute(PlayerEndpoint.PATH, player_payload);
    const next_response = __classPrivateFieldGet(this, _Music_actions, "f").execute(NextEndpoint.PATH, next_payload);
    const response = await Promise.all([player_response, next_response]);
    const cpn = generateRandomString(16);
    return new TrackInfo(response, __classPrivateFieldGet(this, _Music_actions, "f"), cpn);
}, _Music_fetchInfoFromEndpoint = async function _Music_fetchInfoFromEndpoint(endpoint) {
    if (!endpoint)
        throw new Error('This item does not have an endpoint.');
    const player_response = endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), {
        client: 'YTMUSIC',
        playbackContext: {
            contentPlaybackContext: {
                ...{
                    signatureTimestamp: __classPrivateFieldGet(this, _Music_session, "f").player?.sts
                }
            }
        }
    });
    const next_response = endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), {
        client: 'YTMUSIC',
        enablePersistentPlaylistPanel: true,
        override_endpoint: '/next'
    });
    const cpn = generateRandomString(16);
    const response = await Promise.all([player_response, next_response]);
    return new TrackInfo(response, __classPrivateFieldGet(this, _Music_actions, "f"), cpn);
};
export default Music;
