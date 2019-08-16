import React, { Component } from 'react'

import jwt_decode from 'jwt-decode'
import Navbar from './Navbar'
class Profile extends Component {
    constructor() {
        super()
        this.state = {
            first_name: '',
            last_name: '',
            email: ''

        }
    }

    componentDidMount() {
        console.log("token under profile.js before the IF statement");
        console.log(localStorage.usertoken);
        if ((localStorage.usertoken) === null || (localStorage.usertoken) === undefined) {
            console.log("Token is null");
            this.props.history.push('/Login')
            return false
        }
        const token = localStorage.usertoken
        const decoded = jwt_decode(token)
        console.log("decoded under profile.js");
        console.log(decoded)
        console.log(decoded.exp)
        var current_time = new Date().getTime() / 1000;
        console.log("current TIme");
        console.log(current_time)
        console.log("token under profile.js");
        console.log(token);

        this.setState({
            first_name: decoded.first_name,
            last_name: decoded.last_name,
            email: decoded.email,
        })


    }

    render() {
        return (
            <div className="container">
                <Navbar />
                <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">PROFILE</h1>
                    </div>
                    <table className="table col-md-6 mx-auto">
                        <tbody>
                            <tr>
                                <td>First Name</td>
                                <td>{this.state.first_name}</td>
                            </tr>
                            <tr>
                                <td>Last Name</td>
                                <td>{this.state.last_name}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{this.state.email}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>




            </div>
        )
    }
}


export default Profile