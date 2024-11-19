export const PATH = '/account/accounts_list';
/**
 * Builds a `/account/accounts_list` request payload.
 * @returns The payload.
 */
export function build() {
    return {
        client: 'TV',
        callCircumstance: 2
    };
}
