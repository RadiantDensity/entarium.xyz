export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="max-w-xl text-center">
        <img
          src="/entarium-logo.png"
          alt="Entarium Logo"
          className="mx-auto mb-8 w-32 h-32 rounded-full shadow-lg"
        />
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">ENTARIUM</h1>
        <p className="text-xl mb-6 font-light opacity-80">
          The Genesis Portal for Independent Artists.<br/>
          Decentralized. Radiant. Limitless.
        </p>
        <form
          action="https://formsubmit.co/launch@entarium.xyz"
          method="POST"
          className="flex flex-col items-center gap-3"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            className="px-4 py-2 rounded-xl text-black w-64"
          />
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl bg-white text-black font-bold shadow transition hover:bg-gray-200"
          >
            Join the Waitlist
          </button>
        </form><a
  href="/essence-upload"
  className="mt-8 inline-block px-8 py-3 rounded-2xl bg-white text-black font-bold shadow transition hover:bg-gray-200"
>
  Upload Your Essence
</a>

        <div className="mt-10 text-xs opacity-50">
          &copy; {new Date().getFullYear()} Entarium – A Radiant Density Initiative
        </div>
      </div>
    </main>
  );
}
