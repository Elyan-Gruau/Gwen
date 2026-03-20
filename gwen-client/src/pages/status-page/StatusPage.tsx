import Button from '../../components/reusable/button/Button';
import styles from './StatusPage.module.scss';
import { useGetHealth } from 'gwen-generated-api';

export default function StatusPage() {
  const { data, isLoading, isError, error, refetch } = useGetHealth();

  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.statusCard}>
        <h1 className={styles.title}>Statut du serveur</h1>

        {isLoading && <p className={styles.loading}>Loading...</p>}

        {isError && (
          <div className={styles.error}>
            <p>❌ Erreur connecting to server</p>
            {error instanceof Error && <p className={styles.errorMessage}>{error.message}</p>}
          </div>
        )}

        {data && (
          <div className={styles.statusContent}>
            <div className={styles.statusItem}>
              <span className={styles.label}>Statut:</span>
              <span className={`${styles.value} ${styles.success}`}>✅ {data.status}</span>
            </div>

            <div className={styles.statusItem}>
              <span className={styles.label}>Uptime:</span>
              <span className={styles.value}>{formatUptime(data.uptime)}</span>
            </div>

            <div className={styles.statusItem}>
              <span className={styles.label}>Environnement:</span>
              <span className={styles.value}>{data.environment}</span>
            </div>

            <div className={styles.statusItem}>
              <span className={styles.label}>Timestamp:</span>
              <span className={styles.value}>
                {new Date(data.timestamp).toLocaleString('fr-FR')}
              </span>
            </div>
          </div>
        )}

        <Button
          onClick={() => refetch()}
          variant="primary"
          size="lg"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Reloading...' : 'Reload'}
        </Button>
      </div>
    </div>
  );
}
