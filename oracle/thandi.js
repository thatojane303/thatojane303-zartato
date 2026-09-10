// Thandi - INFO ONLY, not a peg
// Used for Discord /price info, price discovery is Aerodrome DEX
export async function getInfoPrice() {
  return { 
    note: "info-only, DEX price from Aerodrome",
    disclaimer: "Educational meme - no intrinsic value" 
  };
}