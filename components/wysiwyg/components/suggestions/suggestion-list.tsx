// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// disabling this linter rule since it will show errors with the forwardRef
/* eslint-disable react/prop-types */
import React, {
    forwardRef, Fragment,
    useEffect,
    useImperativeHandle, useLayoutEffect,
    useState,
} from 'react';
import {createPortal} from 'react-dom';
import {SuggestionProps} from '@tiptap/suggestion';
import {useFloating, autoUpdate, offset, flip, shift, size} from '@floating-ui/react-dom';
import {FormattedMessage} from 'react-intl';
import styled from 'styled-components';

import {MentionGroupTitle} from './at-mention_items';

const ListContainer = styled.div`
    display: flex;
    flex-direction: column;

    padding: 6px 0;
    max-width: 496px;
    z-index: 100;

    overflow-x: hidden;
    overflow-y: auto;

    border-radius: 4px;
    background: rgb(var(--center-channel-bg-rgb));
    box-shadow: 0 0 8px 2px rgba(0,0,0,0.12);
`;

type ListItemProps = {
    selected?: boolean;
};

const ListItem = styled.div<ListItemProps>`
    background-color: ${({selected}) => (selected ? 'rgb(var(--button-bg-rgb), 0.08)' : 'transparent')};

    &:hover {
      background-color: rgb(var(--center-channel-color-rgb), 0.08);
    }
`;

export type SuggestionListRef = {
    onKeyDown: (props: {event: KeyboardEvent}) => boolean;
}

export type SuggestionItem = {
    id: string;
    type?: string;
    content?: JSX.Element | null;
}

export type SuggestionListProps = Pick<SuggestionProps<SuggestionItem>, 'items' | 'command' | 'decorationNode'> & {
    visible: boolean;
    renderSeparators: boolean;
};

/**
 * this is kind of duplicating the Link Overlay, so we might want to extract the overlay logic to a separate
 * component (`SelectionOverlay`?). The positioning should ideally be defined by an element, since updates will automatically
 * move the overlay to the new position. If not present positioning can be accomplished with the editor selection, so
 * this should be the fallback case for it.
 *
 * example implmentation of position calculation with editor:
 * @see: https://github.com/ueberdosis/tiptap/issues/2305#issuecomment-1020665146
 *
 * related codesandbox:
 * @see: https://codesandbox.io/s/recursing-curran-q9uueb?file=/src/components/ControlledBubbleMenu.jsx
 */
const SuggestionList = forwardRef<SuggestionListRef, SuggestionListProps>(({items, command, decorationNode, visible, renderSeparators}: SuggestionListProps, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const {x, y, reference, floating, strategy, refs, update} = useFloating({
        strategy: 'fixed',
        whileElementsMounted: autoUpdate,
        placement: 'top-start',
        middleware: [
            size({
                apply({availableHeight, elements}) {
                    Object.assign(elements.floating.style, {
                        maxHeight: `${availableHeight - 48}px`,
                    });
                },
            }),
            flip({
                padding: 8,
                fallbackPlacements: [
                    'top-end',
                    'bottom-start',
                    'bottom-end',
                ],
            }),
            offset({mainAxis: 8}),
            shift(),
        ],
    });

    const selectItem = (index: number) => {
        if (items[index]) {
            command(items[index]);
        }
    };

    const upHandler = () => {
        setSelectedIndex((selectedIndex + (items.length - 1)) % items.length);
    };

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % items.length);
    };

    const enterHandler = () => {
        selectItem(selectedIndex);
    };

    useImperativeHandle(ref, () => ({
        onKeyDown: ({event}: {event: KeyboardEvent}) => {
            if (event.key === 'ArrowUp') {
                upHandler();
                return true;
            }

            if (event.key === 'ArrowDown') {
                downHandler();
                return true;
            }

            if (event.key === 'Enter') {
                enterHandler();
                return true;
            }

            return false;
        },
    }));

    useEffect(() => setSelectedIndex(0), [items]);

    useLayoutEffect(() => {
        reference(decorationNode);
    }, [reference, decorationNode]);

    useEffect(() => {
        if (!refs.reference.current || !refs.floating.current) {
            return () => {};
        }

        // Only call this when the floating element is rendered
        return autoUpdate(refs.reference.current, refs.floating.current, update);
    }, [refs.reference, refs.floating, update]);

    const floatingStyle: React.CSSProperties = {
        visibility: visible ? 'visible' : 'hidden',
        position: strategy,
        top: y ?? '',
        left: x ?? '',
    };

    return createPortal(
        <ListContainer
            ref={floating}
            style={floatingStyle}
        >
            {items.length ? items.map(({id, content, type}, index) => (
                <Fragment key={id}>
                    {renderSeparators && type && type !== items[index - 1]?.type && (
                        <MentionGroupTitle>
                            <FormattedMessage id={`suggestion.mention.${type}`}/>
                        </MentionGroupTitle>
                    )}
                    <ListItem
                        selected={index === selectedIndex}
                        onClick={() => selectItem(index)}
                    >
                        {content}
                    </ListItem>
                </Fragment>
            )) : <ListItem>{'No result'}</ListItem>}
        </ListContainer>,
        document.body,
    );
});

export default SuggestionList;