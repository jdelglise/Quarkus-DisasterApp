import { Center, Column, Heading, Row, Text } from "native-base";
import React, { useEffect, useState } from "react";
import { getUnvalidatedUsers } from "../../shared/api";
import { components } from "../../shared/models";
import SingleUserValidationComponent from "./SingleUserValidationComponent";

type User = components["schemas"]["User"];

export default function UserValidationComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [state, triggerState] = useState<undefined>();

  useEffect(() => {
    getUnvalidatedUsers().then((response) => setUsers(response));
  }, [state]);

  return (
    <Column space={4}>
      {users.length > 0 ? (
        users.map((user) => (
          <SingleUserValidationComponent user={user} trigger={triggerState} />
        ))
      ) : (
        <Center>
          <Heading size="md">All users are validated</Heading>
        </Center>
      )}
    </Column>
  );
}
