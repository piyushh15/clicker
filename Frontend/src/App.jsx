import {  BrowserRouter as Router,Route,Routes , } from 'react-router-dom'
import Home from './screens/Home'
import Login from './screens/Login'
import Signup from './screens/Signup'
import Dataviewer from './screens/Dataviewer'

const App = () => {
  return (
   <Router>
    <div className='bg-gradient-to-r from-custom-blue to-custom-end-blue'>
      <Routes>
        <Route exact path="/" element={<Home/>}></Route>
        <Route exact path="/login" element={<Login/>}></Route>
        <Route exact path="/createuser" element={<Signup/>}></Route>
        <Route exact path="/data" element={<Dataviewer/>}></Route>
      </Routes>
    </div>

   </Router>
  )
}

export default App