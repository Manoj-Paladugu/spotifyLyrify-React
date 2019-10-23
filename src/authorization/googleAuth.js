import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import { GoogleLogin } from 'react-google-login';



const responseGoogle = (response) => {
    console.log(response);
};

class googleAuth extends Component {
    render() {
        return (
            <GoogleLogin
                clientId="642283527300-aq1i587khnmijaenkc1pkaormdnh6opg.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
        );
    }
}
export default googleAuth;
