import "./App.css";
import HomePage from "./Pages/Home/HomePage";
import BookSearchh from './Pages/Search/BookSearchh';
import CreateBook from "./Pages/CreateBook/CreateBook";
import BookPage from './Pages/BookPage/BookPage'
import LogInPage from "./Pages/LogIn/LogInPage";
import SignUpPage from "./Pages/SignUp/SignUpPage"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import ProfileReviewsPage from "./Pages/ProfileReviewsPage/ProfileReviewsPage";
import ProfileCollectionsPage from "./Pages/ProfileCollectionsPage/ProfileCollectionsPage";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import AdminPannel from "./Pages/AdminPannel/AdminPannel";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/search' element={<BookSearchh />} />
          <Route path='/createbook' element={<CreateBook />} />
          <Route path='/book/:id' element={<BookPage />}/>
          <Route path='/login' element={<LogInPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/profile/:id' element={<ProfilePage />} />
          <Route path='/profile/:id/reviews' element={<ProfileReviewsPage/>} />
          <Route path='/profile/:id/collections' element={<ProfileCollectionsPage/>} />
          <Route path='/reset-password:token' element={<ResetPassword />}/>
          <Route path='/forgot-password' element={<ForgotPassword />}/>
          <Route path='/admin' element={<AdminPannel />}/>
          <Route />
        </Routes>
      </Router>
    </div>
  );
}

export default App;