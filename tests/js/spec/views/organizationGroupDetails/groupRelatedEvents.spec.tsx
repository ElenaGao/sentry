import React from 'react';

// import {initializeOrg} from 'sentry-test/initializeOrg';
import {mountWithTheme} from 'sentry-test/enzyme';

import GroupRelatedEvents, {
  GroupRelatedEventsProps,
} from 'app/views/organizationGroupDetails/groupRelatedEvents';
import {DEFAULT_EVENT_VIEW} from 'app/views/eventsV2/data';
import EventView from 'app/utils/discover/eventView';

describe('GroupRelatedEvents', () => {
  const eventView = EventView.fromSavedQuery(DEFAULT_EVENT_VIEW);
  // @ts-ignore Cannot find name 'TestStubs'
  const organization = TestStubs.Organization({features: ['discover-basic']});

  const relatedEvents: GroupRelatedEventsProps['relatedEvents'] = [
    {
      'event.type': 'transaction',
      id: 'transactiontest1',
      issue: 'unknown',
      'issue.id': '1',
      lastSeen: '',
      project: 'issues',
      'project.id': '1',
      timestamp: '2020-08-10T13:25:27+00:00',
      title: 'GET /users',
      'trace.span': 'transaction1',
    },
    {
      'event.type': 'error',
      id: 'errortest1',
      issue: 'unknown',
      'issue.id': '2',
      lastSeen: '',
      project: 'issues',
      'project.id': '2',
      timestamp: '2020-08-10T13:24:26+00:00',
      title: '/',
      'trace.span': 'error1',
    },
  ];

  it('displays empty state', () => {
    const wrapper = mountWithTheme(
      <GroupRelatedEvents
        organization={organization}
        eventView={eventView}
        relatedEvents={[]}
      />
    );

    const emptyStateElement = wrapper.find('EmptyStateWarning');
    expect(emptyStateElement).toHaveLength(1);
    expect(emptyStateElement.text()).toEqual(
      'No related events have been found for the last 24 hours.'
    );
  });

  it('displays a list of Related Events', () => {
    const wrapper = mountWithTheme(
      <GroupRelatedEvents
        organization={organization}
        eventView={eventView}
        relatedEvents={relatedEvents}
      />,
      // @ts-ignore
      TestStubs.routerContext()
    );

    const emptyStateWarning = wrapper.find('EmptyStateWarning');
    expect(emptyStateWarning).toHaveLength(0);

    const openInDiscoverButton = wrapper.find('Button');
    expect(openInDiscoverButton).toHaveLength(1);
    expect(openInDiscoverButton.text()).toEqual('Open in Discover');

    const panelTable = wrapper.find('PanelTable');
    expect(panelTable).toHaveLength(1);

    const paneltableHeader = wrapper.find('PanelTableHeader');
    expect(paneltableHeader).toHaveLength(5);

    const panelItems = wrapper.find('StyledPanelItem');
    expect(panelItems).toHaveLength(10);

    const styledLinks = panelItems.find('StyledLink');
    expect(styledLinks).toHaveLength(2);
    expect(styledLinks.at(0).text()).toEqual(relatedEvents[0].id);
    expect(styledLinks.at(1).text()).toEqual(relatedEvents[1].id);

    expect(styledLinks.at(0).props().to).toStrictEqual({
      pathname: '/organizations/org-slug/performance/summary/',
      query: {
        end: undefined,
        environment: [],
        project: relatedEvents[0]['project.id'],
        query: '',
        start: undefined,
        statsPeriod: '24h',
        transaction: relatedEvents[0].title,
      },
    });

    expect(styledLinks.at(1).props().to).toEqual(
      `/organizations/${organization.slug}/${relatedEvents[1].project}/${relatedEvents[1]['issue.id']}/`
    );
  });

  it('displays a list of Related Events - without discover button', () => {
    const wrapper = mountWithTheme(
      <GroupRelatedEvents
        organization={{...organization, features: []}}
        eventView={eventView}
        relatedEvents={relatedEvents}
      />
    );

    const emptyStateWarning = wrapper.find('EmptyStateWarning');
    expect(emptyStateWarning).toHaveLength(0);

    // button should not be rendered
    const openInDiscoverButton = wrapper.find('Button');
    expect(openInDiscoverButton).toHaveLength(0);

    const panelTable = wrapper.find('PanelTable');
    expect(panelTable).toHaveLength(1);
  });
});
