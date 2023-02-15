import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  Collapse,
  Divider,
  Heading,
  HStack,
  ScaleFade,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { CreateProjectForm } from '@components/create-project-form';
import { faChevronRight } from '@fortawesome/pro-light-svg-icons';
import { Icon } from '@lib/icon';
import { withDefaultServerSideProps } from '@lib/props';
import { trpc } from '@lib/trpc';
import { useFlag } from '@unleash/proxy-client-react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { default as NextLink } from 'next/link';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export const getServerSideProps: GetServerSideProps = withDefaultServerSideProps({ secure: true });

const ProjectsPage: NextPage = () => {
  const createBoxEnabled = useFlag('create-box');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: projects } = trpc.project.fetchAll.useQuery();

  const [recentlyCreated, setRecentlyCreated] = useState<boolean>(false);

  const handleOnClose = (created?: boolean) => {
    if (created) {
      setRecentlyCreated(true);
      setTimeout(() => {
        setRecentlyCreated(false);
      }, 5000);
    }

    onClose();
  };

  const handleCreateBoxButtonClick = () => {
    if (isOpen) {
      onClose();
      return;
    }
    onOpen();
  };

  return (
    <>
      <Head>
        <title>Retrobox | Projects</title>
        <meta name="description" content="Retrobox home" />
      </Head>

      {/* Page Heading */}
      <Box as="section" mb="6">
        <Breadcrumb mb={4} separator={<ChevronRightIcon color="gray.500" />} spacing="8px">
          <BreadcrumbItem>
            <NextLink href="/app" passHref>
              <BreadcrumbLink as="span">
                <FormattedMessage id="HOME_PAGE_TITLE" />
              </BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <NextLink href="/app/boxes" passHref>
              <BreadcrumbLink as="span">Projects</BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading as="h2" mb="2" size="2xl">
          Your Projects
        </Heading>
      </Box>

      {/*  Controls */}
      <Card
        as="section"
        w="full"
        mb="6"
        px="6"
        py="3"
        // bg="rgba(255,255,255,0.5)"
        // backdropFilter="blur(5px)"
      >
        <HStack alignContent="center">
          <Spacer />
          {createBoxEnabled && (
            <Button gap={2} aria-label="create new box" onClick={handleCreateBoxButtonClick}>
              {!isOpen && <Text>Create box</Text>}
              {isOpen && <Text>Cancel</Text>}
            </Button>
          )}
        </HStack>
        <Collapse animateOpacity in={isOpen}>
          <Divider my={4} />
          <CreateProjectForm onClose={handleOnClose} />
        </Collapse>
      </Card>

      {/* Project List */}
      {projects &&
        projects.map((project, index) => (
          <ScaleFade key={project.id} delay={0.03 * index} in={true} initialScale={0.9}>
            <NextLink href={`/app/projects/${project.id}`}>
              <Card
                as="section"
                w="full"
                mb="6"
                px="6"
                py="3"
                // bg="rgba(255,255,255,0.5)"
                // backdropFilter="blur(5px)"
                borderWidth="2px"
                borderStyle="solid"
                borderColor={recentlyCreated && index === 0 ? 'blue.300' : 'transparent'}
                transition="border"
                transitionDuration="400ms"
              >
                <HStack>
                  <Heading size="lg">{project.name}</Heading>
                  <Spacer />
                  <Icon icon={faChevronRight} height="6" />
                </HStack>
              </Card>
            </NextLink>
          </ScaleFade>
        ))}

      {/* No Projects Display */}
      {!projects && (
        <Card
          as="section"
          w="full"
          mb="6"
          p="6"
          // bg="rgba(255,255,255,0.5)"
          // backdropFilter="blur(5px)"
        >
          <Text color="subtext" fontStyle="italic">
            Create a project to get started
          </Text>
        </Card>
      )}
    </>
  );
};

export default ProjectsPage;
