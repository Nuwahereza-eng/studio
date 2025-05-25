import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/dashboard');
  // return null; // redirect doesn't require a return null when it's the last statement
}
