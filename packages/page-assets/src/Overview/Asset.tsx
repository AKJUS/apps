// Copyright 2017-2025 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AssetInfo } from '@polkadot/react-hooks/types';

import React, { useMemo } from 'react';

import { AddressSmall } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

import Mint from './Mint/index.js';

interface Props {
  className?: string;
  value: AssetInfo;
}

function Asset ({ className, value: { details, id, isIssuerMe, metadata } }: Props): React.ReactElement<Props> {
  const format = useMemo(
    (): [number, string] => metadata
      ? [metadata.decimals.toNumber(), metadata.symbol.toUtf8()]
      : [0, '---'],
    [metadata]
  );

  return (
    <tr className={className}>
      <td></td>
      <td className='together'>
        <span style={{ fontSize: 18, marginRight: 10 }}>
          {id.toString()}
        </span>
        {metadata?.name.toUtf8()}</td>
      <td className='address media--1000'>{details && <AddressSmall value={details.owner} />}</td>
      <td className='address media--1300'>{details && <AddressSmall value={details.admin} />}</td>
      <td className='address media--1600'>{details && <AddressSmall value={details.issuer} />}</td>
      <td className='address media--1900'>{details && <AddressSmall value={details.freezer} />}</td>
      <td className='number all'>{details && (
        <FormatBalance
          format={format}
          value={details.supply}
        />
      )}</td>
      <td className='button'>{details && metadata && isIssuerMe && (
        <Mint
          details={details}
          id={id}
          metadata={metadata}
        />
      )}</td>
    </tr>
  );
}

export default React.memo(Asset);
