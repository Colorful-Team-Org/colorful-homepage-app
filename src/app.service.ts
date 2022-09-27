import { FetchOptions } from 'types';

import { getState as getAppState } from 'core/stores/appStore';
import { CollectionProp, ContentTypeProps, EntryProps } from 'contentful-management';

const isCurrentSpace = (spaceId: string, currentSpaceId: string) => spaceId === currentSpaceId;

const setupApp = async (options: FetchOptions) => {
  const { cma } = getAppState();
  const space = await cma!.space.get({ spaceId: options.spaceId });
  const contentTypes = await cma!.contentType.getMany({ spaceId: options.spaceId, limit: 1000 });

  return {
    space,
    contentTypes,
  };
};

const getSpace = (spaceId: string) => {
  const { cma } = getAppState();

  return cma!.space.get({ spaceId });
};

const getContentTypes = (spaceId: string) => {
  const { cma } = getAppState();

  return cma!.contentType.getMany({ spaceId, limit: 1000 });
};

const getEntries = async (options: FetchOptions) => {
  const { cma, sdk } = getAppState();
  const currentSpace = isCurrentSpace(options.spaceId, sdk!.ids.space);

  const entries = currentSpace ? await getManyEntries(options) : await getFilteredEntries(options);

  const users = await cma!.user.getManyForSpace({
    spaceId: options.spaceId,
    limit: 1000,
  });

  return {
    entries,
    users,
  };
};

const getFilteredEntries: any = async (options: FetchOptions) => {
  const { sdk } = getAppState();
  const selectedContentTypes: ContentTypeProps[] =
    sdk!.parameters.installation.selectedContentTypes.filter(
      (ct: ContentTypeProps) => ct.sys.space.sys.id === options.spaceId
    );

  if (selectedContentTypes.length === 0) return [];

  const filteredEntries = await Promise.all(
    selectedContentTypes.map(ct =>
      getManyEntries({
        spaceId: options.spaceId,
        query: {
          ...options.query,
          limit: 100,
          content_type: ct.sys.id,
        },
      })
    )
  );

  return filteredEntries.reduce(
    (prev: CollectionProp<EntryProps>, curr: CollectionProp<EntryProps>) => {
      return {
        ...curr,
        total: prev.total + curr.total,
        items: [...prev.items, ...curr.items].sort((a: EntryProps, b: EntryProps) =>
          b.sys.updatedAt.localeCompare(a.sys.updatedAt)
        ),
      };
    },
    {
      limit: 0,
      sys: { type: 'Array' },
      skip: 0,
      items: [],
      total: 0,
    } as CollectionProp<EntryProps>
  );
};

const getManyEntries = (options: FetchOptions) => {
  const { cma } = getAppState();

  return cma!.entry.getMany({
    spaceId: options.spaceId,
    query: { limit: 6, ...options.query },
  });
};

export { setupApp, getEntries, getSpace, getContentTypes, getManyEntries };
