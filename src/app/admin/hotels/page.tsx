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
  MapPin,
  Phone,
  Star as StarIcon,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Dumbbell,
  Waves,
  CheckCircle,
  XCircle,
  Building2,
} from 'lucide-react'

interface Hotel {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  city: string
  cityAr: string
  country: string
  countryAr: string
  address: string
  addressAr: string
  phone: string
  email: string
  website: string
  stars: number
  images: string[]
  amenities: string[]
  checkInTime: string
  checkOutTime: string
  roomTypes: string[]
  priceRange: string
  isActive: boolean
  isFeatured: boolean
  rating: number
  reviewCount: number
  order: number
  createdAt: string
}

const AMENITY_OPTIONS = [
  { id: 'wifi', label: 'واي فاي', labelEn: 'WiFi', icon: Wifi },
  { id: 'parking', label: 'موقف سيارات', labelEn: 'Parking', icon: Car },
  { id: 'restaurant', label: 'مطعم', labelEn: 'Restaurant', icon: Utensils },
  { id: 'pool', label: 'مسبح', labelEn: 'Pool', icon: Waves },
  { id: 'gym', label: 'نادي رياضي', labelEn: 'Gym', icon: Dumbbell },
  { id: 'breakfast', label: 'إفطار', labelEn: 'Breakfast', icon: Coffee },
]

