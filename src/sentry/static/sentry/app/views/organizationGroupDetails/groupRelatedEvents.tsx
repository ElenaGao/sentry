import React from 'react';
import styled from '@emotion/styled';

import RelatedEvents from 'app/components/events/relatedEvents';
import EmptyState from 'app/components/events/relatedEvents/emptyState';
import {getCurrentLocation} from 'app/components/events/relatedEvents/utils';
import getDiscoverButton from 'app/components/events/relatedEvents/getDiscoverButton';
import space from 'app/styles/space';
import withOrganization from 'app/utils/withOrganization';
import {Organization} from 'app/types';
import Feature from 'app/components/acl/feature';

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

  const discoverButton = getDiscoverButton({
    orgSlug,
    orgFeatures,
    currentLocation,
    eventView,
  });

  return (
    <React.Fragment>
      {discoverButton && <Action>{discoverButton}</Action>}
      <RelatedEvents
        eventView={eventView}
        relatedEvents={relatedEvents}
        orgSlug={orgSlug}
        currentLocation={currentLocation}
      />
    </React.Fragment>
  );
};

const GroupRelatedEventsContainer = (props: Props) => (
  <Feature features={['related-events']} organization={props.organization}>
    <GroupRelatedEvents {...props} />
  </Feature>
);

export default withOrganization(GroupRelatedEventsContainer);

const Action = styled('div')`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${space(2)};
`;
