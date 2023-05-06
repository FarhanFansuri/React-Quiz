import './App.css';
import React from 'react';
import Login from './components/Login';
import {Routes, Route} from 'react-router-dom'
import Quiz from './components/Quiz';
import NavbarQuiz from './components/Navbar';



class App extends React.Component {
  number = 0;

  constructor(props){
    super(props)
    this.state ={
      time:0,
      nextCom: false,
      data: {}
    }
  }

  render(){
    return(
     <Routes>
      <Route path="/" element={
      <React.Suspense fallback= {<h1 className="mt-5 text-center">Loading...</h1>}>
      <NavbarQuiz/>
      <Quiz/>
      </React.Suspense>
      }/>
      <Route path="/login" element={<Login/>}/>

     </Routes>
    )
  }

}

export default App;
