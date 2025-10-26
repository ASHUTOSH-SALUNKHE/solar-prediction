const TerminalOverlay = () => {
  return (
    <div className="absolute bottom-[-20] left-12 right-12 sm:left-20 sm:right-20 md:left-40 md:right-40 p-4 lg:left-12 lg:right-12 xl:left-22 xl:right-22">
      <div className="relative bg-cyber-terminal-bg backdrop-blur-lg border border-border rounded-lg p-3 overflow-hidden font-mono">
        {/* Status bar */}
        <div className="flex items-center justify-between mb-2 border-b border-border pb-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-300 animate-pulse"></div>
            <p className="text-xs text-orange-300">SYSTEM ACTIVE</p>
          </div>
          <p className="text-xs text-muted-foreground">ID: SOL-09251</p>
        </div>

        <p className="text-sm text-foreground mb-2 tracking-tight">
          <span className="text-orange-300">/</span> SOLAR ANALYSIS COMPLETE
        </p>

        {/* Scrollable Section */}
        <div className="space-y-1.5 text-xs text-muted-foreground max-h-20 overflow-y-auto pr-2 custom-scrollbar">

          <div className="flex items-start">
            <div className="text-orange-300 mr-2">01</div>
            <span>Recommended Capacity: 3.5 kW</span>
          </div>
          <div className="flex items-start">
            <div className="text-orange-300 mr-2">02</div>
            <span>Panels: 10 × 350W (Area: 20 sq.m)</span>
          </div>
          <div className="flex items-start">
            <div className="text-orange-300 mr-2">03</div>
            <span>Tilt Angle: 23° for optimal performance</span>
          </div>
          <div className="flex items-start">
            <div className="text-orange-300 mr-2">04</div>
            <span>Panel Type: Monocrystalline</span>
          </div>
          <div className="flex items-start">
            <div className="text-orange-300 mr-2">05</div>
            <span>Monthly Generation: 420 kWh</span>
          </div>
          <div className="flex items-start">
            <div className="text-orange-300 mr-2">06</div>
            <span>Monthly Savings: ₹2500</span>
          </div>
          <div className="flex items-start">
            <div className="text-orange-300 mr-2">07</div>
            <span>Estimated Cost: ₹210,000</span>
          </div>
          <div className="flex items-start">
            <div className="text-orange-300 mr-2">08</div>
            <span>Payback Period: 5.2 years</span>
          </div>
          <div className="flex items-start">
            <div className="text-orange-300 mr-2">09</div>
            <span>Maintenance: Clean every 2 weeks</span>
          </div>
          <div className="flex items-start">
            <div className="text-orange-300 mr-2">10</div>
            <span>Note: Use microinverters for shading</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalOverlay;
