import {  BrowserRouter as Router,Route,Routes , } from 'react-router-dom'
import Home from './screens/Home'
import Login from './screens/Login'
import Signup from './screens/Signup'
import CarPlateViewer from './screens/CarPlateViewer'
const App = () => {
  return (
   <Router>
    <div>
      <Routes>
        <Route exact path="/" element={<Home/>}></Route>
        <Route exact path="/login" element={<Login/>}></Route>
        <Route exact path="/createuser" element={<Signup/>}></Route>
        <Route exact path="/data" element={<CarPlateViewer/>}></Route>
      </Routes>
    </div>

   </Router>
  )
}

export default App