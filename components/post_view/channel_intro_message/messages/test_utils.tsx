// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Channel} from '@mattermost/types/channels';

import {Constants} from 'utils/constants';
import {UserProfile} from '@mattermost/types/users';

export const channel = {
    create_at: 1508265709607,
    creator_id: 'creator_id',
    delete_at: 0,
    display_name: 'test channel',
    header: 'test',
    id: 'channel_id',
    last_post_at: 1508265709635,
    name: 'testing',
    purpose: 'test',
    team_id: 'team-id',
    type: 'O',
    update_at: 1508265709607,
} as Channel;

export const archivedChannel = {
    ...channel,
    name: Constants.DEFAULT_CHANNEL,
    type: Constants.OPEN_CHANNEL,
    delete_at: 111111,
} as Channel;

export const groupChannel = {
    ...channel,
    type: Constants.GM_CHANNEL,
} as Channel;

export const directChannel = {
    ...channel,
    type: Constants.DM_CHANNEL,
} as Channel;

export const defaultChannel = {
    ...channel,
    name: Constants.DEFAULT_CHANNEL,
    type: Constants.DEFAULT_CHANNEL,
} as Channel;

export const privateChannel = {
    ...channel,
    type: Constants.PRIVATE_CHANNEL,
} as Channel;

export const offTopicChannel = {
    ...channel,
    type: Constants.OFFTOPIC_CHANNEL,
} as Channel;

// type PluginComponent
export const boardComponent = {
    id: 'board',
    pluginId: 'board',
};

export const user1 = {id: 'user1', roles: 'system_user'};
export const bot1 = {id: 'bot1', is_bot: true, roles: 'system_user'};

export const users = [
    {id: 'user1', roles: 'system_user'},
    {id: 'guest1', roles: 'system_guest'},
] as UserProfile[];
