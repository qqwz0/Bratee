import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from "./Pages/Home/HomePage";
import BookSearchh from './Pages/Search/BookSearchh';
import BookPage from './Pages/BookPage/BookPage'
import LogInPage from "./Pages/LogIn/LogInPage";
import SignUpPage from "./Pages/SignUp/SignUpPage"
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import ProfileReviewsPage from "./Pages/ProfileReviewsPage/ProfileReviewsPage";
import ProfileCollectionsPage from "./Pages/ProfileCollectionsPage/ProfileCollectionsPage";
import AdminPannel from "./Pages/AdminPannel/AdminPannel";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/search' element={<BookSearchh />} />
          <Route path='/book/:id' element={<BookPage />}/>
          <Route path='/login' element={<LogInPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/profile/:id' element={<ProfilePage />} />
          <Route path='/profile/:id/reviews' element={<ProfileReviewsPage/>} />
          <Route path='/profile/:id/collections' element={<ProfileCollectionsPage/>} />
          <Route path='/admin' element={<AdminPannel />}/>
          <Route />
        </Routes>
      </Router>
    </div>
  );
}

export default App;