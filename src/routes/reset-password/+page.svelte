<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { goto } from "$app/navigation";

    let email = "";
    let isSubmitted = false;
    let isLoading = false;

    async function handleReset(e: Event) {
        e.preventDefault();
        isLoading = true;

        // Simulate API call
        setTimeout(() => {
            isLoading = false;
            isSubmitted = true;
        }, 1500);
    }
</script>

<div class="login-bg min-h-screen flex items-center justify-center page-pad">
    <Card.Root
        class="w-full max-w-sm mx-auto p-8 rounded-2xl shadow-xl bg-white animate-fade-in"
    >
        <Card.Header class="flex flex-col items-center gap-2 mb-4 text-center">
            <Card.Title class="text-2xl font-extrabold tracking-tight"
                >Reset Password</Card.Title
            >
            <Card.Description class="text-gray-600 text-sm">
                {#if !isSubmitted}
                    Enter your email address and we'll send you a link to reset
                    your password.
                {:else}
                    Check your email for the reset link.
                {/if}
            </Card.Description>
        </Card.Header>
        <Card.Content>
            {#if !isSubmitted}
                <form
                    on:submit|preventDefault={handleReset}
                    class="flex flex-col gap-6"
                >
                    <div class="grid gap-2">
                        <Label for="email" class="">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            bind:value={email}
                            class="modern-input"
                        />
                    </div>

                    <Button
                        type="submit"
                        class="w-full modern-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>

                    <div class="text-center mt-2">
                        <a
                            href="/login"
                            class="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium flex items-center justify-center gap-1"
                        >
                            &larr; Back to Login
                        </a>
                    </div>
                </form>
            {:else}
                <div class="flex flex-col gap-6 items-center">
                    <div
                        class="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-8 w-8 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <p class="text-center text-gray-600">
                        We have sent a password reset link to <span
                            class="font-semibold text-gray-900">{email}</span
                        >. Please check your inbox and spam folder.
                    </p>
                    <Button
                        variant="outline"
                        class="w-full"
                        on:click={() => goto("/login")}
                    >
                        Back to Login
                    </Button>
                    <button
                        class="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        on:click={() => (isSubmitted = false)}
                    >
                        Different email?
                    </button>
                </div>
            {/if}
        </Card.Content>
    </Card.Root>
</div>

<style>
    .login-bg {
        background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
    }
    .animate-fade-in {
        animation: fadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    }
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(24px);
        }
        to {
            opacity: 1;
            transform: none;
        }
    }
    .modern-input {
        padding: 1rem 1.25rem;
        border-radius: 0.75rem;
        border: 1px solid #e5e7eb;
        background: #f9fafb;
        color: #222;
        font-size: 1.05rem;
        outline: none;
        transition:
            border 0.2s,
            box-shadow 0.2s;
        margin-bottom: 0;
        box-shadow: 0 1px 2px 0 rgba(31, 38, 135, 0.03);
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
        font-size: 1.1rem;
        background: #1e293b;
        color: #fff;
        border: none;
        cursor: pointer;
        transition:
            background 0.2s,
            box-shadow 0.2s,
            transform 0.1s;
        box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.04);
    }
    .modern-btn:hover {
        background: #6366f1;
        color: #fff;
        transform: translateY(-2px) scale(1.01);
        box-shadow: 0 4px 16px 0 rgba(99, 102, 241, 0.1);
    }
    .modern-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
    }
</style>
