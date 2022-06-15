import { Button, Row, Text } from "native-base";
import React from "react";
import { validateUser } from "../../shared/api";
import { components } from "../../shared/models";

type User = components["schemas"]["User"];



export default function SingleUserValidationComponent(props:{user: User, trigger: Function}) {

    return (
        <Row space={4}>
            <Text w={"40%"}>{props.user.firstName}</Text>
            <Text w={"40%"}>{props.user.lastName}</Text>
            <Text w={"40%"}>{props.user.email}</Text>
            <Button onPress={async () => await validateUser(props.user?.id) && props.trigger({})}>Validate</Button>
        </Row>
    );
}