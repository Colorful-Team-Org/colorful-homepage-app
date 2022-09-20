import { Box, Flex, Icon, Text } from '@contentful/f36-components';
import { BiCube } from 'react-icons/bi';
import { ReactComponent as Logo } from 'images/colorful-coin-logo.svg';
import { FC } from 'react';
import { useSDK } from '@contentful/react-apps-toolkit';
import { CombinedSpaceProps } from 'types';
import useCurrentSpace from 'hooks/useCurrentSpace';
import CurrentEntry from 'components/entries/current/CurrentEntry';

type CurrentSpaceProps = {
  data: CombinedSpaceProps;
};

const CurrentSpace: FC<CurrentSpaceProps> = (props: CurrentSpaceProps) => {
  const { data } = props;
  const sdk = useSDK();
  const { data: currentSpaceData, isLoading } = useCurrentSpace();

  return data ? (
    <Flex fullWidth={true} flexDirection="column">
      <Flex fullWidth={true} alignItems="center" marginBottom="spacingL">
        <Box style={{ flex: '1' }}>
          <Flex as="span" gap="spacingS" alignItems="center" marginBottom="spacingS">
            <Icon as={BiCube} color="primary" size="medium" variant="secondary" />
            <Text fontSize="fontSizeL" fontColor="gray700" fontWeight="fontWeightMedium">
              {data.space.name}
            </Text>
          </Flex>
          <Text fontColor="gray800" as="h1" fontSize="fontSize2Xl" fontWeight="fontWeightDemiBold">
            Welcome back, {sdk.user.firstName} 👋
          </Text>
        </Box>
        <Box style={{ lineHeight: 1 }}>
          <Logo style={{ width: '110px' }} />
        </Box>
      </Flex>
      <Flex flexDirection="row" gap="spacingL" flexWrap="wrap">
        {!isLoading &&
          currentSpaceData &&
          currentSpaceData.entries &&
          currentSpaceData.entries.items.map(e => (
            <>
              <CurrentEntry contentTypes={data.contentTypes.items} entry={e} />
              <CurrentEntry contentTypes={data.contentTypes.items} entry={e} />
            </>
          ))}
      </Flex>
    </Flex>
  ) : (
    <>Space not found.</>
  );
};

export default CurrentSpace;
