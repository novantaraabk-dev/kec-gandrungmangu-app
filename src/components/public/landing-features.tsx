import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart3, Database, FileText, ShieldCheck } from "lucide-react"

export function LandingFeatures() {
  const features = [
    {
      icon: <Database className="w-8 h-8 text-primary" />,
      title: "Data Terpusat & Real-time",
      description: "Semua data desa, mulai dari kependudukan hingga APBDes, terintegrasi dalam satu platform yang mudah diakses."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: "Visualisasi & Laporan",
      description: "Monitor progres desa melalui grafik interaktif dan hasilkan laporan akurat dengan beberapa klik saja."
    },
    {
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: "Manajemen Dokumen",
      description: "Arsipkan produk hukum desa seperti Perdes, Perkades, dan SK secara digital. Aman dan mudah dicari."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: "Keamanan Data Terjamin",
      description: "Dibangun dengan standar keamanan modern untuk memastikan data desa Anda selalu aman dan terlindungi."
    },
  ]

  return (
    <section id="features" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Fitur Unggulan</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            Satu Platform untuk Semua Kebutuhan Desa
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            SOLID dirancang untuk menyederhanakan administrasi, meningkatkan transparansi, dan mempercepat pembangunan desa.
          </p>
        </div>

        <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-card hover:shadow-lg transition-shadow duration-300 rounded-2xl">
              <CardHeader className="p-6">
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-lg font-bold font-headline">{feature.title}</CardTitle>
                <CardDescription className="mt-2 text-base text-muted-foreground">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
