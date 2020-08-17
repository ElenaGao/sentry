import React from 'react';
import styled from '@emotion/styled';

import RelatedEvents from 'app/components/events/relatedEvents';
import EmptyState from 'app/components/events/relatedEvents/emptyState';
import {getCurrentLocation} from 'app/components/events/relatedEvents/utils';
import DiscoverButton from 'app/components/events/relatedEvents/discoverButton';
import space from 'app/styles/space';
import withOrganization from 'app/utils/withOrganization';
import {Organization} from 'app/types';

type RelatedEventsProps = React.ComponentProps<typeof RelatedEvents>;

export type GroupRelatedEventsProps = Pick<
  RelatedEventsProps,
  'eventView' | 'relatedEvents'
>;

type Props = {
  organization: Organization;
} & GroupRelatedEventsProps;

const GroupRelatedEvents = ({eventView, organization, relatedEvents}: Props) => {
  const orgSlug = organization.slug;
  const orgFeatures = new Set(organization.features);
  const currentLocation = getCurrentLocation();

  if (!relatedEvents.length) {
    return <EmptyState />;
  }

  return (
    <React.Fragment>
      <Action>
        <DiscoverButton
          orgSlug={orgSlug}
          orgFeatures={orgFeatures}
          currentLocation={currentLocation}
          eventView={eventView}
        />
      </Action>
      <RelatedEvents
        eventView={eventView}
        relatedEvents={relatedEvents}
        orgSlug={orgSlug}
        currentLocation={currentLocation}
      />
    </React.Fragment>
  );
};

export default withOrganization(GroupRelatedEvents);

const Action = styled('div')`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${space(2)};
`;
