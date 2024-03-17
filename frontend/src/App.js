import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import Layout from './app/Layout'
import Signup from './pages/Signup/Signup';
import Home from './pages/Home/Home';
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
            </Routes>
          </BrowserRouter>
        </Provider>
      </Layout>
    </>
  );
}

export default App;
