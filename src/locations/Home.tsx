import { Suspense, useEffect, useState } from 'react';

import { useSDK } from '@contentful/react-apps-toolkit';
import { HomeExtensionSDK } from '@contentful/app-sdk';
import { Box, Button, Flex, Paragraph } from '@contentful/f36-components';
import tokens from '@contentful/f36-tokens';

import Header from 'components/layout/Header';
import HeaderSkeleton from 'components/loaders/HeaderSkeleton';
import DefaultSpace from 'components/spaces/default/DefaultSpace';
import SpaceSkeleton from 'components/loaders/SpaceSkeleton';
import LiveSearch from 'components/algolia/LiveSearch';

const Home = () => {
  const sdk = useSDK<HomeExtensionSDK>();
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>([]);

  useEffect(() => {
    setSelectedSpaces(sdk.parameters.installation.selectedSpaces);
  }, [sdk.parameters.installation.selectedSpaces]);

  return (
    <Box paddingBottom="spacingL">
      <Flex
        as="header"
        flexDirection="row"
        padding="spacingXl"
        marginBottom="spacingL"
        fullWidth={true}
        style={{
          borderBottom: `solid 2px ${tokens.gray300}`,
          background: '#fff',
        }}
      >
        <Suspense fallback={<HeaderSkeleton />}>
          <Header user={sdk.user} spaceId={sdk.ids.space} />
        </Suspense>
      </Flex>
      <Flex
        as="main"
        flexDirection="column"
        style={{ maxWidth: '960px', margin: '0 auto' }}
        fullWidth={true}
        gap="spacing2Xl"
      >
        {sdk.parameters.installation.algoliaIndexName !== '' &&
          sdk.parameters.installation.algoliaIndexName && <LiveSearch />}
        <Suspense fallback={<SpaceSkeleton />}>
          {selectedSpaces.length > 0 ? (
            sdk.parameters.installation.selectedSpaces.map((s: string) => (
              <DefaultSpace key={s} spaceId={s} />
            ))
          ) : (
            <Flex
              flexDirection="column"
              padding="spacingM"
              justifyContent="center"
              alignItems="center"
              style={{
                background: '#fff',
                border: `solid 1px ${tokens.gray300}`,
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <Paragraph>
                To see recently updated related spaces, please configure the dashboard app by adding
                spaces and content types.
              </Paragraph>
              <Button
                as="a"
                href={`${process.env.REACT_APP_CONTENTFUL_URL}/spaces/${sdk.ids.space}/apps/${sdk.ids.app}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Started
              </Button>
            </Flex>
          )}
        </Suspense>
      </Flex>
    </Box>
  );
};

export default Home;
