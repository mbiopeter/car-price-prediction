import "./Login.css";
import google from "../assets/google.png"
import git from "../assets/git.png"
import fb from "../assets/fb.png"
import group from "../assets/Group.png"
import image from "../assets/image.png"
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
const Login = () => {
    const [inputs, setInputs] = useState({
        username:"",
        password: ""
    });
    const [err, setErr] = useState(null);

    const navigate = useNavigate();

    const handleChange = e => {
        setInputs(prev=>({...prev, [e.target.name]:e.target.value}))
    }

    const { login } = useContext(AuthContext)

    const handleLogin = async(e) => {
        e.preventDefault();
        try {
            const res = await login(inputs)
            navigate('/');
        } catch (err) {
            if (err.response && err.response.data) {
                setErr(err.response.data);
                console.log(err.response.data);
            } else {
                console.error('An error occurred:', err);
            }
        }
        
    }
    return (
        <div className="login">
            <div className="left">
                <form>
                <div className="float">
                    <span className='logo'>logo here</span>
                    <h1>Login</h1>
                    <label htmlFor="Email">Email</label>
                    <input type="text" onChange={handleChange} name="username" placeholder="Jane doe" />
                    <label htmlFor="Password">Password</label>
                    <input type="password" onChange={handleChange} name="password" />
                    <label className='link' htmlFor="forgotten_password">Forgotten password?</label>
                    <button type="submit"  onClick={handleLogin}>Sign In</button>
                    <div className="social">
                    <span className='social-label'>or continue with</span>
                    <div className="con">
                        <div className="icon">
                        <img src={google} alt="" />
                        </div>
                        <div className="icon">
                        <img src={git} alt="" />
                        </div>
                        <div className="icon">
                        <img src={fb} alt="" />
                        </div>
                    </div>
                    <p>Don't have an account <a href="signup.html" className='sign-up'>Sign Up</a></p>
                    </div>
                </div>
                </form>
            </div>
            <div className="right">
                <img className="group" src={group} alt="" />
                <img className="image" src={image} alt="" />
            </div>
        </div>
    );
};

export default Login;
