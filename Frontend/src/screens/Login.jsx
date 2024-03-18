import {useState } from "react";
import {Link,useNavigate} from "react-router-dom";

const Login = () => {
  let navigate=useNavigate();
    const [credentials, setCredentials] = useState({email:"",password:""})  //This variable holds the user's email and password as an object.

    const handleSubmit=async (e)=>{
        e.preventDefault();   //It prevents the default form submission behavior using e.preventDefault() to avoid a page reload.
        //it sends a POST request to a server endpoint (http://localhost:5000/api/loginuser) with the user's email and password as JSON data in the request body.
        const response= await fetch("http://localhost:5000/loginuser",{  
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify( {email:credentials.email,password:credentials.password})
        })

        //Upon receiving a response from the server, it parses the JSON response (json) and checks if json.success is true.
        const json=await response.json()
        

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
    <section>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company"/>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
              <div className="mt-2"> 
              <input id="email" name="email" type="email" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={credentials.email} onChange={onChange}/></div>
            </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
            </div>
            <div className="mt-2">
              <input id="password" name="password" type="password" value={credentials.password} onChange={onChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
          </div>

          <div>
          <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
          </div>
          <Link to="/createuser" className="font-monte m-3 mx-1 mt-8 pt-10"> New user</Link>
        </form>

      </div>
    </div>

    </section>
                                                              
  )
}

export default Login