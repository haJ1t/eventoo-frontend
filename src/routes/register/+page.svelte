<script lang="ts">
 import { Button } from "$lib/components/ui/button/index.js";
 import { Label } from "$lib/components/ui/label/index.js";
 import { Input } from "$lib/components/ui/input/index.js";
 import * as Card from "$lib/components/ui/card/index.js";
 import { goto } from '$app/navigation';
 import { registerAccount } from "$lib/services/api";
 let name = '';
 let email = '';
 let password = '';
 let confirmPassword = '';
 let showPassword = false;
 let error = '';

 async function handleRegister(e: Event) {
   e.preventDefault();
   if (!name || !email || !password || !confirmPassword) {
     error = 'Please fill in all fields.';
     return;
   }
   if (password !== confirmPassword) {
     error = 'Passwords do not match.';
     return;
   }
   try {
     error = '';
     await registerAccount({ name, email, password });
     await goto('/home');
   } catch (err: any) {
     error = err.message || 'Failed to register.';
   }
 }
</script>

<div class="login-bg min-h-screen flex items-center justify-center animate-fade-in">
 <Card.Root class="w-full max-w-sm mx-auto p-8 rounded-2xl shadow-xl bg-white animate-fade-in">
  <Card.Header class="flex flex-col items-center gap-2 mb-2">
    <Card.Title class="text-2xl font-extrabold tracking-tight">Sign Up for Evento</Card.Title>
    <Card.Description class="text-gray-600 text-sm">
      Create your account to get started.
    </Card.Description>
  </Card.Header>
  <Card.Content class="">
   <form on:submit|preventDefault={handleRegister} class="flex flex-col gap-7">
    <div class="grid gap-2">
     <Label for="name" class="">Name</Label>
     <Input id="name" type="text" placeholder="Your name" required bind:value={name} class="" />
    </div>
    <div class="grid gap-2">
     <Label for="email" class="">Email</Label>
     <Input id="email" type="email" placeholder="m@example.com" required bind:value={email} class="" />
    </div>
    <div class="grid gap-2">
     <Label for="password" class="">Password</Label>
     <Input id="password" type={showPassword ? 'text' : 'password'} required bind:value={password} class="" />
    </div>
    <div class="grid gap-2">
     <Label for="confirmPassword" class="">Confirm Password</Label>
     <Input id="confirmPassword" type={showPassword ? 'text' : 'password'} required bind:value={confirmPassword} class="" />
    </div>
    <div class="flex items-center gap-4 mt-1">
      <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
        <input type="checkbox" bind:checked={showPassword} /> Show password
      </label>
    </div>
    {#if error}
      <div class="text-red-500 text-sm font-medium mt-2">{error}</div>
    {/if}
    <Button type="submit" class="w-full" disabled={false}>Sign Up</Button>
    <div class="text-center mt-2">
      <span class="text-sm text-gray-500">Already have an account?</span>
      <a href="./login" class="text-sm text-blue-600 hover:text-blue-800 transition-colors">Login</a>
    </div>
   </form>
  </Card.Content>
 </Card.Root>
</div>

<style>
.login-bg {
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
}
.animate-fade-in {
  animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: none; }
}
.text-red-500 {
  color: #ef4444;
}
</style> 
