// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {connect} from 'react-redux';

import {bindActionCreators, Dispatch} from 'redux';

import {addPostReminder} from 'mattermost-redux/actions/posts';

import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';

import {GlobalState} from 'types/store';
import {makeAsyncComponent} from 'components/async_load';

const PostReminderCustomTimePicker = makeAsyncComponent('PostReminderCustomTimePicker', React.lazy(() => import('./post_reminder_custom_time_picker_modal')));

function mapStateToProps(state: GlobalState) {
    const userId = getCurrentUserId(state);

    return {
        userId,
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators({
            addPostReminder,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostReminderCustomTimePicker);
