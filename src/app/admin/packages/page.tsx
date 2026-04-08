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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Star,
} from 'lucide-react'

interface TravelPackage {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  travelTypeId: string | null
  destination: string
  destinationAr: string
  duration: number
  maxPeople: number
  price: number
  discountPrice: number | null
  images: string[]
  features: string[]
  featuresAr: string[]
  includes: string[]
  includesAr: string[]
  excludes: string[]
  excludesAr: string[]
  isActive: boolean
  isFeatured: boolean
  rating: number
  reviewCount: number
  order: number
  createdAt: string
}

interface TravelType {
  id: string
  name: string
  nameAr: string
}

export default function PackagesPage() {
  const { user } = useCurrentUser()
  const [packages, setPackages] = useState<TravelPackage[]>([])
  const [travelTypes, setTravelTypes] = useState<TravelType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<TravelPackage | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    travelTypeId: '',
    destination: '',
    destinationAr: '',
    duration: 7,
    maxPeople: 10,
    price: 0,
    discountPrice: '',
    images: '',
    features: '',
    featuresAr: '',
    includes: '',
    includesAr: '',
    excludes: '',
    excludesAr: '',
    isActive: true,
    isFeatured: false,
    order: 0,
  })

  // Fetch packages
  const fetchPackages = async () => {
    if (!user || user.role !== 'ADMIN') return

    try {
      setLoading(true)
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (user?.id) {
        headers['X-User-Id'] = user.id
      }

      const response = await fetch('/api/admin/packages', {
        credentials: 'include',
        headers
      })

      if (response.ok) {
        const data = await response.json()
        setPackages(data.packages || [])
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch travel types
  const fetchTravelTypes = async () => {
    if (!user || user.role !== 'ADMIN') return

    try {
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
    }
  }

  useEffect(() => {
    fetchPackages()
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

      const payload = {
        ...formData,
        images: formData.images.split('\n').filter(img => img.trim()),
        features: formData.features.split('\n').filter(f => f.trim()),
        featuresAr: formData.featuresAr.split('\n').filter(f => f.trim()),
        includes: formData.includes.split('\n').filter(i => i.trim()),
        includesAr: formData.includesAr.split('\n').filter(i => i.trim()),
        excludes: formData.excludes.split('\n').filter(e => e.trim()),
        excludesAr: formData.excludesAr.split('\n').filter(e => e.trim()),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
      }

      const url = editingPackage
        ? `/api/admin/packages/${editingPackage.id}`
        : '/api/admin/packages'

      const response = await fetch(url, {
        method: editingPackage ? 'PUT' : 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        await fetchPackages()
        setDialogOpen(false)
        setEditingPackage(null)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving package:', error)
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف الباقة؟')) return

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (user?.id) {
        headers['X-User-Id'] = user.id
      }

      const response = await fetch(`/api/admin/packages/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers,
      })

      if (response.ok) {
        await fetchPackages()
      }
    } catch (error) {
      console.error('Error deleting package:', error)
    }
  }

  // Handle edit
  const handleEdit = (pkg: TravelPackage) => {
    setEditingPackage(pkg)
    setFormData({
      name: pkg.name,
      nameAr: pkg.nameAr,
      description: pkg.description,
      descriptionAr: pkg.descriptionAr,
      travelTypeId: pkg.travelTypeId || '',
      destination: pkg.destination,
      destinationAr: pkg.destinationAr,
      duration: pkg.duration,
      maxPeople: pkg.maxPeople,
      price: pkg.price,
      discountPrice: pkg.discountPrice?.toString() || '',
      images: pkg.images.join('\n'),
      features: pkg.features.join('\n'),
      featuresAr: pkg.featuresAr.join('\n'),
      includes: pkg.includes.join('\n'),
      includesAr: pkg.includesAr.join('\n'),
      excludes: pkg.excludes.join('\n'),
      excludesAr: pkg.excludesAr.join('\n'),
      isActive: pkg.isActive,
      isFeatured: pkg.isFeatured,
      order: pkg.order,
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
      travelTypeId: '',
      destination: '',
      destinationAr: '',
      duration: 7,
      maxPeople: 10,
      price: 0,
      discountPrice: '',
      images: '',
      features: '',
      featuresAr: '',
      includes: '',
      includesAr: '',
      excludes: '',
      excludesAr: '',
      isActive: true,
      isFeatured: false,
      order: 0,
    })
    setEditingPackage(null)
  }

  // Filter packages
  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.nameAr.includes(searchQuery) ||
    pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.destinationAr.includes(searchQuery)
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
                <h1 className="text-3xl font-bold">إدارة الباقات</h1>
                <p className="text-muted-foreground mt-1">
                  إدارة وتعديل باقات السفر المتاحة في المنصة
                </p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open)
                if (!open) resetForm()
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة باقة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPackage ? 'تعديل الباقة' : 'إضافة باقة جديدة'}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="destination">الوجهة (إنجليزي) *</Label>
                        <Input
                          id="destination"
                          value={formData.destination}
                          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="destinationAr">الوجهة (عربي) *</Label>
                        <Input
                          id="destinationAr"
                          value={formData.destinationAr}
                          onChange={(e) => setFormData({ ...formData, destinationAr: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="duration">المدة (أيام) *</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxPeople">الحد الأقصى للأشخاص *</Label>
                        <Input
                          id="maxPeople"
                          type="number"
                          value={formData.maxPeople}
                          onChange={(e) => setFormData({ ...formData, maxPeople: parseInt(e.target.value) || 0 })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="travelTypeId">نوع السفر</Label>
                        <Select
                          value={formData.travelTypeId}
                          onValueChange={(value) => setFormData({ ...formData, travelTypeId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر النوع" />
                          </SelectTrigger>
                          <SelectContent>
                            {travelTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.nameAr}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">السعر ($) *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="discountPrice">سعر الخصم (اختياري)</Label>
                        <Input
                          id="discountPrice"
                          type="number"
                          step="0.01"
                          value={formData.discountPrice}
                          onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
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

                    <div>
                      <Label htmlFor="images">روابط الصور (سطر لكل رابط)</Label>
                      <Textarea
                        id="images"
                        value={formData.images}
                        onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                        rows={3}
                        placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="features">المميزات (إنجليزي) - سطر لكل ميزة</Label>
                      <Textarea
                        id="features"
                        value={formData.features}
                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="featuresAr">المميزات (عربي) - سطر لكل ميزة</Label>
                      <Textarea
                        id="featuresAr"
                        value={formData.featuresAr}
                        onChange={(e) => setFormData({ ...formData, featuresAr: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="includes">يشمل (إنجليزي) - سطر لكل عنصر</Label>
                      <Textarea
                        id="includes"
                        value={formData.includes}
                        onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="includesAr">يشمل (عربي) - سطر لكل عنصر</Label>
                      <Textarea
                        id="includesAr"
                        value={formData.includesAr}
                        onChange={(e) => setFormData({ ...formData, includesAr: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="excludes">لا يشمل (إنجليزي) - سطر لكل عنصر</Label>
                      <Textarea
                        id="excludes"
                        value={formData.excludes}
                        onChange={(e) => setFormData({ ...formData, excludes: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="excludesAr">لا يشمل (عربي) - سطر لكل عنصر</Label>
                      <Textarea
                        id="excludesAr"
                        value={formData.excludesAr}
                        onChange={(e) => setFormData({ ...formData, excludesAr: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <div className="flex items-center gap-2 pt-6">
                        <input
                          type="checkbox"
                          id="isFeatured"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="isFeatured" className="cursor-pointer">مميز</Label>
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
                        {editingPackage ? 'حفظ التعديلات' : 'إضافة'}
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
                placeholder="ابحث عن باقة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {/* Packages List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredPackages.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  {searchQuery ? 'لم يتم العثور على نتائج' : 'لا توجد باقات حالياً'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden flex flex-col">
                  {pkg.images.length > 0 && (
                    <div className="h-48 bg-muted relative overflow-hidden">
                      <img
                        src={pkg.images[0]}
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex gap-2">
                        {pkg.isFeatured && (
                          <Badge className="bg-amber-500">
                            <Star className="w-3 h-3 ml-1 fill-current" />
                            مميز
                          </Badge>
                        )}
                        {pkg.isActive ? (
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
                      {pkg.discountPrice && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="destructive">خصم</Badge>
                        </div>
                      )}
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{pkg.nameAr}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-4 h-4" />
                          {pkg.destinationAr}
                        </div>
                      </div>
                      {pkg.rating > 0 && (
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{pkg.rating}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {pkg.duration} أيام
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        حتى {pkg.maxPeople} أشخاص
                      </div>
                    </div>

                    <div className="mt-auto">
                      {pkg.discountPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-emerald-600">
                            ${pkg.discountPrice}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${pkg.price}
                          </span>
                        </div>
                      ) : (
                        <div className="text-lg font-bold text-emerald-600">
                          ${pkg.price}
                        </div>
                      )}
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEdit(pkg)}
                        >
                          <Edit className="w-4 h-4 ml-1" />
                          تعديل
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDelete(pkg.id)}
                          className="bg-red-800 hover:bg-red-900 text-white font-bold"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
