import { View } from "native-base";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../App";



export default function LogoutComponent() {

    const { signOut } = useContext(AuthContext);

    useEffect(() => signOut());
    
  return (
   <View></View> 
  );
}
