import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import SubscriptionNotificationToggleButton from './SubscriptionNotificationToggleButton.js';
import Text from './misc/Text.js';
class SubscribeButton extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.buttonText);
        this.subscribed = data.subscribed;
        this.enabled = data.enabled;
        this.item_type = data.type;
        this.channel_id = data.channelId;
        this.show_preferences = data.showPreferences;
        this.subscribed_text = new Text(data.subscribedButtonText);
        this.unsubscribed_text = new Text(data.unsubscribedButtonText);
        this.notification_preference_button = Parser.parseItem(data.notificationPreferenceButton, SubscriptionNotificationToggleButton);
        this.endpoint = new NavigationEndpoint(data.serviceEndpoints?.[0] || data.onSubscribeEndpoints?.[0]);
    }
}
SubscribeButton.type = 'SubscribeButton';
export default SubscribeButton;
