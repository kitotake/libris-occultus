import { useNavigate } from 'react-router-dom';
import BookCover from '../../components/BookCover/BookCover';
import './Home.scss';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="accueil">
      <BookCover onOuvert={() => navigate('/recit')} />
    </div>
  );
}
