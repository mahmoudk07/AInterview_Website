import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './app/ProtectedRoutes';
import Login from './pages/Interviewee/Login/Login';
import Layout from './app/Layout'
import Signup from './pages/Interviewee/Signup/Signup';
import Home from './pages/Company/Home/Home';
import Profile from './pages/Company/Profile/Profile';
import CreateInterview from './pages/Company/CreateInterview/CreateInterview';
import Interviews from './pages/Company/Interviews/Interviews';
import Interviewees from './pages/Company/Interviewees/Interviewees';
import CompanyCreation from './pages/CompanyCreation/CompanyCreation';
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
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/createInterview" element={<CreateInterview />} />
                <Route path="/interviews" element={<Interviews />} />
                <Route path="/interviewees/:id" element={<Interviewees />} />
                <Route path="/addCompany" element={<CompanyCreation />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </Provider>
      </Layout>
    </>
  );
}

export default App;
