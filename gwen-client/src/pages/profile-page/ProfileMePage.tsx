import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useAuthContext } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import { useGetCurrentUser } from 'gwen-generated-api';
import Spinner from '../../components/spinner/Spinner';
import UserProfilePic from '../../components/user-profile-pic/UserProfilePic';
import Button from '../../components/reusable/button/Button';
import axios from 'axios';
import styles from './ProfileMePage.module.scss';

type MatchHistoryResult = 'WIN' | 'LOSS' | 'DRAW' | 'ABANDONED';

type MatchHistoryEntry = {
  _id: string;
  opponent_id: string;
  opponent_username: string;
  result: MatchHistoryResult;
  status: 'ACTIVE' | 'FINISHED' | 'ABANDONED';
  created_at?: string;
};

type MatchHistoryPage = {
  content: MatchHistoryEntry[];
  total: number;
  page: number;
  limit: number;
};

const ProfileMePage = () => {
  const { user } = useAuthContext();
  if (!user) {
    return <UserNotLoggedInProfile />;
  }

  return <UserProfile userId={user.id!} />;
};

const UserNotLoggedInProfile = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.notLoggedIn}>
      <h1 className={styles.title}>My Profile</h1>
      <p className={styles.subtitle}>You need to be logged in to view your profile.</p>
      <Button type="button" onClick={() => navigate(ROUTES.LOGIN)}>
        Go to login
      </Button>
    </div>
  );
};

interface UserProfileProps {
  userId: string;
}

const UserProfile = ({ userId }: UserProfileProps) => {
  const { data: currentUser, isLoading } = useGetCurrentUser();
  const { logout } = useAuthContext();

  if (isLoading) {
    return <Spinner />;
  }

  if (!currentUser) {
    return <div> Current user not found.</div>;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>My Profile</h1>
          <p className={styles.subtitle}>Overview of your account and favorite deck.</p>
        </div>
        <div className={styles.identity}>
          <UserProfilePic userId={userId} />
          <div>
            <div className={styles.username}>{currentUser.username}</div>
            <div className={styles.subtitle}>{currentUser.email}</div>
          </div>
        </div>
      </header>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Account</h2>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>User ID</span>
            <span className={styles.statValue}>{currentUser.id}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Username</span>
            <span className={styles.statValue}>{currentUser.username}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Email</span>
            <span className={styles.statValue}>{currentUser.email}</span>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Profile</h2>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Bio</span>
            <span className={styles.statValue}>{currentUser.bio || 'No bio'}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Elo</span>
            <span className={styles.statValue}>{currentUser.elo}</span>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Favorite deck</h2>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Deck ID</span>
            <span className={styles.statValue}>
              {currentUser.favorite_deck ? currentUser.favorite_deck : 'Not set'}
            </span>
          </div>
          <p className={styles.hint}>You can set your favorite deck from the deck builder.</p>
        </section>
      </div>

      <MatchHistory userId={userId} />

      <div className={styles.actions}>
        <Button variant="danger" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

const RESULT_LABEL: Record<MatchHistoryResult, string> = {
  WIN: 'Win',
  LOSS: 'Loss',
  DRAW: 'Draw',
  ABANDONED: 'Abandoned',
};

const MatchHistory = ({ userId }: { userId: string }) => {
  const { data, isLoading } = useQuery<MatchHistoryPage>({
    queryKey: ['matchHistory', userId],
    queryFn: async () => {
      const res = await axios.get<MatchHistoryPage>(`/games/history/${userId}?page=0&limit=10`);
      return res.data;
    },
    enabled: !!userId,
  });

  return (
    <section className={styles.historySection}>
      <h2 className={styles.cardTitle}>Match History</h2>
      {isLoading && <Spinner />}
      {!isLoading && (!data || data.content.length === 0) && (
        <p className={styles.hint}>No games played yet.</p>
      )}
      {data && data.content.length > 0 && (
        <table className={styles.historyTable}>
          <thead>
            <tr>
              <th>Opponent</th>
              <th>Result</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.content.map((entry) => (
              <tr key={entry._id} className={styles[`result${entry.result}`]}>
                <td>{entry.opponent_username}</td>
                <td>
                  <span className={`${styles.resultBadge} ${styles[`resultBadge${entry.result}`]}`}>
                    {RESULT_LABEL[entry.result]}
                  </span>
                </td>
                <td className={styles.historyDate}>
                  {entry.created_at
                    ? new Date(entry.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {data && data.total > data.limit && (
        <p className={styles.hint}>
          {data.total} games total — showing last {data.limit}
        </p>
      )}
    </section>
  );
};

export default ProfileMePage;
