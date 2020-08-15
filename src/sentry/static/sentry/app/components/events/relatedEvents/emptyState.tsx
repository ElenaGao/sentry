import React from 'react';

import {tct} from 'app/locale';
import EmptyStateWarning from 'app/components/emptyStateWarning';
import {Panel} from 'app/components/panels';
import {DEFAULT_RELATIVE_PERIODS} from 'app/constants';

type Props = {
  message?: string;
};

const EmptyState = ({message}: Props) => (
  <Panel>
    <EmptyStateWarning small>
      {message ??
        tct('No related events have been found for the [timePeriod].', {
          timePeriod: DEFAULT_RELATIVE_PERIODS['24h'].toLowerCase(),
        })}
    </EmptyStateWarning>
  </Panel>
);

export default EmptyState;
