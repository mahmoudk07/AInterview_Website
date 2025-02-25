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
import CompanyCreation from './pages/Company/CompanyCreation/CompanyCreation';
import UpdateInterview from './pages/Company/UpdateInterview/UpdateInterview';
import Followers from './pages/Company/Followers/Followers';
import Users from './pages/Admin/Users/Users';
import Companies from './pages/Admin/Companies/Companies';
import Result from './pages/Company/InterviewsResults/Result';
import Error from './pages/ErrorPage/Error';
import AdminProfile from './pages/Admin/Profile/AdminProfile';
import { Provider } from "react-redux";
import  Quiz from './pages/Interviewers/Quiz';
import UserProfile from './pages/Interviewers/UserProfile';
import UserHome from './pages/Interviewers/userHome';
import UserInterviews from './pages/Interviewers/UserInterviews';
import UserCompanies from './pages/Interviewers/UserCompanies';
import Emails from './pages/Interviewers/Emails';
import ReadyTemp from './pages/Company/ReadyTemp';
import { store } from './store';
function App() {
  return (
    <>
      <Layout>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} errorElement={<Error />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route element={<ProtectedRoute />} errorElement={<Error />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/createInterview" element={<CreateInterview />} />
                <Route path="/interviews" element={<Interviews />} />
                <Route path="/interviewees/:id" element={<Interviewees />} />
                <Route path="/interview/:id" element={<UpdateInterview />} />
                <Route path="/addCompany" element={<CompanyCreation />} />
                <Route path="/followers" element={<Followers />} />
                <Route path="/users" element={<Users />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/result/:id" element={<Result />} />
                <Route path="/Quiz" element={<Quiz />} />
                <Route path="/adminProfile" element={<AdminProfile />} />
                <Route path="/UserProfile" element={<UserProfile />} />
                <Route path="/UserHome" element={<UserHome />} />
                <Route path="/UserInterviews" element={<UserInterviews />} />
                <Route path="/UserCompanies" element={<UserCompanies />} />
                <Route path="/Emails" element={<Emails />} />
                <Route path='/ReadyTemp' element={< ReadyTemp/>}/>
              </Route>
              <Route path="*" element={<Error />} />
            </Routes>
          </BrowserRouter>
        </Provider>
      </Layout>
    </>
  );
}

export default App;
