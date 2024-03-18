import  { useState } from "react";
import { Link,useNavigate } from "react-router-dom";

const Signup = () => {
  let navigate=useNavigate();
    const [credentials, setCredentials] = useState({name:"",email:"",password:"",geolocation:""})


    const handleSubmit=async (e)=>{
        e.preventDefault();
        const response= await fetch("http://localhost:5000/createuser",{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify( {name:credentials.name,email:credentials.email,password:credentials.password,geolocation:credentials.geolocation})

        })
        const json=await response.json()
        console.log(json);

        if(json.success){
          //If the login is successful (json.success is true), it stores an authentication token (json.authToken) in the browser's local storage using localStorage.setItem.
          // This token is typically used to authenticate the user for subsequent requests.
          localStorage.setItem("authToken",json.authToken);
          navigate("/");
        }
        else {
          alert("Enter Valid Credentials");
          
        }
    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
        
      }
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transhtmlForm -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
        </div>
      <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">

      <div className="max-w-md mx-auto">
        <div>
          <h1 className="text-2xl font-semibold">SignUp</h1>
        </div>


        <div className="divide-y divide-gray-200">
          <form className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7" onSubmit={handleSubmit}>
            <div className="relative">
              <input name="name" type="text" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Name"  value={credentials.name} onChange={onChange}/>
              <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Name</label>
            </div>
            <div className="relative">
              <input   name="email" type="email" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Email address" value={credentials.email} onChange={onChange}/>
              <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Email address</label>
            </div>
            <div className="relative">
              <input name="password" type="password" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password" value={credentials.password} onChange={onChange} />
              <label htmlFor="exampleInputPassword1" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
            </div>
            <div className="relative">
              <button className="bg-cyan-500 text-white rounded-md px-2 py-1">Submit</button>
            </div>
          </form>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <button className="flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
        <Link to="/login" className="">Already a user</Link>
        </button>
      </div>

    </div>
  </div>
</div>
  );
};

export default Signup;

