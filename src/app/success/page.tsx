const SuccessPage = () => {
  return (
    <main className="min-h-screen bg-[#050505] px-4 py-24 text-foreground">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Checkout Complete</p>
        <h1 className="mt-4 font-heading text-4xl font-bold text-gradient-silver">Thank You For Your Purchase</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Your secure checkout is complete. You can return to the marketplace to browse more products.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex rounded-lg border border-primary/60 bg-primary/10 px-6 py-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-primary transition hover:bg-primary/20"
        >
          Return Home
        </a>
      </div>
    </main>
  );
};

export default SuccessPage;
