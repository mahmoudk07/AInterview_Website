import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Interviewee/Login/Login';
import Layout from './app/Layout'
import Signup from './pages/Interviewee/Signup/Signup';
import Home from './pages/Company/Home/Home';
import Profile from './pages/Company/Profile/Profile';
import CreateInterview from './pages/Company/CreateInterview/CreateInterview';
import { Provider } from "react-redux";
import { store } from './store';
function App() {
  return (
    <>
      <Layout>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/interview" element={<CreateInterview />} />
            </Routes>
          </BrowserRouter>
        </Provider>
      </Layout>
    </>
  );
}

export default App;
