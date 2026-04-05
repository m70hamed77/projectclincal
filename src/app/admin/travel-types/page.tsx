'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
} from 'lucide-react'

interface TravelType {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  image: string | null
  icon: string | null
  isActive: boolean
  order: number
  createdAt: string
}

export default function TravelTypesPage() {
  const { user } = useCurrentUser()
  const [travelTypes, setTravelTypes] = useState<TravelType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<TravelType | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    image: '',
    icon: '',
    isActive: true,
    order: 0,
  })

  // Fetch travel types
  const fetchTravelTypes = async () => {
    if (!user || user.role !== 'ADMIN') return

    try {
      setLoading(true)
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (user?.id) {
        headers['X-User-Id'] = user.id
      }

      const response = await fetch('/api/admin/travel-types', {
        credentials: 'include',
        headers
      })

      if (response.ok) {
        const data = await response.json()
        setTravelTypes(data.travelTypes || [])
      }
    } catch (error) {
      console.error('Error fetching travel types:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTravelTypes()
  }, [user])

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (user?.id) {
        headers['X-User-Id'] = user.id
      }

      const url = editingType
        ? `/api/admin/travel-types/${editingType.id}`
        : '/api/admin/travel-types'

      const response = await fetch(url, {
        method: editingType ? 'PUT' : 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchTravelTypes()
        setDialogOpen(false)
        setEditingType(null)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving travel type:', error)
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف نوع السفر هذا؟')) return

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (user?.id) {
        headers['X-User-Id'] = user.id
      }

      const response = await fetch(`/api/admin/travel-types/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers,
      })

      if (response.ok) {
        await fetchTravelTypes()
      }
    } catch (error) {
      console.error('Error deleting travel type:', error)
    }
  }

  // Handle edit
  const handleEdit = (type: TravelType) => {
    setEditingType(type)
    setFormData({
      name: type.name,
      nameAr: type.nameAr,
      description: type.description,
      descriptionAr: type.descriptionAr,
      image: type.image || '',
      icon: type.icon || '',
      isActive: type.isActive,
      order: type.order,
    })
    setDialogOpen(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      image: '',
      icon: '',
      isActive: true,
      order: 0,
    })
    setEditingType(null)
  }

  // Filter travel types
  const filteredTypes = travelTypes.filter(type =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    type.nameAr.includes(searchQuery)
  )

  // Check if user is admin
  if (user && user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation user={user ? { id: user.id, name: user.name || 'مستخدم', email: user.email || '', role: user.role as 'PATIENT' | 'STUDENT' } : undefined} />
        <main className="flex-1 flex items-center justify-center bg-muted/30">
          <Card className="max-w-md mx-4">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">هذه الصفحة متاحة فقط للأدمن</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation user={user ? { id: user.id, name: user.name || 'مستخدم', email: user.email || '', role: user.role as 'PATIENT' | 'STUDENT' } : undefined} />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold">إدارة أنواع السفر</h1>
                <p className="text-muted-foreground mt-1">
                  إدارة وتعديل أنواع السفر المتاحة في المنصة
                </p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open)
                if (!open) resetForm()
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة نوع جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingType ? 'تعديل نوع السفر' : 'إضافة نوع سفر جديد'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">الاسم (إنجليزي) *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="nameAr">الاسم (عربي) *</Label>
                        <Input
                          id="nameAr"
                          value={formData.nameAr}
                          onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">الوصف (إنجليزي)</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="descriptionAr">الوصف (عربي)</Label>
                      <Textarea
                        id="descriptionAr"
                        value={formData.descriptionAr}
                        onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="image">رابط الصورة</Label>
                        <div className="flex gap-2">
                          <Input
                            id="image"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            placeholder="https://..."
                          />
                          <Button type="button" variant="outline" size="icon">
                            <ImageIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="icon">الأيقونة (icon name)</Label>
                        <Input
                          id="icon"
                          value={formData.icon}
                          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                          placeholder="plane, train, bus, etc."
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="order">الترتيب</Label>
                        <Input
                          id="order"
                          type="number"
                          value={formData.order}
                          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="isActive" className="cursor-pointer">نشط</Label>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setDialogOpen(false)
                          resetForm()
                        }}
                      >
                        إلغاء
                      </Button>
                      <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                        {editingType ? 'حفظ التعديلات' : 'إضافة'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن نوع السفر..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {/* Travel Types List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredTypes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  {searchQuery ? 'لم يتم العثور على نتائج' : 'لا توجد أنواع سفر حالياً'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTypes.map((type) => (
                <Card key={type.id} className="overflow-hidden">
                  {type.image && (
                    <div className="h-40 bg-muted relative overflow-hidden">
                      <img
                        src={type.image}
                        alt={type.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        {type.isActive ? (
                          <Badge className="bg-emerald-600">
                            <CheckCircle className="w-3 h-3 ml-1" />
                            نشط
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="w-3 h-3 ml-1" />
                            غير نشط
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{type.nameAr}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{type.name}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        ترتيب: {type.order}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {type.descriptionAr && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {type.descriptionAr}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEdit(type)}
                      >
                        <Edit className="w-4 h-4 ml-1" />
                        تعديل
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(type.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
