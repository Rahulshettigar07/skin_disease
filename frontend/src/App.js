import './App.css';
import {BrowserRouter,Route,Routes } from 'react-router-dom';
import Signup from './components/signup';
import Login from './components/login';
import DoctorList from './components/doctor_list';
import DoctorProfile from './components/doctor_profile';
import ChatPage from './components/chat-user-interface';
import ChatHistory from './components/user-chat-history';
import DoctorLogin from './components/doctor-interface/doctor-login';
import DoctorChatHistory from './components/doctor-interface/doctor-interface';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login></Login>}></Route> 
        <Route path='/signup' element={<Signup></Signup>}></Route> 
        <Route path='/doctors' element={<DoctorList></DoctorList>}></Route> 
        <Route path='/doctors/:doctorId' element={<DoctorProfile></DoctorProfile>}></Route>
        <Route path='/chat/:Id' element={<ChatPage></ChatPage>}></Route>
        <Route path='/chats' element={<ChatHistory></ChatHistory> } ></Route>
        <Route path='/doctor-login' element={<DoctorLogin></DoctorLogin>}></Route>
        <Route path='/doctor-interface' element={<DoctorChatHistory></DoctorChatHistory>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
