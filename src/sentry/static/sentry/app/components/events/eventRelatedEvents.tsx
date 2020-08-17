import React from 'react';
import {Location} from 'history';
import uniqBy from 'lodash/uniqBy';
import moment from 'moment-timezone';

import {t} from 'app/locale';
import {Organization, Event} from 'app/types';
import EventView from 'app/utils/discover/eventView';
import DiscoverQuery from 'app/utils/discover/discoverQuery';
import LoadingIndicator from 'app/components/loadingIndicator';
import EventDataSection from 'app/components/events/eventDataSection';
import {ALL_ACCESS_PROJECTS} from 'app/constants/globalSelectionHeader';
import {getTraceDateTimeRange} from 'app/components/events/interfaces/spans/utils';

import RelatedEvents from './relatedEvents';
import EmptyState from './relatedEvents/emptyState';
import {getCurrentLocation} from './relatedEvents/utils';
import getDiscoverButton from './relatedEvents/getDiscoverButton';

type Props = {
  location: Location;
  event: Event;
  organization: Organization;
};

type State = {
  isLoading: boolean;
  orgFeatures: Set<string>;
  orgSlug: string;
  eventView?: EventView;
};

class EventRelatedEvents extends React.Component<Props, State> {
  state: State = {
    isLoading: true,
    orgFeatures: new Set(this.props.organization.slug),
    orgSlug: this.props.organization.slug,
  };

  componentDidMount() {
    this.getEventView();
  }

  getEventView() {
    const {event, organization} = this.props;

    const traceID = event.contexts?.trace?.trace_id;

    if (!traceID) {
      this.setState({isLoading: false});
      return;
    }

    const orgFeatures = new Set(organization.features);
    const dateCreated = moment(event.dateCreated).valueOf() / 1000;
    const pointInTime = event.dateReceived
      ? moment(event.dateReceived).valueOf() / 1000
      : dateCreated;

    const {start, end} = getTraceDateTimeRange({
      start: pointInTime,
      end: pointInTime,
    });

    const eventFromSavedQuery = EventView.fromSavedQuery({
      id: undefined,
      name: `Events with Trace ID ${traceID}`,
      fields: [
        'title',
        'event.type',
        'project',
        'project.id',
        'trace.span',
        'timestamp',
        'lastSeen',
        'issue',
      ],
      orderby: '-timestamp',
      query: `trace:${traceID}`,
      projects: orgFeatures.has('global-views')
        ? [ALL_ACCESS_PROJECTS]
        : [Number(event.projectID)],
      version: 2,
      start,
      end,
    });

    this.setState({eventView: eventFromSavedQuery, isLoading: false});
  }

  renderEmptyState(message?: string) {
    return <EmptyState message={message} />;
  }

  render() {
    const {location, event} = this.props;
    const {isLoading, eventView, orgSlug, orgFeatures} = this.state;

    if (isLoading) {
      return <LoadingIndicator />;
    }

    const currentLocation = getCurrentLocation();

    return (
      <EventDataSection
        type="related-events"
        title={t('Related Events')}
        actions={getDiscoverButton({orgSlug, currentLocation, orgFeatures, eventView})}
      >
        {eventView ? (
          <DiscoverQuery location={location} eventView={eventView} orgSlug={orgSlug}>
            {discoverData => {
              if (discoverData.isLoading) {
                return <LoadingIndicator />;
              }

              if (!discoverData.tableData?.data) {
                return this.renderEmptyState(
                  t(
                    "Sorry, but it seems that you don't have access to the discover endpoints"
                  )
                );
              }

              const relatedEvents = uniqBy(discoverData.tableData?.data, 'id').filter(
                evt => evt.id !== event?.id
              );

              if (!relatedEvents.length) {
                return this.renderEmptyState();
              }

              return (
                <RelatedEvents
                  relatedEvents={relatedEvents}
                  eventView={eventView}
                  currentLocation={currentLocation}
                  orgSlug={orgSlug}
                />
              );
            }}
          </DiscoverQuery>
        ) : (
          this.renderEmptyState()
        )}
      </EventDataSection>
    );
  }
}

export default EventRelatedEvents;
