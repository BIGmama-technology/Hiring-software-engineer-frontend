import { Flex, Grid, GridItem, Heading } from "@chakra-ui/react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <Grid
      height="100vh"
      templateColumns="repeat(2, 1fr)"
      gap={6}
      alignItems="center"
      textAlign="center"
      alignContent="center"
      px={8}
    >
      <GridItem w="100%" h="400" bg="red.500">
        <Flex
          justifyContent="center"
          alignContent="center"
          height="100%"
          wrap="wrap"
        >
          <Link href="/account">
            <Heading size="md">Account</Heading>
          </Link>
        </Flex>
      </GridItem>
      <GridItem w="100%" h="400" bg="red.500">
        <Flex
          justifyContent="center"
          alignContent="center"
          height="100%"
          wrap="wrap"
        >
          <Link href="/liveblocks-app">
            <Heading size="md">Document Editing</Heading>
          </Link>
        </Flex>
      </GridItem>
    </Grid>
  );
}
