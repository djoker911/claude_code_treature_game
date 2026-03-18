import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { api } from '../lib/api';

interface AuthScreenProps {
  onAuth: (username: string, token: string) => void;
  onGuest: () => void;
}

function AuthForm({ mode, onAuth }: { mode: 'signin' | 'signup'; onAuth: (u: string, t: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = mode === 'signin'
        ? await api.signin(username, password)
        : await api.signup(username, password);
      onAuth(data.username, data.token);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor={`${mode}-username`} className="text-amber-900">Username</Label>
        <Input
          id={`${mode}-username`}
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter username"
          className="border-amber-300 focus:ring-amber-500"
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${mode}-password`} className="text-amber-900">Password</Label>
        <Input
          id={`${mode}-password`}
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter password"
          className="border-amber-300 focus:ring-amber-500"
          required
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
      >
        {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </Button>
    </form>
  );
}

export default function AuthScreen({ onAuth, onGuest }: AuthScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl mb-8 text-amber-900">🏴‍☠️ Treasure Hunt Game 🏴‍☠️</h1>
      <Card className="w-full max-w-sm border-amber-300 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-amber-900">Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="w-full mb-4 bg-amber-100">
              <TabsTrigger value="signin" className="flex-1 data-[state=active]:bg-amber-600 data-[state=active]:text-white">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1 data-[state=active]:bg-amber-600 data-[state=active]:text-white">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <AuthForm mode="signin" onAuth={onAuth} />
            </TabsContent>
            <TabsContent value="signup">
              <AuthForm mode="signup" onAuth={onAuth} />
            </TabsContent>
          </Tabs>
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={onGuest}
              className="text-amber-700 hover:text-amber-900 hover:bg-amber-100"
            >
              Play as Guest
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
