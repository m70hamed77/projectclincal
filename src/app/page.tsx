import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
              <span className="text-2xl">🦷</span>
            </div>
            <span className="text-xl font-bold text-slate-800">
              سمايلي لطب الأسنان
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost">تسجيل الدخول</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                إنشاء حساب
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            منصة تربط بين طلاب طب الأسنان والمرضى
          </h1>
          
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            احصل على علاج أسنان مجاني أو بتكلفة منخفضة من خلال طلاب طب الأسنان تحت إشراف الدكاترة
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?type=student">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8">
                سجل كطالب
              </Button>
            </Link>
            <Link href="/auth/register?type=patient">
              <Button size="lg" variant="outline" className="text-lg px-8 border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                سجل كمريض
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            مميزات المنصة
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "علاج مجاني",
                desc: "احصل على علاج مجاني أو بتكلفة منخفضة من طلاب طب الأسنان المؤهلين",
                icon: "💰"
              },
              {
                title: "طلاب موثّقون",
                desc: "جميع الطلاب موثّقون ولديهم خبرة عملية تحت إشراف دكاترة متخصصين",
                icon: "✅"
              },
              {
                title: "تقييمات شفافة",
                desc: "تقييمات حقيقية من مرضى سابقين تساعدك في اختيار الطالب المناسب",
                icon: "⭐"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            كيف يعمل؟
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  1
                </span>
                للمرضى
              </h3>
              
              <div className="space-y-4">
                {[
                  "تصفح الحالات المتاحة",
                  "قدّم طلب للحالة المناسبة",
                  "انتظر قبول الطالب",
                  "تواصل مع الطالب",
                  "احصل على العلاج"
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span className="text-slate-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center">
                  2
                </span>
                للطلاب
              </h3>
              
              <div className="space-y-4">
                {[
                  "أنشئ حسابك وتم التحقق",
                  "أنشئ بوست للحالات المطلوبة",
                  "استقبل طلبات المرضى",
                  "أكمل الحالات وكسب الخبرة",
                  "ابنِ بورتفوليو احترافي"
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span className="text-slate-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
