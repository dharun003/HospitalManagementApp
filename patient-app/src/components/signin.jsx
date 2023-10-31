import { auth, provider } from "../utils/firebase";
import React from "react";
import { Button, Row } from "antd";
import { signInWithPopup } from "firebase/auth";
//export const GLOBAL_CONSTANT = auth.currentUser.email;


const Login = () => {

	// Sign in with google
	const signin = () => {
        signInWithPopup(auth, provider).catch(alert);
	}
	
	return (
		<div>
			<center>
            <Row
      type="flex"
      justify="center"
      align="middle"
      style={{ minHeight: "100vh" }}
    >
				<Button type="primary"
				onClick={signin}>Sign In with Google</Button>
                </Row>
			</center>
		</div>
	);
}

export default Login;
