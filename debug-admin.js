// Debug script untuk cek admin access
console.log("🔍 Debug Admin Access\n")

// Simulasi localStorage yang ada setelah login admin
const mockLocalStorage = {
  'nv-app-state': JSON.stringify({
    userName: 'Admin User',
    subscriptionTier: 'master',
    isAdmin: true,
    completedLessons: []
  })
}

console.log("1. Cek isi localStorage:")
const appState = JSON.parse(mockLocalStorage['nv-app-state'])
console.log("   - userName:", appState.userName)
console.log("   - subscriptionTier:", appState.subscriptionTier)
console.log("   - isAdmin:", appState.isAdmin)

console.log("\n2. Test akses:")
console.log("   - hasCurriculumAccess:", (appState.subscriptionTier === 'pelajar' || appState.subscriptionTier === 'premium' || appState.subscriptionTier === 'master' || appState.isAdmin))
console.log("   - hasCommunityAccess:", (appState.subscriptionTier === 'premium' || appState.subscriptionTier === 'master' || appState.isAdmin))

console.log("\n3. Kesimpulan:")
if (appState.isAdmin && appState.subscriptionTier === 'master') {
  console.log("   ✅ Status: ADMIN FULL ACCESS - Semua harus terbuka")
} else {
  console.log("   ❌ Status: Tidak valid - Masalah di store logic")
}