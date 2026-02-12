const GodRays = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#050505] overflow-hidden">
      {/* Slowly rotating container */}
      <div className="absolute inset-0 animate-[godray-rotate_60s_linear_infinite]">
        {/* Beam 1 */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[50vh] -rotate-45 blur-[100px] animate-[godray-drift_20s_ease-in-out_infinite,godray-pulse_8s_ease-in-out_infinite]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
          }}
        />
        {/* Beam 2 */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[40vh] -rotate-[25deg] blur-[100px] animate-[godray-drift_25s_ease-in-out_infinite_reverse,godray-pulse_10s_ease-in-out_infinite_2s]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
          }}
        />
        {/* Beam 3 */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[35vh] -rotate-[60deg] blur-[100px] animate-[godray-drift_18s_ease-in-out_infinite,godray-pulse_12s_ease-in-out_infinite_4s]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
};

export default GodRays;
