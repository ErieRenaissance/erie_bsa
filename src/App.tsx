import { BrowserRouter as Router } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { AppRoutes } from './routes';
import { QueryProvider } from './providers/QueryProvider';

function App() {
  return (
    <QueryProvider>
      <Router>
        <Layout>
          <AppRoutes />
        </Layout>
      </Router>
    </QueryProvider>
  );
}

export default App;