export const PATH = '/like/dislike';
/**
 * Builds a `/like/dislike` endpoint payload.
 * @param options - The options to use.
 * @returns The payload.
 */
export function build(options) {
    return {
        target: {
            videoId: options.target.video_id
        },
        ...{
            client: options.client
        }
    };
}
