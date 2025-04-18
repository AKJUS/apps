// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Vec } from '@polkadot/types';
import type { KeyValue as Pair } from '@polkadot/types/interfaces';
import type { Props, RawParam } from '../types.js';

import React, { useCallback, useState } from 'react';

import { assert, isHex, u8aToHex, u8aToString } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import Base from './Base.js';
import Bytes from './Bytes.js';
import File from './File.js';
import { createParam } from './KeyValue.js';

interface Parsed {
  isValid: boolean;
  value: [Uint8Array, Uint8Array][];
}

const BYTES_TYPE = {
  info: 0,
  type: 'Bytes'
};

function parseFile (raw: Uint8Array): Parsed {
  const json = JSON.parse(u8aToString(raw)) as Record<string, string>;
  const keys = Object.keys(json);
  let isValid = keys.length !== 0;
  const value = keys.map((key): [Uint8Array, Uint8Array] => {
    const value = json[key];

    assert(isHex(key) && isHex(value), `Non-hex key/value pair found in ${key.toString()} => ${value.toString()}`);

    const encKey = createParam(key);
    const encValue = createParam(value, true);

    isValid = isValid && encKey.isValid && encValue.isValid;

    return [encKey.u8a, encValue.u8a];
  });

  return {
    isValid,
    value
  };
}

function KeyValueArray ({ className = '', defaultValue, isDisabled, isError, label, onChange, onEnter, onEscape, registry, withLabel }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [placeholder, setPlaceholder] = useState<string>(t('click to select or drag and drop JSON key/value (hex-encoded) file'));

  const _onChange = useCallback(
    (raw: Uint8Array): void => {
      let encoded: Parsed = { isValid: false, value: [] };

      try {
        encoded = parseFile(raw);

        setPlaceholder(t('{{count}} key/value pairs encoded for submission', {
          replace: {
            count: encoded.value.length
          }
        }));
      } catch (error) {
        console.error('Error converting json k/v', error);

        setPlaceholder(t('click to select or drag and drop JSON key/value (hex-encoded) file'));
      }

      onChange && onChange(encoded);
    },
    [onChange, t]
  );

  if (isDisabled) {
    const pairs = defaultValue.value as Vec<Pair>;

    return (
      <>
        <Base
          className={className}
          label={label}
        >
          <div />
        </Base>
        <div className='ui--Params'>
          {pairs.map(([key, value]): React.ReactNode => {
            const keyHex = u8aToHex(key.toU8a(true));

            return (
              <Bytes
                defaultValue={{ value } as unknown as RawParam}
                isDisabled
                key={keyHex}
                label={keyHex}
                name={keyHex}
                onEnter={onEnter}
                onEscape={onEscape}
                registry={registry}
                type={BYTES_TYPE}
              />
            );
          })}
        </div>
      </>
    );
  }

  return (
    <File
      className={className}
      isDisabled={isDisabled}
      isError={isError}
      label={label}
      onChange={_onChange}
      placeholder={placeholder}
      withLabel={withLabel}
    />
  );
}

export default React.memo(KeyValueArray);
