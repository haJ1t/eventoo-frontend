<script lang="ts">
 import { Button } from "$lib/components/ui/button/index.js";
 import { Label } from "$lib/components/ui/label/index.js";
 import { Input } from "$lib/components/ui/input/index.js";
 import * as Card from "$lib/components/ui/card/index.js";
 import { goto } from '$app/navigation';
 let email = '';
 let password = '';
 let showPassword = false;
 let keepSignedIn = false;
 let error = '';

 async function handleLogin(e: Event) {
   e.preventDefault();
   if (email === 'admin' && password === 'admin') {
     error = '';
     await goto('/');
   } else {
     error = 'Invalid email or password';
   }
 }
 function handleGoogleLogin() {
   alert('Google login is not implemented yet.');
 }
</script>

<div class="login-bg min-h-screen flex items-center justify-center">
 <Card.Root class="w-full max-w-sm mx-auto p-8 rounded-2xl shadow-xl bg-white animate-fade-in">
  <Card.Header class="flex flex-col items-center gap-2 mb-2">
    <Card.Title class="text-2xl font-extrabold tracking-tight">Login to Evento</Card.Title>
    <Card.Description class="text-gray-600 text-sm">
      Welcome back! Please enter your details.
    </Card.Description>
  </Card.Header>
  <Card.Content>
   <form on:submit|preventDefault={handleLogin} class="flex flex-col gap-7">
    <div class="grid gap-2">
     <Label for="email">Email</Label>
     <Input id="email" type="email" placeholder="m@example.com" required bind:value={email} autocomplete="username" class="modern-input" />
    </div>
    <div class="grid gap-2">
     <div class="flex items-center">
      <Label for="password">Password</Label>
      <a
       href="#"
       class="ml-auto inline-block text-sm underline-offset-4 hover:underline text-blue-600 hover:text-blue-800 transition-colors"
      >
       Forgot your password?
      </a>
     </div>
     <Input id="password" type={showPassword ? 'text' : 'password'} required bind:value={password} autocomplete="current-password" class="modern-input" />
     <div class="flex items-center gap-4 mt-1">
      <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
        <input type="checkbox" bind:checked={showPassword} /> Show password
        <input type="checkbox" bind:checked={keepSignedIn} /> Keep me signed in
      </label>
     </div>
     {#if error}
      <div class="text-red-500 text-sm font-medium mt-2">{error}</div>
     {/if}
    </div>
    <Button type="submit" class="w-full modern-btn" formnovalidate>Login</Button>
    <div class="divider">or</div>
    <Button variant="outline" class="w-full modern-btn-google" type="button" on:click={handleGoogleLogin}>
     <svg class="google-icon mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.44c-.54 2.9-2.18 5.36-4.64 7.01l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.09a14.5 14.5 0 0 1 0-8.18l-7.98-6.2A23.94 23.94 0 0 0 0 24c0 3.77.9 7.34 2.69 10.44l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.18 0 11.36-2.05 15.15-5.57l-7.19-5.6c-2.01 1.35-4.59 2.16-7.96 2.16-6.38 0-11.87-3.63-14.33-8.94l-7.98 6.2C6.73 42.52 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
     Login with Google
    </Button>
   </form>
   <div class="text-center mt-2">
    <span class="text-sm text-gray-500">Don't have an account?</span>
    <a href="./register" class="text-sm text-blue-600 hover:text-blue-800 transition-colors">Sign Up</a>
  </div>
  </Card.Content>
 </Card.Root>
</div>

<style>
.login-bg {
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
}
.logo-circle {
  background: #f1f5f9;
  border-radius: 50%;
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.07);
}
.animate-fade-in {
  animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: none; }
}
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #b0b0b0;
  font-size: 0.95rem;
}
.divider::before, .divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e5e7eb;
}
.google-icon {
  width: 1.3rem;
  height: 1.3rem;
  display: inline-block;
  vertical-align: middle;
}
.text-red-500 {
  color: #ef4444;
}
.modern-input {
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #222;
  font-size: 1.08rem;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  margin-bottom: 0;
  box-shadow: 0 1px 2px 0 rgba(31,38,135,0.03);
}
.modern-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px #6366f133;
  background: #fff;
}
.modern-btn {
  padding: 0.95rem 1.25rem;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 1.13rem;
  background: #1e293b;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.04);
}
.modern-btn:hover {
  background: #6366f1;
  color: #fff;
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 4px 16px 0 rgba(99, 102, 241, 0.10);
}
.modern-btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.9rem 1.25rem;
  border-radius: 0.75rem;
  background: #fff;
  color: #222;
  font-weight: 600;
  font-size: 1.05rem;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: box-shadow 0.2s, border 0.2s, transform 0.1s;
  box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.04);
}
.modern-btn-google:hover {
  border: 1px solid #4285F4;
  box-shadow: 0 4px 16px 0 rgba(66, 133, 244, 0.08);
  transform: translateY(-2px) scale(1.01);
}
@media (max-width: 640px) {
  .p-8 { padding: 1.25rem !important; }
  .mt-16 { margin-top: 1.5rem !important; }
  .modern-btn, .modern-btn-google { font-size: 1rem; padding: 0.8rem 1rem; }
  .logo-circle { width: 2.5rem; height: 2.5rem; }
}
</style> 