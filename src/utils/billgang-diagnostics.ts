/**
 * Billgang SDK Diagnostics Utility
 * Run this in browser console: window.checkBillgang()
 */

export const runBillgangDiagnostics = () => {
  console.group("🔍 Billgang SDK Diagnostics");

  // Check 1: Script tag exists
  const scriptTag = document.querySelector('script[src*="billgang"]');
  console.log("✓ Script tag in DOM:", !!scriptTag);
  if (scriptTag) {
    console.log("  - Source:", scriptTag.getAttribute('src'));
    console.log("  - Loaded:", (scriptTag as HTMLScriptElement).complete);
  }

  // Check 2: window.Billgang exists
  const hasBillgang = !!(window as any).Billgang;
  console.log("✓ window.Billgang exists:", hasBillgang);

  if (hasBillgang) {
    console.log("  - Type:", typeof (window as any).Billgang);
    console.log("  - Methods:", Object.keys((window as any).Billgang));
  }

  // Check 3: All window properties containing 'bill'
  const billProps = Object.keys(window).filter(k => k.toLowerCase().includes('bill'));
  console.log("✓ Window properties with 'bill':", billProps);

  // Check 4: Network request status
  console.log("\n💡 Next steps:");
  console.log("1. Open DevTools > Network tab");
  console.log("2. Filter for 'billgang'");
  console.log("3. Look for failed requests (red) or blocked requests");
  console.log("4. Check if embed.js loaded successfully (status 200)");

  console.groupEnd();

  return {
    scriptTagExists: !!scriptTag,
    scriptLoaded: scriptTag ? (scriptTag as HTMLScriptElement).complete : false,
    windowBillgangExists: hasBillgang,
    billgangType: hasBillgang ? typeof (window as any).Billgang : null,
  };
};

// Expose to window for easy console access
if (typeof window !== 'undefined') {
  (window as any).checkBillgang = runBillgangDiagnostics;
}