export default function HotelsPage() {
  const { user } = useCurrentUser()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    city: '',
    cityAr: '',
    country: '',
    countryAr: '',
    address: '',
    addressAr: '',
    phone: '',
    email: '',
    website: '',
    stars: 5,
    images: '',
    amenities: [] as string[],
    checkInTime: '14:00',
    checkOutTime: '12:00',
    roomTypes: '',
    priceRange: '',
    isActive: true,
    isFeatured: false,
    order: 0,
  })

  // Fetch hotels
  const fetchHotels = async () => {
    if (!user || user.role !== 'ADMIN') return

    try {
      setLoading(true)
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (user?.id) {
        headers['X-User-Id'] = user.id
      }

      const response = await fetch('/api/admin/hotels', {
        credentials: 'include',
        headers
      })

      if (response.ok) {
        const data = await response.json()
        setHotels(data.hotels || [])
      }
    } catch (error) {
      console.error('Error fetching hotels:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHotels()
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
        roomTypes: formData.roomTypes.split('\n').filter(r => r.trim()),
      }

      const url = editingHotel
        ? `/api/admin/hotels/${editingHotel.id}`
        : '/api/admin/hotels'

      const response = await fetch(url, {
        method: editingHotel ? 'PUT' : 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        await fetchHotels()
        setDialogOpen(false)
        setEditingHotel(null)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving hotel:', error)
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف الفندق؟')) return

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (user?.id) {
        headers['X-User-Id'] = user.id
      }

      const response = await fetch(`/api/admin/hotels/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers,
      })

      if (response.ok) {
        await fetchHotels()
      }
    } catch (error) {
      console.error('Error deleting hotel:', error)
    }
  }

  // Handle edit
  const handleEdit = (hotel: Hotel) => {
    setEditingHotel(hotel)
    setFormData({
      name: hotel.name,
      nameAr: hotel.nameAr,
      description: hotel.description,
      descriptionAr: hotel.descriptionAr,
      city: hotel.city,
      cityAr: hotel.cityAr,
      country: hotel.country,
      countryAr: hotel.countryAr,
      address: hotel.address,
      addressAr: hotel.addressAr,
      phone: hotel.phone,
      email: hotel.email,
      website: hotel.website,
      stars: hotel.stars,
      images: hotel.images.join('\n'),
      amenities: hotel.amenities,
      checkInTime: hotel.checkInTime,
      checkOutTime: hotel.checkOutTime,
      roomTypes: hotel.roomTypes.join('\n'),
      priceRange: hotel.priceRange,
      isActive: hotel.isActive,
      isFeatured: hotel.isFeatured,
      order: hotel.order,
    })
    setDialogOpen(true)
  }

  // Toggle amenity
  const toggleAmenity = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId],
    }))
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      city: '',
      cityAr: '',
      country: '',
      countryAr: '',
      address: '',
      addressAr: '',
      phone: '',
      email: '',
      website: '',
      stars: 5,
      images: '',
      amenities: [],
      checkInTime: '14:00',
      checkOutTime: '12:00',
      roomTypes: '',
      priceRange: '',
      isActive: true,
      isFeatured: false,
      order: 0,
    })
    setEditingHotel(null)
  }

  // Filter hotels
  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.nameAr.includes(searchQuery) ||
    hotel.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.cityAr.includes(searchQuery)
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
                <h1 className="text-3xl font-bold">إدارة الفنادق</h1>
                <p className="text-muted-foreground mt-1">
                  إدارة وتعديل الفنادق المتاحة في المنصة
                </p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open)
                if (!open) resetForm()
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة فندق جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingHotel ? 'تعديل الفندق' : 'إضافة فندق جديد'}
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
                        <Label htmlFor="city">المدينة (إنجليزي) *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cityAr">المدينة (عربي) *</Label>
                        <Input
                          id="cityAr"
                          value={formData.cityAr}
                          onChange={(e) => setFormData({ ...formData, cityAr: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="country">البلد (إنجليزي) *</Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="countryAr">البلد (عربي) *</Label>
                        <Input
                          id="countryAr"
                          value={formData.countryAr}
                          onChange={(e) => setFormData({ ...formData, countryAr: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">العنوان (إنجليزي)</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="addressAr">العنوان (عربي)</Label>
                      <Input
                        id="addressAr"
                        value={formData.addressAr}
                        onChange={(e) => setFormData({ ...formData, addressAr: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">الموقع الإلكتروني</Label>
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="stars">عدد النجوم *</Label>
                        <Select
                          value={formData.stars.toString()}
                          onValueChange={(value) => setFormData({ ...formData, stars: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <SelectItem key={star} value={star.toString()}>
                                {star} نجوم
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="checkInTime">وقت تسجيل الدخول</Label>
                        <Input
                          id="checkInTime"
                          type="time"
                          value={formData.checkInTime}
                          onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="checkOutTime">وقت تسجيل الخروج</Label>
                        <Input
                          id="checkOutTime"
                          type="time"
                          value={formData.checkOutTime}
                          onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="priceRange">نطاق السعر</Label>
                      <Input
                        id="priceRange"
                        value={formData.priceRange}
                        onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                        placeholder="مثال: $$ - $$$"
                      />
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
                      />
                    </div>

                    <div>
                      <Label htmlFor="roomTypes">أنواع الغرف (سطر لكل نوع)</Label>
                      <Textarea
                        id="roomTypes"
                        value={formData.roomTypes}
                        onChange={(e) => setFormData({ ...formData, roomTypes: e.target.value })}
                        rows={3}
                        placeholder="غرفة مفردة&#10;غرفة مزدوجة&#10;جناح"
                      />
                    </div>

                    <div>
                      <Label>المرافق</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {AMENITY_OPTIONS.map((option) => {
                          const Icon = option.icon
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => toggleAmenity(option.id)}
                              className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                                formData.amenities.includes(option.id)
                                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="text-sm">{option.label}</span>
                            </button>
                          )
                        })}
                      </div>
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
                        {editingHotel ? 'حفظ التعديلات' : 'إضافة'}
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
                placeholder="ابحث عن فندق..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {/* Hotels List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredHotels.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  {searchQuery ? 'لم يتم العثور على نتائج' : 'لا توجد فنادق حالياً'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden flex flex-col">
                  {hotel.images.length > 0 && (
                    <div className="h-48 bg-muted relative overflow-hidden">
                      <img
                        src={hotel.images[0]}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex gap-2">
                        {hotel.isFeatured && (
                          <Badge className="bg-amber-500">
                            <StarIcon className="w-3 h-3 ml-1 fill-current" />
                            مميز
                          </Badge>
                        )}
                        {hotel.isActive ? (
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
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full">
                        {Array.from({ length: hotel.stars }).map((_, i) => (
                          <StarIcon key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{hotel.nameAr}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4" />
                      {hotel.cityAr}, {hotel.countryAr}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {hotel.descriptionAr && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {hotel.descriptionAr}
                      </p>
                    )}

                    {hotel.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.amenities.slice(0, 4).map((amenityId) => {
                          const amenity = AMENITY_OPTIONS.find((a) => a.id === amenityId)
                          if (!amenity) return null
                          const Icon = amenity.icon
                          return (
                            <div
                              key={amenityId}
                              className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded"
                            >
                              <Icon className="w-3 h-3" />
                              {amenity.label}
                            </div>
                          )
                        })}
                        {hotel.amenities.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{hotel.amenities.length - 4}
                          </Badge>
                        )}
                      </div>
                    )}

                    {hotel.rating > 0 && (
                      <div className="flex items-center gap-1 text-amber-500 mb-4">
                        <StarIcon className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{hotel.rating}</span>
                        <span className="text-xs text-muted-foreground">
                          ({hotel.reviewCount} تقييم)
                        </span>
                      </div>
                    )}

                    <div className="mt-auto space-y-2">
                      {hotel.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          {hotel.phone}
                        </div>
                      )}
                      {hotel.priceRange && (
                        <div className="text-sm text-emerald-600 font-medium">
                          {hotel.priceRange}
                        </div>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEdit(hotel)}
                        >
                          <Edit className="w-4 h-4 ml-1" />
                          تعديل
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(hotel.id)}
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
