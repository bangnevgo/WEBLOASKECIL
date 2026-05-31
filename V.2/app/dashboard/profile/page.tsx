'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { User, Mail, Lock, Bell, Shield } from 'lucide-react'
import type { User as UserType } from '@/lib/types/api'

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users/profile')
        const data = await response.json()
        if (data.success) {
          setUser(data.data.user)
          setName(data.data.user.name)
          setBio(data.data.user.bio || '')
        }
      } catch (error) {
        console.log('[v0] Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Nama tidak boleh kosong',
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio }),
      })

      const data = await response.json()
      if (data.success) {
        setUser(data.data.user)
        setEditMode(false)
        toast({
          title: 'Berhasil',
          description: 'Profil Anda telah diperbarui',
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Gagal menyimpan profil',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Terjadi kesalahan',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <p className="text-muted-foreground">Memuat profil...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <p className="text-muted-foreground">Profil tidak ditemukan</p>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Profil Saya</h1>
        <p className="text-muted-foreground text-lg">
          Kelola informasi akun dan preferensi Anda
        </p>
      </div>

      {/* Profile Info */}
      <Card className="mb-6 border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informasi Profil
            </CardTitle>
            <CardDescription>Kelola data pribadi Anda</CardDescription>
          </div>
          <Button
            variant={editMode ? 'destructive' : 'outline'}
            onClick={() => {
              if (editMode) {
                setName(user.name)
                setBio(user.bio || '')
              }
              setEditMode(!editMode)
            }}
          >
            {editMode ? 'Batal' : 'Edit Profil'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nama Lengkap</label>
              {editMode ? (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-border"
                />
              ) : (
                <p className="text-foreground">{user.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <p className="text-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Bio</label>
            {editMode ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ceritakan tentang diri Anda..."
                className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground bg-background"
                rows={4}
              />
            ) : (
              <p className="text-foreground">{user.bio || 'Tidak ada bio'}</p>
            )}
          </div>

          {editMode && (
            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Subscription Info */}
      <Card className="mb-6 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Langganan
          </CardTitle>
          <CardDescription>Informasi paket langganan Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    user.subscription_status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                />
                <p className="capitalize text-foreground">
                  {user.subscription_status === 'active' ? 'Aktif' : 'Gratis'}
                </p>
              </div>
            </div>

            {user.subscription_status === 'active' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Paket</label>
                  <p className="capitalize text-foreground">
                    {user.subscription_plan === 'yearly' ? 'Tahunan' : 'Bulanan'}
                  </p>
                </div>

                {user.subscription_end_date && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Berlaku Hingga</label>
                    <p className="text-foreground">
                      {new Date(user.subscription_end_date).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {user.subscription_status === 'free' && (
            <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
              Upgrade ke Premium
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Keamanan
          </CardTitle>
          <CardDescription>Kelola keamanan akun Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start gap-2">
            <Lock className="w-4 h-4" />
            Ubah Password
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2">
            <Bell className="w-4 h-4" />
            Preferensi Notifikasi
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
