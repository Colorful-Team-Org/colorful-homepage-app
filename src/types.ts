import { QueryParams, SpaceProps, ContentTypeProps, CollectionProp } from 'contentful-management';
import { ReactNode } from 'react';
import type { PlainClientAPI } from 'contentful-management';
import type { KnownSDK } from '@contentful/app-sdk';

type RenderSpaceProps = {
  data: {
    primary: CombinedSpaceProps;
    others: CombinedSpaceProps[];
  };
  children?: ReactNode;
};

type FetchOptions = QueryParams & {
  spaceId: string;
};

type CombinedSpaceProps = {
  contentTypes: CollectionProp<ContentTypeProps>;
  space: SpaceProps;
};

export type CmaClientState = {
  cma: PlainClientAPI | undefined;
  setCma: (cma: PlainClientAPI) => void;
};

export type SdkState = {
  sdk: KnownSDK | undefined;
  setSdk: (sdk: KnownSDK) => void;
};

export type { RenderSpaceProps, FetchOptions, CombinedSpaceProps };
