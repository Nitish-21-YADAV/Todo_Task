import './globals.css';
import {StoreProvider} from './StoreProvider';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}