import { Redirect } from 'expo-router';

// Always open the app on Login. The previous welcome screen is kept in the
// project for reference, but is no longer the app's entry screen.
export default function IndexScreen() {
  return <Redirect href="/login" />;
}
