import { VisitorData } from '../../protos/generated/misc/params.js';
export declare function encodeVisitorData(id: string, timestamp: number): string;
export declare function decodeVisitorData(visitor_data: string): VisitorData;
export declare function encodeCommentActionParams(type: number, args?: {
    comment_id?: string;
    video_id?: string;
    text?: string;
    target_language?: string;
}): string;
export declare function encodeNextParams(video_ids: string[]): string;
